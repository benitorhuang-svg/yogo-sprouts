import { FC, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { LoginForm } from '../atoms/LoginForm';
import { ProfileMenu } from '../atoms/ProfileMenu';
import { ProfileSettings } from '../atoms/ProfileSettings';
import { MembershipTiers } from '../atoms/MembershipTiers';
import { ForgotPasswordForm } from '../atoms/ForgotPasswordForm';

interface AuthModalProps {
  type: 'login' | 'profile' | null;
  onClose: () => void;
}

/**
 * 🏛️ AuthModal (Switcher / 總指揮)
 * 負責根據 type 與 view 狀態切換子組件，維持 Modal 的開啟生命週期
 */
const AuthModal: FC<AuthModalProps> = ({ type, onClose }) => {
  const { user, logout, updateUserData, resetPassword } = useAppContext();
  const [view, setView] = useState<'menu' | 'settings' | 'tiers' | 'forgot'>('menu');

  if (!type) return null;

  return (
    <div className="modal-wrapper active">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div
        className={`modal-card auth-modal-card ${user ? 'profile-modal-card' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* 1. 訪客/未登入視圖 */}
        {!user && view !== 'forgot' && (
          <LoginForm onSuccess={onClose} onForgotPassword={() => setView('forgot')} />
        )}

        {/* 2. 登入後視圖 */}
        {user && (
          <>
            {view === 'menu' && (
              <ProfileMenu
                user={user}
                onLogout={() => {
                  logout();
                  onClose();
                }}
                onViewTiers={() => setView('tiers')}
                onViewSettings={() => setView('settings')}
              />
            )}

            {view === 'settings' && (
              <ProfileSettings
                user={user}
                onUpdate={updateUserData}
                onBack={() => setView('menu')}
              />
            )}

            {view === 'tiers' && <MembershipTiers onBack={() => setView('menu')} />}
          </>
        )}

        {/* 3. 忘記密碼 (獨立視圖) */}
        {view === 'forgot' && (
          <ForgotPasswordForm onReset={resetPassword} onBack={() => setView('menu')} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
