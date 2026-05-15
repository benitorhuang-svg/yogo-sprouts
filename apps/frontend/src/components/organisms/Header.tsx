import { FC, useState, useEffect } from 'react';
import MusicPlayer from './MusicPlayer';
import AuthModal from './AuthModal';
import { useAppContext } from '@/context/AppContext';

// Atomic Components
import { LogoBrand } from '../molecules/LogoBrand';
import { UserAuthSection } from '../molecules/UserAuthSection';

/**
 * 🏛️ Header (Switcher / 總指揮)
 * 負責網站頂部導覽佈局、主題切換與 Auth Modal 的開啟
 */
const Header: FC = () => {
  const { user } = useAppContext();
  const [authModalType, setAuthModalType] = useState<'login' | 'profile' | null>(null);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  // 主題切換副作用
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <button
            className="theme-toggle-btn"
            aria-label="切換深淺模式"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <LogoBrand />
        </div>

        <MusicPlayer />

        <nav className="main-nav">
          <a href="/" className="active">
            商品選購
          </a>

          <UserAuthSection
            user={user}
            onOpenAuth={(type: 'login' | 'profile') => setAuthModalType(type)}
          />
        </nav>
      </div>

      <AuthModal type={authModalType} onClose={() => setAuthModalType(null)} />
    </header>
  );
};

export default Header;
