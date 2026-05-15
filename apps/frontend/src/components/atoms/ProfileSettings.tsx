import React, { FC, useState } from 'react';
import { User } from '../../hooks/useAuth';

interface ProfileSettingsProps {
  user: User;
  onUpdate: (data: Partial<User>) => Promise<void>;
  onBack: () => void;
}

/**
 * ⚙️ ProfileSettings Component
 * 修改姓名、電話、地址
 */
export const ProfileSettings: FC<ProfileSettingsProps> = ({ user, onUpdate, onBack }) => {
  const [editName, setEditName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="auth-modal-content profile-settings-content">
      <div className="profile-header" style={{ marginBottom: 20 }}>
        <h2>⚙️ 會員資料設定</h2>
        <p className="auth-subtitle">管理您的帳號資訊與預設收件資料</p>
      </div>

      <form
        className="auth-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          try {
            await onUpdate({ name: editName, phone, address });
            onBack();
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <div className="input-group">
          <label>註冊信箱 (帳號識別)</label>
          <input type="email" value={user.email} disabled className="disabled-input" />
          <small style={{ color: '#666', fontSize: '0.75rem' }}>帳號信箱目前無法修改</small>
        </div>

        <div className="input-group">
          <label>會員顯示名稱</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="您的暱稱或收件人姓名"
            required
          />
        </div>

        <div className="input-group">
          <label>預設聯絡電話</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="例如：0912-345-678"
          />
        </div>

        <div className="input-group">
          <label>預設低溫配送地址</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="請輸入包含縣市的完整地址"
          />
        </div>

        <div className="settings-actions" style={{ marginTop: 10 }}>
          <button
            type="submit"
            className="modal-add-to-cart-btn auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? <span className="spinner" /> : '儲存更新'}
          </button>
          <button
            type="button"
            className="quick-btn"
            onClick={onBack}
            style={{ width: '100%', marginTop: 10 }}
          >
            返回會員中心
          </button>
        </div>
      </form>
    </div>
  );
};
