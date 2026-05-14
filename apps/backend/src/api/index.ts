import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import * as admin from 'firebase-admin';
import { Product, Coupon } from '@yogo/shared';
import { seedDatabaseIfEmpty, forceSeed } from '../data/seeder';
import { sendLineNotify } from '../services/notification.service';
import { logger } from '../utils/logger';
import { checkoutSchema, couponQuerySchema, paymentCreateSchema } from './schemas';

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

const checkoutLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, error: '點擊過於頻繁！請 10 分鐘後再試。' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/seed', async (req, res) => {
  try {
    await forceSeed(db);
    res.status(200).json({ success: true, message: 'Database successfully seeded!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

app.get('/products', async (req, res) => {
  try {
    await seedDatabaseIfEmpty(db);
    const snapshot = await db.collection('products').orderBy('id', 'asc').get();
    const products: Product[] = [];
    snapshot.forEach(doc => products.push(doc.data() as Product));
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
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
    if (!coupon || !coupon.active) return res.status(400).json({ success: false, error: '此優惠碼已停用' });

    const expiresAt = new Date(coupon.expiresAt);
    if (expiresAt.getTime() < Date.now()) return res.status(400).json({ success: false, error: '此優惠碼已過期！' });

    return res.status(200).json({ success: true, coupon });
  } catch (err) {
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

app.post('/checkout', checkoutLimiter, async (req, res) => {
  const validation = checkoutSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, error: '資料驗證失敗', details: validation.error.format() });
  }

  const { customer, cart, couponCode, preferred_delivery_date } = validation.data;

  if (Object.keys(cart).length === 0) {
    return res.status(400).json({ success: false, error: '購物車為空，無法結帳！' });
  }

  try {
    const now = new Date();
    const taipeiDate = new Intl.DateTimeFormat('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
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
        if (pData.stock < qty) throw new Error(`[${pData.name}] 庫存不足，剩餘 ${pData.stock} 件。`);

        productDocs[pid] = docSnap;
        calculatedTotal += pData.price * qty;
        itemDetails.push({ product_id: pid, name: pData.name, qty, price: pData.price, cold: pData.cold, emoji: pData.emoji, spec: pData.spec });
      }

      if (itemDetails.length === 0) throw new Error('購物車無有效商品！');

      let discountAmount = 0;
      if (appliedCoupon && calculatedTotal >= appliedCoupon.minOrderAmount) {
        discountAmount = appliedCoupon.type === 'fixed' ? appliedCoupon.value : Math.round(calculatedTotal * (appliedCoupon.value / 100));
      }

      for (const pidStr of Object.keys(cart)) {
        const pid = Number(pidStr);
        const qty = Number(cart[pidStr]);
        if (qty <= 0) continue;
        const docSnap = productDocs[pid];
        const pData = docSnap.data() as Product;
        transaction.update(docSnap.ref, { stock: pData.stock - qty });
      }

      const ordersSnapshot = await transaction.get(db.collection('orders').orderBy(admin.firestore.FieldPath.documentId()).startAt(startId).endAt(endId));
      const orderId = `#ORD-${todayStr}-${String(ordersSnapshot.size + 1).padStart(3, '0')}`;
      const finalPrice = Math.max(0, calculatedTotal - discountAmount);
      const orderData = {
        cust_name: customer.name, cust_phone: customer.phone, cust_contact: customer.contact, cust_address: customer.address,
        total_price: finalPrice, original_price: calculatedTotal, discount: discountAmount, coupon_code: appliedCoupon ? appliedCoupon.code : null,
        shipping_fee: null, status: 'pending', tracking_number: null, created_at: admin.firestore.Timestamp.fromDate(now),
        confirmed_at: null, shipped_at: null, preferred_delivery_date: preferred_delivery_date || null, items: itemDetails
      };
      transaction.set(db.collection('orders').doc(orderId), orderData);
      return { orderId, orderData };
    });

    const itemsMessage = result.orderData.items.map((item: OrderItem) => `• ${item.emoji} ${item.name} (${item.qty}件)`).join('\n');
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

    await sendLineNotify(lineMsg);
    return res.status(200).json({ success: true, message: '預購成功！', orderId: result.orderId });
  } catch (err) {
    return res.status(400).json({ success: false, error: err instanceof Error ? err.message : String(err) });
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
    return res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
  }
});

app.post('/payment/callback', async (req, res) => {
  const { MerchantTradeNo, RtnCode, RtnMsg } = req.body;
  if (!MerchantTradeNo) return res.status(400).send('Invalid webhook signature or empty parameters');
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
