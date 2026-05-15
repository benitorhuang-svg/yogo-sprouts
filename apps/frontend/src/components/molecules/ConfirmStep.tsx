import React, { FC, useState } from 'react';

interface ConfirmStepProps {
  formData: any;
  total: number;
  onBack: () => void;
  onFinish: () => Promise<void>;
}

/**
 * 🔍 ConfirmStep Component
 * 最終資料總覽與送出訂單
 */
export const ConfirmStep: FC<ConfirmStepProps> = ({ formData, total, onBack, onFinish }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onFinish();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="step-content">
      <h3>🔍 最後確認</h3>
      <p className="checkout-intro">
        請確認資訊無誤。訂單成立後，我們將透過 LINE 或 Email 與您確認運費報價。
      </p>

      <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 20 }}>
        <p>
          👤 <strong>收件人：</strong>
          {formData.name}
        </p>
        <p>
          📞 <strong>電話：</strong>
          {formData.phone}
        </p>
        <p>
          📧 <strong>聯絡資訊：</strong>
          {formData.email}
        </p>
        <p>
          📍 <strong>地址：</strong>
          {formData.address}
        </p>
        {formData.deliveryDate && (
          <p>
            📅 <strong>希望日期：</strong>
            {formData.deliveryDate}
          </p>
        )}
        <p>
          💰 <strong>訂單總計：</strong>${total}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="qty-btn"
          style={{ flex: 1, width: 'auto' }}
          onClick={onBack}
          disabled={isSubmitting}
        >
          修改資料
        </button>
        <button
          className="modal-add-to-cart-btn"
          style={{ flex: 2 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <span className="spinner" /> : '確認下單並送出'}
        </button>
      </div>
    </div>
  );
};
