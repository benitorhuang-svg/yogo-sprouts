import React, { FC } from 'react';

interface DeliveryStepProps {
  formData: any;
  setFormData: (data: any) => void;
  onBack: () => void;
  onNext: () => void;
}

/**
 * 🚛 DeliveryStep Component
 * 填寫配送資訊與日期
 */
export const DeliveryStep: FC<DeliveryStepProps> = ({ formData, setFormData, onBack, onNext }) => {
  const isFormValid = formData.name && formData.phone && formData.email && formData.address;

  const minDate = new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

  return (
    <div className="step-content">
      <h3>🚛 填寫配送資訊</h3>
      <div className="auth-form" style={{ marginTop: 20 }}>
        <div className="input-group">
          <label>收件人姓名 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="請輸入收件人姓名"
          />
        </div>
        <div className="input-group">
          <label>聯絡電話 *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="請輸入聯絡電話"
          />
        </div>
        <div className="input-group">
          <label>LINE ID / Email (報價通知用) *</label>
          <input
            type="text"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="請輸入 LINE ID 或 Email"
          />
        </div>
        <div className="input-group">
          <label>配送地址 *</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="請輸入完整地址"
          />
        </div>
        <div className="input-group">
          <label>希望配送日期 (下單 2~14 天內)</label>
          <input
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
            min={minDate}
            max={maxDate}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
        <button className="qty-btn" style={{ flex: 1, width: 'auto' }} onClick={onBack}>
          回上一步
        </button>
        <button
          className="modal-add-to-cart-btn"
          style={{ flex: 2 }}
          onClick={onNext}
          disabled={!isFormValid}
        >
          最後一步：防呆確認
        </button>
      </div>
    </div>
  );
};
