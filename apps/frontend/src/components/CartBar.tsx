import { FC } from 'react';
import { useAppContext } from '../context/AppContext';

const CartBar: FC = () => {
  const { getTotal } = useAppContext();
  const total = getTotal();

  if (total === 0) return null;

  return (
    <div className="cart-bar">
      <span className="cart-subtotal">
        小計（運費另計）：<strong>${total.toLocaleString()}</strong>
      </span>
      <button className="checkout-btn" id="checkout-btn">確認結帳</button>
    </div>
  );
};

export default CartBar;