import React, { FC } from 'react';
import { User } from '../../hooks/useAuth';

interface UserAuthSectionProps {
  user: User | null;
  onOpenAuth: (type: 'login' | 'profile') => void;
}

/**
 * 👤 UserAuthSection Component
 * 處理 Header 中的登入按鈕與會員頭貼展示
 */
export const UserAuthSection: FC<UserAuthSectionProps> = ({ user, onOpenAuth }) => {
  if (user) {
    return (
      <button
        className="auth-nav-btn user-logged-btn"
        onClick={() => onOpenAuth('profile')}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '6px 14px',
          gap: '10px',
        }}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="Avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(255,255,255,0.8)',
            }}
          />
        ) : (
          <span style={{ fontSize: '1.2rem' }}>👤</span>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            lineHeight: '1.2',
          }}
        >
          <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user.name}</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>{user.tier}</span>
        </div>
      </button>
    );
  }

  return (
    <button className="auth-nav-btn login-btn" onClick={() => onOpenAuth('login')}>
      👤 會員登入
    </button>
  );
};
