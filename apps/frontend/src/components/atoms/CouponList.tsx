import React, { FC } from 'react';
import { User } from '../../hooks/useAuth';
import { INITIAL_COUPONS, Coupon } from '@yogo/shared';

interface CouponListProps {
  user: User;
  onBack: () => void;
}

/**
 * 🎫 CouponList Component
 * 顯示會員擁有的專屬優惠券清單與代碼
 */
export const CouponList: FC<CouponListProps> = ({ user, onBack }) => {
  const userCoupons = user.coupons || [];

  // 從 INITIAL_COUPONS 中過濾出用戶擁有的詳細資訊
  const couponDetails = INITIAL_COUPONS.filter((c) => userCoupons.includes(c.code));

  return (
    <div className="auth-modal-content">
      <div className="profile-header" style={{ marginBottom: 20 }}>
        <h2>🎫 我的專屬優惠券</h2>
        <p className="auth-subtitle">點擊代碼即可複製，結帳時可折抵金額</p>
      </div>

      <div
        className="coupon-scroll-list"
        style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}
      >
        {couponDetails.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
            <p style={{ fontSize: '2rem', marginBottom: '10px' }}>🌵</p>
            <p>目前沒有可用的優惠券</p>
          </div>
        ) : (
          couponDetails.map((coupon: Coupon) => (
            <div
              key={coupon.code}
              className="coupon-card-item"
              style={{
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span
                  style={{
                    background: '#2d6a4f',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {coupon.type === 'fixed' ? `$${coupon.value} 折抵` : `${coupon.value}% OFF`}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#999' }}>
                  至 {new Date(coupon.expiresAt).toLocaleDateString()}
                </span>
              </div>

              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>
                {coupon.code === 'FREESHIP' ? '🚚 免運優惠券' : '🌱 芽農專屬折扣'}
              </div>

              <div style={{ fontSize: '0.85rem', color: '#666' }}>
                滿 ${coupon.minOrderAmount} 即可使用
              </div>

              <div
                className="coupon-code-box"
                onClick={() => {
                  navigator.clipboard.writeText(coupon.code);
                  alert(`已複製代碼: ${coupon.code}`);
                }}
                style={{
                  background: '#f8f9fa',
                  border: '1px dashed #2d6a4f',
                  padding: '8px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginTop: '5px',
                  color: '#2d6a4f',
                  fontWeight: 'mono',
                  fontSize: '1rem',
                }}
              >
                代碼：{coupon.code} (點擊複製)
              </div>
            </div>
          ))
        )}
      </div>

      <button
        className="modal-add-to-cart-btn"
        onClick={onBack}
        style={{ marginTop: '20px', width: '100%' }}
      >
        返回會員中心
      </button>
    </div>
  );
};
