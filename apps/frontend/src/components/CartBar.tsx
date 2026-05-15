import React, { FC } from 'react';
import { useAppContext } from '@/context/AppContext';
import { audioManager } from '@/audioManager';

const CartBar: FC = () => {
  const { getTotal, setIsCheckoutOpen } = useAppContext();
  const total = getTotal();

  if (total === 0) return null;

  const handleCheckout = () => {
    audioManager.playSuccess();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="cart-bar">
      <span className="cart-subtotal">
        小計（運費另計）：<strong>${total.toLocaleString()}</strong>
      </span>
      <button className="checkout-btn" id="checkout-btn" onClick={handleCheckout}>
        確認結帳
      </button>
    </div>
  );
};

export default CartBar;
