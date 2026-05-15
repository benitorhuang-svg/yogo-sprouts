import React, { FC } from 'react';

interface SuccessStepProps {
  total: number;
  onClose: () => void;
}

/**
 * ✅ SuccessStep Component
 * 訂單成功通知
 */
export const SuccessStep: FC<SuccessStepProps> = ({ total, onClose }) => {
  const orderNumber = `#ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`;

  return (
    <div className="success-content">
      <h2>🎉 感謝您的購買！</h2>
      <p className="success-text">您的訂單已成功送出！</p>
      <div className="order-details">
        <p>
          📦 <strong>訂單編號：</strong> {orderNumber}
        </p>
        <p>
          💰 <strong>實付金額：</strong> ${total}
        </p>
        <p>
          🌱 <strong>出貨進度：</strong> 芽菜工坊現採包裝中
        </p>
        <p>
          📢 <strong>特別提示：</strong> 稍後專人將聯繫您確認運費並提供匯款資訊。
        </p>
      </div>
      <p className="thankyou-note">我們將盡速為您安排出貨，期待為您的餐桌增添新鮮與美味！</p>
      <button className="modal-add-to-cart-btn finish-btn" onClick={onClose}>
        完成並返回首頁
      </button>
    </div>
  );
};
