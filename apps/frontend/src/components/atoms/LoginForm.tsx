import React, { FC, useState } from 'react';
import { useAppContext } from '../../context/AppContext';

interface LoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
}

/**
 * 🔒 LoginForm Component
 * 處理 Email/密碼登入、註冊與社群登入按鈕
 */
export const LoginForm: FC<LoginFormProps> = ({ onSuccess, onForgotPassword }) => {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = '請輸入電子郵件';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = '格式不正確';

    if (!password) newErrors.password = '請輸入密碼';
    else if (password.length < 6) newErrors.password = '密碼需至少 6 位數';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSocialLogin = async (provider: 'google' | 'line' | 'guest') => {
    setIsLoading(true);
    try {
      if (provider === 'guest') {
        await login('guest@yogo.tw', '訪客體驗帳號');
        onSuccess();
      } else {
        await login('', '', '', provider);
        if (provider !== 'line') onSuccess();
      }
    } catch {
      /* Handled in context */
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-modal-content">
      <h2>👤 YoGo {isLogin ? '會員登入' : '加入會員'}</h2>
      <p className="auth-subtitle">
        {isLogin ? '登入享有專屬芽農紅利與VIP折扣' : '立即註冊，開啟您的鮮耕生活'}
      </p>

      <form
        className="auth-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!validate()) return;
          setIsLoading(true);
          try {
            await login(email, '', password, undefined, !isLogin);
            onSuccess();
          } catch (err: any) {
            if (err.code === 'auth/wrong-password') setErrors({ password: '密碼錯誤' });
            else if (err.code === 'auth/user-not-found') setErrors({ email: '帳號不存在' });
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
          <label>電子郵件 / 會員帳號</label>
          <input
            type="email"
            placeholder="yogo@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors(({ email: _, ...rest }) => rest);
            }}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
          <label>密碼</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(({ password: _, ...rest }) => rest);
              }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && <span className="error-msg">{errors.password}</span>}
          {isLogin && (
            <p
              className="forgot-link"
              style={{
                fontSize: '0.8rem',
                color: '#2d6a4f',
                textAlign: 'right',
                marginTop: '5px',
                cursor: 'pointer',
              }}
              onClick={onForgotPassword}
            >
              忘記密碼？
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`modal-add-to-cart-btn auth-submit-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? <span className="spinner" /> : isLogin ? '立即登入' : '確認註冊'}
        </button>

        <p
          className="auth-toggle-text"
          style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}
        >
          {isLogin ? '還不是會員？' : '已經有帳號？'}
          <span
            style={{ color: '#2d6a4f', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? '點此註冊' : '點此登入'}
          </span>
        </p>
      </form>

      <div className="auth-divider">
        <span>或</span>
      </div>

      <div className="quick-login-options">
        <button
          type="button"
          className="quick-btn google-btn"
          disabled={isLoading}
          onClick={() => handleSocialLogin('google')}
        >
          <GoogleIcon />
          <span>Google 快速登入</span>
        </button>
        <button
          type="button"
          className="quick-btn line-btn"
          disabled={isLoading}
          onClick={() => handleSocialLogin('line')}
        >
          <LineIcon />
          <span>LINE 快速登入</span>
        </button>
        <button
          type="button"
          className="quick-btn guest-btn"
          disabled={isLoading}
          onClick={() => handleSocialLogin('guest')}
        >
          <span className="btn-icon" style={{ fontSize: '1.2rem' }}>
            🌱
          </span>
          <span>訪客免帳號體驗</span>
        </button>
      </div>
    </div>
  );
};

// SVG Icons (Atomic helper internal components)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
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
);

const LineIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 10.29c0-4.38-5.37-7.96-12-7.96S0 5.91 0 10.29c0 3.93 4.26 7.25 10.2 7.84.42.09 1 .28 1.15.65.13.33.08.85.04 1.18l-.29 1.77c-.07.47-.36 1.83 1.6 1s3.52-2.08 6.45-4.34C22.25 15.63 24 13.12 24 10.29M8.33 12.83H5.77c-.31 0-.57-.25-.57-.57V7.81c0-.31.25-.57.57-.57s.57.25.57.57v3.87h2.01c.31 0 .57.25.57.57s-.26.58-.59.58m2.52-.57c0 .31-.25.57-.57.57s-.57-.25-.57-.57V7.81c0-.31.25-.57.57-.57s.57.25.57.57v4.45m5.01-4.45v4.45c0 .31-.25.57-.57.57s-.57-.25-.57-.57v-3.08l-2.07 2.97c-.08.11-.2.18-.34.18h-.05c-.27-.03-.48-.27-.48-.55V7.81c0-.31.25-.57.57-.57s.57.25.57.57v3.08l2.07-2.97c.08-.11.2-.18.34-.18h.05c.27.03.48.27.48.55m3.75 0v1.43h-1.57v.58h1.57c.31 0 .57.25.57.57s-.26.57-.57.57h-1.57v.73h1.57c.31 0 .57.25.57.57s-.26.58-.57.58H17.5c-.31 0-.57-.25-.57-.57V7.81c0-.31.25-.57.57-.57h2.12c.31 0 .57.25.57.57s-.25.57-.57.57"
      fill="#06C755"
    />
  </svg>
);
