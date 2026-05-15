import { FC, useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { audioManager } from '@/audioManager';

// Atomic Components
import { CheckoutProgressBar } from '../molecules/CheckoutProgressBar';
import { CartStep } from '../molecules/CartStep';
import { DeliveryStep } from '../molecules/DeliveryStep';
import { ConfirmStep } from '../molecules/ConfirmStep';
import { SuccessStep } from '../molecules/SuccessStep';

/**
 * 🏛️ CheckoutModal (Switcher / 總指揮)
 * 負責管理結帳 4 階段的切換、表單狀態與 Modal 生命週期
 */
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
    user,
  } = useAppContext();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryDate: '',
  });

  useEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      document.body.classList.add('modal-open');

      // 🎁 自動填入會員資訊 (如果有的話)
      if (user) {
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          address: user.address || '',
          deliveryDate: '',
        });
      }
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isCheckoutOpen, user]);

  if (!isCheckoutOpen) return null;

  // 計算金額
  const subtotal = getTotal();
  const discount = getDiscount();
  const total = subtotal - discount;

  // 關閉邏輯
  const closeAll = () => {
    setIsCheckoutOpen(false);
    setAppliedCoupon('');
    setFormData({ name: '', phone: '', email: '', address: '', deliveryDate: '' });
  };

  const handleFinish = async () => {
    audioManager.playSuccess();
    await clearCart(formData);
    setStep(4);
  };

  return (
    <div className="modal-wrapper active" id="checkout-modal">
      <div className="modal-backdrop" onClick={step < 4 ? closeAll : undefined}></div>
      <div className="modal-card checkout-modal-card">
        {step < 4 && (
          <button className="modal-close-btn" onClick={closeAll}>
            ✕
          </button>
        )}

        {/* 1. 進度條 (僅前三步顯示) */}
        {step < 4 && <CheckoutProgressBar step={step} />}

        <div className="checkout-content-container">
          {/* Step 1: 購物清單 */}
          {step === 1 && (
            <CartStep
              cart={cart}
              products={products}
              subtotal={subtotal}
              discount={discount}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onApplyCoupon={setAppliedCoupon}
              onNext={() => setStep(2)}
            />
          )}

          {/* Step 2: 配送資訊 */}
          {step === 2 && (
            <DeliveryStep
              formData={formData}
              setFormData={setFormData}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {/* Step 3: 最後確認 */}
          {step === 3 && (
            <ConfirmStep
              formData={formData}
              total={total}
              onBack={() => setStep(2)}
              onFinish={handleFinish}
            />
          )}

          {/* Step 4: 成功通知 */}
          {step === 4 && <SuccessStep total={total} onClose={closeAll} />}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
