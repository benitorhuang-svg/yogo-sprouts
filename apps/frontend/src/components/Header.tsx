import React, { FC, useState, useEffect } from 'react';
import MusicPlayer from '@/components/MusicPlayer';
import AuthModal from '@/components/AuthModal';
import { useAppContext } from '@/context/AppContext';

const Header: FC = () => {
  const { user } = useAppContext();
  const [authModalType, setAuthModalType] = useState<'login' | 'profile' | null>(null);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastClickTime > 2000) {
      setLogoClicks(1);
    } else {
      const newClicks = logoClicks + 1;
      if (newClicks >= 5) {
        const password = prompt('🔐 請輸入管理員密碼：');
        if (password === 'yogo2026') {
          alert('✅ 管理員登入成功！進入後台... (模擬中)');
          window.location.href = '/admin.html';
        }
        setLogoClicks(0);
      } else {
        setLogoClicks(newClicks);
      }
    }
    setLastClickTime(now);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <button
            id="theme-toggle-btn"
            className="theme-toggle-btn"
            aria-label="切換深淺模式"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <a className="logo" href="/" onClick={handleLogoClick}>
            <img src="img/brand/logo.png" alt="YoGo Logo" className="logo-img" />
            <span>YoGo 有夠菜-芽菜工坊</span>
          </a>
        </div>
        <MusicPlayer />
        <nav className="main-nav">
          <a href="/" className="active">
            商品選購
          </a>
          {user ? (
            <button
              className="auth-nav-btn user-logged-btn"
              onClick={() => setAuthModalType('profile')}
            >
              👤 {user.name}
            </button>
          ) : (
            <button className="auth-nav-btn login-btn" onClick={() => setAuthModalType('login')}>
              👤 會員登入
            </button>
          )}
        </nav>
      </div>
      <AuthModal type={authModalType} onClose={() => setAuthModalType(null)} />
    </header>
  );
};

export default Header;
