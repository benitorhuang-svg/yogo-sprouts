import React, { FC, useState } from 'react';
import { Product, INITIAL_COUPONS } from '@yogo/shared';
import { audioManager } from '@/audioManager';

interface CartStepProps {
  cart: Record<number, number>;
  products: Product[];
  subtotal: number;
  discount: number;
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

  const handleCoupon = () => {
    const coupon = INITIAL_COUPONS.find((c) => c.code === couponInput);
    if (!coupon) return setCouponError('❌ 查無此優惠碼');
    if (!coupon.active) return setCouponError('❌ 優惠碼已過期');
    if (subtotal < coupon.minOrderAmount)
      return setCouponError(`❌ 未達門檻 $${coupon.minOrderAmount}`);

    onApplyCoupon(couponInput);
    setCouponError('✅ 套用成功！');
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
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="text"
            placeholder="輸入優惠碼"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          <button
            className="qty-btn"
            style={{ width: 'auto', padding: '0 15px' }}
            onClick={handleCoupon}
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
