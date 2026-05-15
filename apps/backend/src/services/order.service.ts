import * as admin from 'firebase-admin';
import { Product, Coupon } from '../shared';
import { sendLineMessage } from './notification.service';

/**
 * 📦 OrderService (勞動者)
 * 負責複雜的結帳交易與金額計算
 */
export class OrderService {
  private static db = admin.firestore();

  static async processCheckout(payload: any, verifiedUid: string | null) {
    const { customer, cart, couponCode, preferred_delivery_date } = payload;
    const now = new Date();

    // 1. 計算日期與 ID
    const taipeiDate = new Intl.DateTimeFormat('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
    const todayStr = taipeiDate.replace(/\//g, '');

    // 2. 處理優惠券
    let appliedCoupon: Coupon | null = null;
    if (couponCode) {
      const couponDoc = await this.db.collection('coupons').doc(couponCode.toUpperCase()).get();
      if (couponDoc.exists) {
        const cData = couponDoc.data() as Coupon;
        if (cData && cData.active && new Date(cData.expiresAt).getTime() > Date.now()) {
          appliedCoupon = cData;
        }
      }
    }

    // 3. 資料庫交易
    return await this.db.runTransaction(async (transaction) => {
      const productDocs: { [id: number]: admin.firestore.DocumentSnapshot } = {};
      const itemDetails: any[] = [];
      let calculatedTotal = 0;

      for (const pidStr of Object.keys(cart)) {
        const pid = Number(pidStr);
        const qty = Number(cart[pidStr]);
        const docRef = this.db.collection('products').doc(String(pid));
        const docSnap = await transaction.get(docRef);

        if (!docSnap.exists) throw new Error(`商品 ID ${pid} 不存在！`);
        const pData = docSnap.data() as Product;
        if (pData.stock < qty) throw new Error(`[${pData.name}] 庫存不足。`);

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

      let discountAmount = 0;
      if (appliedCoupon && calculatedTotal >= appliedCoupon.minOrderAmount) {
        discountAmount =
          appliedCoupon.type === 'fixed'
            ? appliedCoupon.value
            : Math.round(calculatedTotal * (appliedCoupon.value / 100));
      }

      // 更新庫存
      for (const pidStr of Object.keys(cart)) {
        const pid = Number(pidStr);
        const qty = Number(cart[pidStr]);
        const pData = productDocs[pid].data() as Product;
        transaction.update(productDocs[pid].ref, { stock: pData.stock - qty });
      }

      // 產生訂單 ID (流水號)
      const startId = `#ORD-${todayStr}-000`;
      const endId = `#ORD-${todayStr}-999`;
      const ordersSnapshot = await transaction.get(
        this.db
          .collection('orders')
          .orderBy(admin.firestore.FieldPath.documentId())
          .startAt(startId)
          .endAt(endId)
      );
      const orderId = `#ORD-${todayStr}-${String(ordersSnapshot.size + 1).padStart(3, '0')}`;

      const orderData = {
        user_uid: verifiedUid,
        cust_name: customer.name,
        cust_phone: customer.phone,
        cust_contact: customer.contact,
        cust_address: customer.address,
        total_price: Math.max(0, calculatedTotal - discountAmount),
        original_price: calculatedTotal,
        discount: discountAmount,
        coupon_code: appliedCoupon ? appliedCoupon.code : null,
        status: 'pending',
        created_at: admin.firestore.Timestamp.fromDate(now),
        preferred_delivery_date: preferred_delivery_date || null,
        items: itemDetails,
      };

      transaction.set(this.db.collection('orders').doc(orderId), orderData);

      // 非同步發送 LINE 通知
      this.sendNotification(orderId, orderData);

      return { orderId, success: true };
    });
  }

  private static async sendNotification(orderId: string, data: any) {
    const itemsMsg = data.items.map((i: any) => `• ${i.emoji} ${i.name} (${i.qty}件)`).join('\n');
    const msg = `
🌱 YoGo 新訂單通知！
━━━━━━━━━━━━━━━━━━
🆔 編號: ${orderId}
👤 顧客: ${data.cust_name}
💰 總計: $${data.total_price}
🛒 明細:
${itemsMsg}
`.trim();
    await sendLineMessage(msg);
  }
}
