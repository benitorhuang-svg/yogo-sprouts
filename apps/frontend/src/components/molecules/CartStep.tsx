import React, { FC, useState } from 'react';
import { Product, INITIAL_COUPONS } from '@yogo/shared';
import { audioManager } from '@/audioManager';

import { User } from '../../hooks/useAuth';

interface CartStepProps {
  cart: Record<number, number>;
  products: Product[];
  subtotal: number;
  discount: number;
  user: User | null;
  onAddToCart: (id: number) => void;
  onRemoveFromCart: (id: number) => void;
  onApplyCoupon: (code: string) => void;
  onNext: () => void;
}

/**
 * 🛒 CartStep Component
 * 處理清單分組、數量調整與優惠碼套用
 */
export const CartStep: FC<CartStepProps> = ({
  cart,
  products,
  subtotal,
  discount,
  user,
  onAddToCart,
  onRemoveFromCart,
  onApplyCoupon,
  onNext,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => ({ product: products.find((p) => p.id === Number(id)), qty }))
    .filter((item) => item.product);

  const coldItems = cartItems.filter((item) => item.product?.cold);
  const normalItems = cartItems.filter((item) => !item.product?.cold);

  const userCoupons = user?.coupons || [];
  const couponOptions = INITIAL_COUPONS.filter((c) => userCoupons.includes(c.code));

  const handleCoupon = (code?: string) => {
    const targetCode = code || couponInput;
    const coupon = INITIAL_COUPONS.find((c) => c.code === targetCode);

    if (!coupon) {
      setCouponError('❌ 查無此優惠碼');
      return;
    }
    if (!coupon.active) {
      setCouponError('❌ 優惠碼已過期');
      return;
    }
    if (subtotal < coupon.minOrderAmount) {
      setCouponError(`❌ 未達門檻 $${coupon.minOrderAmount}`);
      return;
    }

    onApplyCoupon(targetCode);
    setCouponError(`✅ 套用成功：${targetCode}`);
    setCouponInput('');
    audioManager.playSuccess();
  };

  return (
    <div className="step-content">
      <h3>🛒 確認購買品項</h3>
      <p className="checkout-intro">請確認您的商品數量，運費將由專人另行報價。</p>

      <div className="checkout-groups-wrapper">
        <ProductGroup
          title="❄️ 冷藏保鮮區"
          items={coldItems}
          onAdd={onAddToCart}
          onRemove={onRemoveFromCart}
        />
        <ProductGroup
          title="📦 常溫配送區"
          items={normalItems}
          onAdd={onAddToCart}
          onRemove={onRemoveFromCart}
        />
      </div>

      <div
        className="coupon-section"
        style={{ marginTop: 20, padding: 15, background: '#f8f9fa', borderRadius: 8 }}
      >
        <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: 8, display: 'block' }}>
          🎟️ 使用優惠券
        </label>

        {couponOptions.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <select
              onChange={(e) => {
                if (e.target.value) handleCoupon(e.target.value);
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #2d6a4f44',
                background: '#fff',
              }}
            >
              <option value="">快速選擇您的優惠券...</option>
              {couponOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code === 'FREESHIP'
                    ? '🚚 免運券'
                    : `$${c.value} 折抵 (滿$${c.minOrderAmount})`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            placeholder="或手動輸入代碼"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <button
            className="qty-btn"
            style={{ width: 'auto', padding: '0 15px' }}
            onClick={() => handleCoupon()}
          >
            套用
          </button>
        </div>
        {couponError && (
          <p
            style={{
              fontSize: '0.8rem',
              marginTop: 5,
              color: couponError.startsWith('✅') ? '#2d6a4f' : '#ef4444',
            }}
          >
            {couponError}
          </p>
        )}
      </div>

      <div
        className="total-summary"
        style={{ marginTop: 20, textAlign: 'right', borderTop: '2px solid #eee', paddingTop: 15 }}
      >
        <p>商品小計: ${subtotal}</p>
        {discount > 0 && <p style={{ color: '#ef4444' }}>優惠折抵: -${discount}</p>}
        <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#2d6a4f' }}>
          總計: ${subtotal - discount}
        </p>
      </div>

      <button
        className="modal-add-to-cart-btn"
        style={{ marginTop: 20, width: '100%' }}
        onClick={onNext}
      >
        下一步：填寫配送資訊
      </button>
    </div>
  );
};

const ProductGroup = ({ title, items, onAdd, onRemove }: any) => {
  if (items.length === 0) return null;
  return (
    <div className="checkout-subgroup">
      <h4>{title}</h4>
      <div className="checkout-items-list">
        {items.map((item: any) => (
          <div key={item.product.id} className="checkout-item-row">
            <div className="row-info">
              <span className="row-emoji">{item.product.emoji}</span>
              <div className="row-desc">
                <span className="row-name">{item.product.name}</span>
                <span className="row-spec">{item.product.spec}</span>
              </div>
            </div>
            <div className="row-pricing-control">
              <span className="row-price">${item.product.price}</span>
              <div className="qty-control text-qty-control">
                <button className="qty-btn" onClick={() => onRemove(item.product.id)}>
                  −
                </button>
                <span className="qty-display active">{item.qty}</span>
                <button className="qty-btn" onClick={() => onAdd(item.product.id)}>
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
