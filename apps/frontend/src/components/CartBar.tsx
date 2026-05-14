import { FC, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { audioManager } from '@/audioManager';

const CartBar: FC = () => {
  const { getTotal, clearCart } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const total = getTotal();

  if (total === 0 && !showModal) return null;

  const handleCheckout = () => {
    audioManager.playSuccess();
    setShowModal(true);
  };

  const handleFinish = () => {
    setShowModal(false);
    clearCart();
  };

  return (
    <>
      {total > 0 && (
        <div className="cart-bar">
          <span className="cart-subtotal">
            小計（運費另計）：<strong>${total.toLocaleString()}</strong>
          </span>
          <button 
            className="checkout-btn" 
            id="checkout-btn"
            onClick={handleCheckout}
          >
            確認結帳
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-wrapper active">
          <div className="modal-backdrop" onClick={handleFinish}></div>
          <div className="modal-card checkout-success-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleFinish}>✕</button>
            <div className="success-content">
              <h2>🎉 感謝您的購買！</h2>
              <p className="success-text">您的訂單已成功送出！</p>
              <div className="order-details">
                <p>📦 <strong>配送方式：</strong> 低溫冷藏保鮮配送</p>
                <p>💰 <strong>實付金額：</strong> ${total.toLocaleString()}</p>
                <p>🌱 <strong>出貨進度：</strong> 芽菜工坊現採包裝中</p>
              </div>
              <p className="thankyou-note">我們將盡速為您安排出貨，期待為您的餐桌增添新鮮與美味！</p>
              <button className="modal-add-to-cart-btn finish-btn" onClick={handleFinish}>
                返回繼續選購
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartBar;