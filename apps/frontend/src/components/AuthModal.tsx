import { FC, useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

interface AuthModalProps {
  type: 'login' | 'profile' | null;
  onClose: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ type, onClose }) => {
  const { user, login, logout } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'menu' | 'settings' | 'tiers'>('menu');
  const [editName, setEditName] = useState('');
  const [phone, setPhone] = useState('0912-345-678');
  const [address, setAddress] = useState('台北市大安區和平東路二段106號');

  useEffect(() => {
    if (user) {
      setEditName(user.name);
    }
  }, [user]);

  if (!type) return null;

  if (type === 'login') {
    return (
      <div className="modal-wrapper active">
        <div className="modal-backdrop" onClick={onClose}></div>
        <div className="modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
          <div className="auth-modal-content">
            <h2>👤 YoGo 會員登入</h2>
            <p className="auth-subtitle">登入享有專屬芽農紅利與VIP折扣</p>
            <div className="auth-form">
              <div className="input-group">
                <label>電子郵件 / 會員帳號</label>
                <input
                  type="email"
                  placeholder="yogo@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>密碼</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className="modal-add-to-cart-btn auth-submit-btn"
                onClick={() => {
                  login(email || 'benito@yogo.tw', '', password);
                  onClose();
                }}
              >
                立即登入
              </button>
            </div>
            <div className="auth-divider">
              <span>或</span>
            </div>
            <div className="quick-login-options">
              <button
                className="quick-btn google-btn"
                onClick={() => {
                  login('google@yogo.tw', 'Google 綠手指會員', undefined, 'google');
                  onClose();
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google 快速登入</span>
              </button>
              <button
                className="quick-btn line-btn"
                onClick={() => {
                  login('line@yogo.tw', 'LINE 芽苗大使', undefined, 'line');
                  onClose();
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M24 10.29c0-4.38-5.37-7.96-12-7.96S0 5.91 0 10.29c0 3.93 4.26 7.25 10.2 7.84.42.09 1 .28 1.15.65.13.33.08.85.04 1.18l-.29 1.77c-.07.47-.36 1.83 1.6 1s3.52-2.08 6.45-4.34C22.25 15.63 24 13.12 24 10.29M8.33 12.83H5.77c-.31 0-.57-.25-.57-.57V7.81c0-.31.25-.57.57-.57s.57.25.57.57v3.87h2.01c.31 0 .57.25.57.57s-.26.58-.59.58m2.52-.57c0 .31-.25.57-.57.57s-.57-.25-.57-.57V7.81c0-.31.25-.57.57-.57s.57.25.57.57v4.45m5.01-4.45v4.45c0 .31-.25.57-.57.57s-.57-.25-.57-.57v-3.08l-2.07 2.97c-.08.11-.2.18-.34.18h-.05c-.27-.03-.48-.27-.48-.55V7.81c0-.31.25-.57.57-.57s.57.25.57.57v3.08l2.07-2.97c.08-.11.2-.18.34-.18h.05c.27.03.48.27.48.55m3.75 0v1.43h-1.57v.58h1.57c.31 0 .57.25.57.57s-.26.57-.57.57h-1.57v.73h1.57c.31 0 .57.25.57.57s-.26.58-.57.58H17.5c-.31 0-.57-.25-.57-.57V7.81c0-.31.25-.57.57-.57h2.12c.31 0 .57.25.57.57s-.25.57-.57.57"
                    fill="#06C755"
                  />
                </svg>
                <span>LINE 快速登入</span>
              </button>
              <button
                className="quick-btn guest-btn"
                onClick={() => {
                  login('guest@yogo.tw', '訪客體驗帳號');
                  onClose();
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>🌱</span>
                <span>訪客免帳號體驗</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-wrapper active">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div
        className="modal-card auth-modal-card profile-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <div className="auth-modal-content">
          {view === 'menu' && (
            <>
              <div className="profile-header">
                <div className="profile-avatar">🌱</div>
                <h2>{user?.name}</h2>
                <span
                  className="tier-badge"
                  onClick={() => setView('tiers')}
                  title="點擊查看等級說明"
                  style={{ cursor: 'pointer' }}
                >
                  {user?.tier} ℹ️
                </span>
              </div>
              <div className="profile-stats">
                <div className="stat-box">
                  <span className="stat-label">累積紅利</span>
                  <span className="stat-value">{user?.points} 點</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">專屬優惠券</span>
                  <span className="stat-value">3 張</span>
                </div>
              </div>
              <div className="profile-menu">
                <div className="menu-item" onClick={() => setView('tiers')}>
                  🏆 會員等級與晉升藍圖
                </div>
                <div
                  className="menu-item"
                  onClick={() => alert('📦 載入歷史訂單中... (目前尚無歷史訂單)')}
                >
                  📦 歷史訂單紀錄
                </div>
                <div
                  className="menu-item"
                  onClick={() => alert('💖 載入收藏清單中... (請先於頁面點擊愛心收藏)')}
                >
                  💖 我的收藏清單
                </div>
                <div className="menu-item" onClick={() => setView('settings')}>
                  ⚙️ 會員資料設定
                </div>
              </div>
              <button
                className="modal-add-to-cart-btn logout-btn"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                登出帳號
              </button>
            </>
          )}

          {view === 'settings' && (
            <>
              <div className="profile-header" style={{ marginBottom: 15 }}>
                <h2>⚙️ 會員資料設定</h2>
                <p className="auth-subtitle" style={{ marginBottom: 5 }}>
                  修改您的專屬芽農收件資訊
                </p>
              </div>
              <div className="auth-form">
                <div className="input-group">
                  <label>會員顯示名稱</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>聯絡電話</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>預設低溫配送地址</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <button
                  className="modal-add-to-cart-btn auth-submit-btn"
                  onClick={() => {
                    login(user?.email || 'yogo@example.com', editName);
                    setView('menu');
                  }}
                >
                  儲存設定
                </button>
                <button className="quick-btn" onClick={() => setView('menu')}>
                  返回上一頁
                </button>
              </div>
            </>
          )}

          {view === 'tiers' && (
            <>
              <div className="profile-header" style={{ marginBottom: 15 }}>
                <h2>🏆 YoGo 芽農晉升藍圖</h2>
                <p className="auth-subtitle" style={{ marginBottom: 5 }}>
                  累積紅利點數解鎖專屬 VIP 綠色禮遇
                </p>
              </div>
              <div className="tiers-container">
                <div className="tier-card">
                  <div className="tier-header">🌱 綠手指新手</div>
                  <ul className="tier-perks">
                    <li>• 永久免年費</li>
                    <li>• 消費每 $100 贈 1 點</li>
                  </ul>
                </div>
                <div className="tier-card">
                  <div className="tier-header">🌿 綠意大使</div>
                  <ul className="tier-perks">
                    <li>• 年度消費滿 $3,000</li>
                    <li>• 點數兩倍送 + 免運券</li>
                  </ul>
                </div>
                <div className="tier-card current">
                  <div className="tier-header vip">👑 VIP 芽苗大師</div>
                  <ul className="tier-perks">
                    <li>• 年度消費滿 $8,000</li>
                    <li>• 全館享 9 折 + 生日大禮包</li>
                  </ul>
                </div>
              </div>
              <button
                className="quick-btn"
                onClick={() => setView('menu')}
                style={{ marginTop: 20 }}
              >
                返回會員中心
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
