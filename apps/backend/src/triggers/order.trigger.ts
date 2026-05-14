import * as functions from 'firebase-functions';
import { sendLineNotify } from '../services/notification.service';
import { logger } from '../utils/logger';

export const onOrderStatusChange = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const orderId = context.params.orderId;

    if (!before || !after || before.status === after.status) return;

    logger.info(`[Order Change] ${orderId} transitioned from '${before.status}' to '${after.status}'`);

    let customerMsg = '';
    switch (after.status) {
      case 'confirmed':
        customerMsg = `
🔔 YoGo 顧客通知 — 訂單已接單！
━━━━━━━━━━━━━━━━━━
🆔 訂單編號: ${orderId}
👤 姓名: ${after.cust_name}
狀態: 【已確認接單】
說明: 專人已為您鎖定商品產能，正為您計算運費，隨後將為您提供最終報價。感謝您的耐心等候！
`;
        break;

      case 'quoted': {
        const fee = after.shipping_fee !== null ? `$${after.shipping_fee}` : '待估算';
        const finalAmount = after.total_price + (after.shipping_fee || 0);
        customerMsg = `
      🔔 YoGo 顧客通知 — 訂單已完成運費報價！
      ━━━━━━━━━━━━━━━━━━
      🆔 訂單編號: ${orderId}
      狀態: 【已報價運費】
      🚚 運費金額: ${fee} 元
      💰 應付總額: $${finalAmount} 元
      ━━━━━━━━━━━━━━━━━━
      🏦 匯款帳號資料:
      • 銀行: 822 中國信託
      • 帳號: 123-456789-012
      • 戶名: 有夠菜芽菜工坊
      說明: 匯款完成後，請主動透過 LINE 私訊告知您的「匯款帳號後五碼」，以便我們核實並立即安排出貨！
      `;
        break;
      }

      case 'paid':
        customerMsg = `
      🔔 YoGo 顧客通知 — 已確認收款，準備備貨！
      ━━━━━━━━━━━━━━━━━━
      🆔 訂單編號: ${orderId}
      狀態: 【收款確認，備貨中】
      說明: 我們已確認收到您的匯款！溫室人員正著手為您準備最新鮮的芽菜及相關商品，出貨時會再次通知您。
      `;
        await sendLineNotify(`📦 [備貨提醒] 訂單 ${orderId} 顧客已完成付款！請立即安排備貨。`);
        break;

      case 'shipped': {
        const tracking = after.tracking_number || '無 (自取/外送)';
        customerMsg = `
      🔔 YoGo 顧客通知 — 您的商品已出貨！
      ━━━━━━━━━━━━━━━━━━
      🆔 訂單編號: ${orderId}
      狀態: 【已出貨】
      📦 貨運追蹤碼: ${tracking}
      說明: 您的商品已交由物流配送！新鮮芽菜建議於收件後儘速冷藏保存，以維持最佳鮮度與營養。祝您種植與食用愉快！
      `;
        break;
      }

      case 'cancelled':
        customerMsg = `
❌ YoGo 顧客通知 — 預購訂單已取消
━━━━━━━━━━━━━━━━━━
🆔 訂單編號: ${orderId}
狀態: 【已取消】
說明: 您的預購訂單 ${orderId} 已經取消。如有任何疑問，請隨時聯繫 YoGo 客服，謝謝您！
`;
        await sendLineNotify(`❌ [訂單取消] 訂單 ${orderId} 狀態已變更為已取消。`);
        break;
    }

    if (customerMsg) {
      logger.info({ customerMsg }, `[Customer Notification Send Mock]`);
      await sendLineNotify(`📢 [狀態更新] 訂單 ${orderId} 狀態變更為【${after.status}】\n已對顧客發送通知訊息。`);
    }
    });
