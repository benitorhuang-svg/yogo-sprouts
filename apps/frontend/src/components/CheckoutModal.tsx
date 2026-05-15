import { FC, useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { audioManager } from '@/audioManager';
import { INITIAL_COUPONS } from '@yogo/shared';

const CheckoutModal: FC = () => {
  const {
    cart,
    products,
    getTotal,
    getDiscount,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setAppliedCoupon,
    addToCart,
    removeFromCart,
  } = useAppContext();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryDate: '',
  });
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const subtotal = getTotal();
  const discount = getDiscount();
  const total = subtotal - discount;

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleApplyCoupon = () => {
    const coupon = INITIAL_COUPONS.find((c) => c.code === couponInput);
    if (!coupon) {
      setCouponError('❌ 查無此優惠碼');
      return;
    }
    if (!coupon.active) {
      setCouponError('❌ 優惠碼已過期或停用');
      return;
    }
    if (subtotal < coupon.minOrderAmount) {
      setCouponError(`❌ 未達門檻 $${coupon.minOrderAmount}`);
      return;
    }
    setAppliedCoupon(couponInput);
    setCouponError('✅ 優惠碼套用成功！');
    audioManager.playSuccess();
  };

  const handleFinish = async () => {
    audioManager.playSuccess();
    await clearCart(formData);
    setStep(4);
  };

  const closeAll = () => {
    setIsCheckoutOpen(false);
    setAppliedCoupon('');
    setCouponInput('');
    setFormData({ name: '', phone: '', email: '', address: '', deliveryDate: '' });
  };

  // Helper to group items by cold/normal
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === Number(id));
      return { product, qty };
    })
    .filter((item) => item.product);

  const coldItems = cartItems.filter((item) => item.product?.cold);
  const normalItems = cartItems.filter((item) => !item.product?.cold);

  return (
    <div className="modal-wrapper active" id="checkout-modal">
      <div className="modal-backdrop" onClick={step < 4 ? closeAll : undefined}></div>
      <div className="modal-card checkout-modal-card">
        {step < 4 && (
          <button className="modal-close-btn" onClick={closeAll}>
            ✕
          </button>
        )}

        <div className="checkout-steps-bar">
          <div
            className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}
          >
            <div className="step-num">{step > 1 ? '✓' : '1'}</div>
            <div className="step-text">購物清單</div>
          </div>
          <div className={`step-line ${step > 1 ? 'completed' : ''}`}></div>
          <div
            className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}
          >
            <div className="step-num">{step > 2 ? '✓' : '2'}</div>
            <div className="step-text">配送資訊</div>
          </div>
          <div className={`step-line ${step > 2 ? 'completed' : ''}`}></div>
          <div
            className={`step-indicator ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}
          >
            <div className="step-num">{step > 3 ? '✓' : '3'}</div>
            <div className="step-text">最後確認</div>
          </div>
        </div>

        <div className="checkout-content-container">
          {step === 1 && (
            <div className="step-content">
              <h3>🛒 確認購買品項</h3>
              <p className="checkout-intro">請確認您的商品數量，運費將由專人依溫層另行報價。</p>

              <div className="checkout-groups-wrapper">
                {coldItems.length > 0 && (
                  <div className="checkout-subgroup">
                    <h4>❄️ 冷藏保鮮區</h4>
                    <div className="checkout-items-list">
                      {coldItems.map((item) => (
                        <div key={item.product!.id} className="checkout-item-row">
                          <div className="row-info">
                            <span className="row-emoji">{item.product!.emoji}</span>
                            <div className="row-desc">
                              <span className="row-name">{item.product!.name}</span>
                              <span className="row-spec">{item.product!.spec}</span>
                            </div>
                          </div>
                          <div className="row-pricing-control">
                            <span className="row-price">${item.product!.price}</span>
                            <div className="qty-control text-qty-control">
                              <button
                                className="qty-btn"
                                onClick={() => removeFromCart(item.product!.id)}
                              >
                                −
                              </button>
                              <span className="qty-display active">{item.qty}</span>
                              <button
                                className="qty-btn"
                                onClick={() => addToCart(item.product!.id)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {normalItems.length > 0 && (
                  <div className="checkout-subgroup">
                    <h4>📦 常溫配送區</h4>
                    <div className="checkout-items-list">
                      {normalItems.map((item) => (
                        <div key={item.product!.id} className="checkout-item-row">
                          <div className="row-info">
                            <span className="row-emoji">{item.product!.emoji}</span>
                            <div className="row-desc">
                              <span className="row-name">{item.product!.name}</span>
                              <span className="row-spec">{item.product!.spec}</span>
                            </div>
                          </div>
                          <div className="row-pricing-control">
                            <span className="row-price">${item.product!.price}</span>
                            <div className="qty-control text-qty-control">
                              <button
                                className="qty-btn"
                                onClick={() => removeFromCart(item.product!.id)}
                              >
                                −
                              </button>
                              <span className="qty-display active">{item.qty}</span>
                              <button
                                className="qty-btn"
                                onClick={() => addToCart(item.product!.id)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                className="coupon-section"
                style={{
                  marginTop: '20px',
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="輸入優惠碼 (如: YOGO2026)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  />
                  <button
                    className="qty-btn"
                    style={{ width: 'auto', padding: '0 15px' }}
                    onClick={handleApplyCoupon}
                  >
                    套用
                  </button>
                </div>
                {couponError && (
                  <p
                    style={{
                      fontSize: '0.8rem',
                      marginTop: '5px',
                      color: couponError.startsWith('✅') ? '#2d6a4f' : '#ef4444',
                    }}
                  >
                    {couponError}
                  </p>
                )}
              </div>

              <div
                className="total-summary"
                style={{
                  marginTop: '20px',
                  textAlign: 'right',
                  borderTop: '2px solid #eee',
                  paddingTop: '15px',
                }}
              >
                <p>商品小計: ${subtotal}</p>
                {discount > 0 && <p style={{ color: '#ef4444' }}>優惠折抵: -${discount}</p>}
                <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#2d6a4f' }}>
                  總計: ${total}
                </p>
              </div>

              <button
                className="modal-add-to-cart-btn"
                style={{ marginTop: '20px', width: '100%' }}
                onClick={handleNext}
              >
                下一步：填寫配送資訊
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h3>🚛 填寫配送資訊</h3>
              <div className="auth-form" style={{ marginTop: '20px' }}>
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
                  <label>希望配送日期 (下單 2 天後至 14 天內)</label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    min={new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]}
                    max={new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                <button className="qty-btn" style={{ flex: 1, width: 'auto' }} onClick={handleBack}>
                  回上一步
                </button>
                <button
                  className="modal-add-to-cart-btn"
                  style={{ flex: 2 }}
                  onClick={handleNext}
                  disabled={
                    !formData.name || !formData.phone || !formData.email || !formData.address
                  }
                >
                  最後一步：防呆確認
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h3>🔍 最後確認</h3>
              <p className="checkout-intro">
                請確認以上資訊無誤後送出。訂單成立後，我們將透過 LINE 或 Email 與您確認運費報價。
              </p>

              <div
                style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                }}
              >
                <p>
                  👤 <strong>收件人：</strong>
                  {formData.name}
                </p>
                <p>
                  📞 <strong>電話：</strong>
                  {formData.phone}
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

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="qty-btn" style={{ flex: 1, width: 'auto' }} onClick={handleBack}>
                  修改資料
                </button>
                <button
                  className="modal-add-to-cart-btn"
                  style={{ flex: 2 }}
                  onClick={handleFinish}
                >
                  確認下單並送出
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="success-content">
              <h2>🎉 感謝您的購買！</h2>
              <p className="success-text">您的訂單已成功送出！</p>
              <div className="order-details">
                <p>
                  📦 <strong>訂單編號：</strong> #ORD-
                  {new Date().toISOString().split('T')[0].replace(/-/g, '')}-
                  {Math.floor(Math.random() * 1000)}
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
              <p className="thankyou-note">
                我們將盡速為您安排出貨，期待為您的餐桌增添新鮮與美味！
              </p>
              <button className="modal-add-to-cart-btn finish-btn" onClick={closeAll}>
                完成並返回首頁
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
