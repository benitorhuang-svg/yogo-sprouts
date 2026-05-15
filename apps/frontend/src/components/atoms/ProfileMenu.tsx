import React, { FC } from 'react';
import { User } from '../../hooks/useAuth';

interface ProfileMenuProps {
  user: User;
  onLogout: () => void;
  onViewTiers: () => void;
  onViewSettings: () => void;
  onViewCoupons: () => void;
}

/**
 * 👤 ProfileMenu Component
 * 登入後的會員中心主選單
 */
export const ProfileMenu: FC<ProfileMenuProps> = ({
  user,
  onLogout,
  onViewTiers,
  onViewSettings,
  onViewCoupons,
}) => {
  return (
    <div className="auth-modal-content">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.photoURL ? <img src={user.photoURL} alt="Avatar" /> : '🌱'}
        </div>
        <h2>{user.name}</h2>
        <span className="tier-badge" onClick={onViewTiers} style={{ cursor: 'pointer' }}>
          {user.tier} ℹ️
        </span>
      </div>

      <div className="profile-stats">
        <div className="stat-box">
          <span className="stat-label">累積紅利</span>
          <span className="stat-value">{user.points} 點</span>
        </div>
        <div
          className="stat-box"
          onClick={onViewCoupons}
          style={{ cursor: 'pointer', border: '1px solid #2d6a4f22' }}
        >
          <span className="stat-label">專屬優惠券</span>
          <span className="stat-value">{user.coupons?.length || 0} 張</span>
          <small style={{ fontSize: '0.65rem', color: '#2d6a4f' }}>點擊查看代碼</small>
        </div>
      </div>

      <div className="profile-menu">
        <div className="menu-item" onClick={onViewTiers}>
          🏆 會員等級與晉升藍圖
        </div>
        <div className="menu-item" onClick={() => alert('📦 歷史訂單紀錄暫無')}>
          📦 歷史訂單紀錄
        </div>
        <div className="menu-item" onClick={() => alert('💖 收藏清單暫無')}>
          💖 我的收藏清單
        </div>
        <div className="menu-item" onClick={onViewSettings}>
          ⚙️ 會員資料設定
        </div>
      </div>

      <button className="modal-add-to-cart-btn logout-btn" onClick={onLogout}>
        登出帳號
      </button>
    </div>
  );
};
