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
  const [view, setView] = useState<'menu' | 'settings'>('menu');
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
          <button className="modal-close-btn" onClick={onClose}>✕</button>
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
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>密碼</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
              <button 
                className="modal-add-to-cart-btn auth-submit-btn" 
                onClick={() => { login(email || 'benito@yogo.tw'); onClose(); }}
              >
                立即登入
              </button>
            </div>
            <div className="auth-divider"><span>或</span></div>
            <div className="quick-login-options">
              <button className="quick-btn google-btn" onClick={() => { login('google@yogo.tw', 'Google 綠手指會員'); onClose(); }}>
                🌐 Google 快速登入
              </button>
              <button className="quick-btn line-btn" onClick={() => { login('line@yogo.tw', 'LINE 芽苗大使'); onClose(); }}>
                💬 LINE 快速登入
              </button>
              <button className="quick-btn guest-btn" onClick={() => { login('guest@yogo.tw', '訪客體驗帳號'); onClose(); }}>
                🌱 訪客免帳號體驗
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
      <div className="modal-card auth-modal-card profile-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>✕</button>
        <div className="auth-modal-content">
          {view === 'menu' ? (
            <>
              <div className="profile-header">
                <div className="profile-avatar">🌱</div>
                <h2>{user?.name}</h2>
                <span className="tier-badge">{user?.tier}</span>
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
                <div className="menu-item" onClick={() => alert('📦 載入歷史訂單中... (目前尚無歷史訂單)')}>📦 歷史訂單紀錄</div>
                <div className="menu-item" onClick={() => alert('💖 載入收藏清單中... (請先於頁面點擊愛心收藏)')}>💖 我的收藏清單</div>
                <div className="menu-item" onClick={() => setView('settings')}>⚙️ 會員資料設定</div>
              </div>
              <button className="modal-add-to-cart-btn logout-btn" onClick={() => { logout(); onClose(); }}>
                登出帳號
              </button>
            </>
          ) : (
            <>
              <div className="profile-header" style={{ marginBottom: 15 }}>
                <h2>⚙️ 會員資料設定</h2>
                <p className="auth-subtitle" style={{ marginBottom: 5 }}>修改您的專屬芽農收件資訊</p>
              </div>
              <div className="auth-form">
                <div className="input-group">
                  <label>會員顯示名稱</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>聯絡電話</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>預設低溫配送地址</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
                <button 
                  className="modal-add-to-cart-btn auth-submit-btn" 
                  onClick={() => { login(user?.email || 'yogo@example.com', editName); setView('menu'); }}
                >
                  儲存設定
                </button>
                <button className="quick-btn" onClick={() => setView('menu')}>
                  返回上一頁
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
