import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Product, Coupon } from '../shared';
import { seedDatabaseIfEmpty, forceSeed } from '../data/seeder';
import { sendLineMessage } from '../services/notification.service';
import { logger } from '../utils/logger';
import { checkoutSchema, couponQuerySchema, paymentCreateSchema } from './schemas';
import rateLimit from 'express-rate-limit';

interface OrderItem {
  product_id: number;
  name: string;
  qty: number;
  price: number;
  cold: boolean;
  emoji: string;
  spec: string;
}

const db = admin.firestore();
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Firebase Hosting Rewrite 會保留原始路徑，而直接呼叫 Function 會移除 function name。
// 統一將路徑中的 /api 移除，讓後端路由判斷更一致。
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    req.url = req.url.replace(/^\/api/, '');
  }
  next();
});

// LINE Login 驗證接口
app.post('/auth/line', async (req, res) => {
  const { code, redirectUri } = req.body;
  const channelId = functions.config().line?.channel_id || process.env.LINE_CHANNEL_ID;
  const channelSecret = functions.config().line?.channel_secret || process.env.LINE_CHANNEL_SECRET;

  try {
    // 1. 拿 code 向 LINE 交換 Access Token
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: channelId!,
        client_secret: channelSecret!,
      }),
    });
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok)
      throw new Error(tokenData.error_description || 'LINE Token Exchange Failed');

    // 2. 拿 Access Token 獲取用戶資料
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();

    // 3. 建立或更新 Firebase 用戶，並生成 Custom Token
    const uid = `line:${profile.userId}`;
    await admin
      .auth()
      .updateUser(uid, {
        displayName: profile.displayName,
        photoURL: profile.pictureUrl,
      })
      .catch(async (error) => {
        if (error.code === 'auth/user-not-found') {
          return admin.auth().createUser({
            uid,
            displayName: profile.displayName,
            photoURL: profile.pictureUrl,
          });
        }
        throw error;
      });

    const customToken = await admin.auth().createCustomToken(uid);
    res.json({ customToken, profile });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('LINE Login Error:', error);
    res.status(500).json({ error: message });
  }
});

const checkoutLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, error: '點擊過於頻繁！請 10 分鐘後再試。' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/seed', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  // 🛡️ 安全機制：保護 /seed 端點，防止惡意使用者清空或重置生產環境資料庫
  if (!apiKey || apiKey !== (process.env.ADMIN_API_KEY || 'yogo-secret-admin-key-2026')) {
    return res.status(403).json({ success: false, error: '權限不足 (Unauthorized)' });
  }

  try {
    await forceSeed(db);
    return res.status(200).json({ success: true, message: 'Database successfully seeded!' });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

app.get('/products', async (req, res) => {
  try {
    await seedDatabaseIfEmpty(db);
    const snapshot = await db.collection('products').orderBy('id', 'asc').get();
    const products: Product[] = [];
    snapshot.forEach((doc) => products.push(doc.data() as Product));
    res.status(200).json(products);
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

app.get('/coupon', async (req, res) => {
  try {
    await seedDatabaseIfEmpty(db);
    const validation = couponQuerySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error.issues[0].message });
    }
    const { code } = validation.data;

    const doc = await db.collection('coupons').doc(code.toUpperCase()).get();
    if (!doc.exists) return res.status(404).json({ success: false, error: '無此優惠碼！' });

    const coupon = doc.data() as Coupon;
    if (!coupon || !coupon.active)
      return res.status(400).json({ success: false, error: '此優惠碼已停用' });

    const expiresAt = new Date(coupon.expiresAt);
    if (expiresAt.getTime() < Date.now())
      return res.status(400).json({ success: false, error: '此優惠碼已過期！' });

    return res.status(200).json({ success: true, coupon });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

app.post('/checkout', checkoutLimiter, async (req, res) => {
  const validation = checkoutSchema.safeParse(req.body);
  if (!validation.success) {
    return res
      .status(400)
      .json({ success: false, error: '資料驗證失敗', details: validation.error.format() });
  }

  const {
    customer,
    cart,
    couponCode,
    preferred_delivery_date,
    user_uid: clientUid,
  } = validation.data;

  // 🛡️ 安全機制：驗證 Firebase Auth ID Token (JWT) 以防偽造 user_uid
  let verifiedUid: string | null = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      verifiedUid = decodedToken.uid;
    } catch {
      return res.status(401).json({ success: false, error: '無效的登入憑證 (Invalid Token)' });
    }
  }

  // 確保如果前端有傳 user_uid，必須和驗證過的 token 相符 (訪客模式 verifiedUid 為 null，但 clientUid 會是 undefined)
  if (clientUid && clientUid !== verifiedUid) {
    return res
      .status(403)
      .json({ success: false, error: '權限異常：帳號身分不符 (Spoofing Detected)' });
  }

  const finalUserUid = verifiedUid;

  if (Object.keys(cart).length === 0) {
    return res.status(400).json({ success: false, error: '購物車為空，無法結帳！' });
  }

  try {
    const now = new Date();
    const taipeiDate = new Intl.DateTimeFormat('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
    const todayStr = taipeiDate.replace(/\//g, '');
    const startId = `#ORD-${todayStr}-000`;
    const endId = `#ORD-${todayStr}-999`;

    let appliedCoupon: Coupon | null = null;
    if (couponCode) {
      const couponDoc = await db.collection('coupons').doc(couponCode.toUpperCase()).get();
      if (couponDoc.exists) {
        const cData = couponDoc.data() as Coupon;
        if (cData && cData.active && new Date(cData.expiresAt).getTime() > Date.now()) {
          appliedCoupon = cData;
        }
      }
    }

    const result = await db.runTransaction(async (transaction) => {
      const productDocs: { [id: number]: admin.firestore.DocumentSnapshot } = {};
      const itemDetails: OrderItem[] = [];
      let calculatedTotal = 0;

      for (const pidStr of Object.keys(cart)) {
        const pid = Number(pidStr);
        const qty = Number(cart[pidStr]);
        if (qty <= 0) continue;

        const docRef = db.collection('products').doc(String(pid));
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists) throw new Error(`商品 ID ${pid} 不存在！`);

        const pData = docSnap.data() as Product;
        if (pData.stock < qty)
          throw new Error(`[${pData.name}] 庫存不足，剩餘 ${pData.stock} 件。`);

        productDocs[pid] = docSnap;
        calculatedTotal += pData.price * qty;
        itemDetails.push({
          product_id: pid,
          name: pData.name,
          qty,
          price: pData.price,
          cold: pData.cold,
          emoji: pData.emoji,
          spec: pData.spec,
        });
      }

      if (itemDetails.length === 0) throw new Error('購物車無有效商品！');

      let discountAmount = 0;
      if (appliedCoupon && calculatedTotal >= appliedCoupon.minOrderAmount) {
        discountAmount =
          appliedCoupon.type === 'fixed'
            ? appliedCoupon.value
            : Math.round(calculatedTotal * (appliedCoupon.value / 100));
      }

      for (const pidStr of Object.keys(cart)) {
        const pid = Number(pidStr);
        const qty = Number(cart[pidStr]);
        if (qty <= 0) continue;
        const docSnap = productDocs[pid];
        const pData = docSnap.data() as Product;
        transaction.update(docSnap.ref, { stock: pData.stock - qty });
      }

      const ordersSnapshot = await transaction.get(
        db
          .collection('orders')
          .orderBy(admin.firestore.FieldPath.documentId())
          .startAt(startId)
          .endAt(endId)
      );
      const orderId = `#ORD-${todayStr}-${String(ordersSnapshot.size + 1).padStart(3, '0')}`;
      const finalPrice = Math.max(0, calculatedTotal - discountAmount);
      const orderData = {
        user_uid: finalUserUid || null,
        cust_name: customer.name,
        cust_phone: customer.phone,
        cust_contact: customer.contact,
        cust_address: customer.address,
        total_price: finalPrice,
        original_price: calculatedTotal,
        discount: discountAmount,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        shipping_fee: null,
        status: 'pending',
        tracking_number: null,
        created_at: admin.firestore.Timestamp.fromDate(now),
        confirmed_at: null,
        shipped_at: null,
        preferred_delivery_date: preferred_delivery_date || null,
        items: itemDetails,
      };
      transaction.set(db.collection('orders').doc(orderId), orderData);
      return { orderId, orderData };
    });

    const itemsMessage = result.orderData.items
      .map((item: OrderItem) => `• ${item.emoji} ${item.name} (${item.qty}件)`)
      .join('\n');
    const lineMsg = `
🌱 YoGo 有夠菜 — 新預購訂單！
━━━━━━━━━━━━━━━━━━
🆔 訂單編號: ${result.orderId}
👤 顧客姓名: ${result.orderData.cust_name}
📍 配送地址: ${result.orderData.cust_address}${preferred_delivery_date ? `\n📅 希望配送日: ${preferred_delivery_date}` : ''}
━━━━━━━━━━━━━━━━━━
🛒 預購明細:
${itemsMessage}${result.orderData.coupon_code ? `\n🎫 優惠碼: ${result.orderData.coupon_code} (折抵 $${result.orderData.discount})` : ''}
💰 商品總計: $${result.orderData.total_price} 元 (運費待報價)
`.trim();

    await sendLineMessage(lineMsg);
    return res.status(200).json({ success: true, message: '預購成功！', orderId: result.orderId });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

app.post('/payment/create', async (req, res) => {
  const validation = paymentCreateSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, error: validation.error.issues[0].message });
  }
  const { orderId, amount } = validation.data;

  try {
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) return res.status(404).json({ success: false, error: '找不到該訂單！' });
    const paymentUrl = `https://mock-payment-gateway.com/pay?orderId=${encodeURIComponent(orderId)}&amount=${Number(amount)}`;
    return res.status(200).json({ success: true, paymentUrl });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

app.post('/payment/callback', async (req, res) => {
  const { MerchantTradeNo, RtnCode, RtnMsg } = req.body;
  if (!MerchantTradeNo)
    return res.status(400).send('Invalid webhook signature or empty parameters');
  try {
    const orderId = MerchantTradeNo;
    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) return res.status(404).send('Order not found');
    if (String(RtnCode) === '1') {
      await orderRef.update({ status: 'paid', paid_at: admin.firestore.Timestamp.now() });
      logger.info(`[Webhook success] Order ${orderId} successfully marked as PAID!`);
      return res.status(200).send('1|OK');
    } else {
      logger.warn(`[Webhook warning] Payment failed for Order ${orderId}: ${RtnMsg}`);
      return res.status(200).send('0|Payment failed');
    }
  } catch (err) {
    logger.error({ err }, '[Webhook error] Failed to execute payment callback');
    return res.status(500).send('FAIL');
  }
});

export { app };
