import React, { FC, useState } from 'react';

interface ForgotPasswordFormProps {
  onReset: (email: string) => Promise<void>;
  onBack: () => void;
}

/**
 * 📧 ForgotPasswordForm Component
 * 處理密碼重設郵件發送
 */
export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({ onReset, onBack }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="auth-modal-content">
      <div className="profile-header" style={{ marginBottom: 15 }}>
        <h2>📧 重設密碼</h2>
        <p className="auth-subtitle">請輸入您的註冊 Email，我們將寄送重設信件</p>
      </div>

      <form
        className="auth-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!email) return setError('請輸入 Email');
          setIsLoading(true);
          try {
            await onReset(email);
            onBack();
          } catch {
            /* Handled by context */
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <div className={`input-group ${error ? 'has-error' : ''}`}>
          <label>電子郵件</label>
          <input
            type="email"
            placeholder="yogo@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            required
          />
          {error && <span className="error-msg">{error}</span>}
        </div>

        <button
          type="submit"
          className={`modal-add-to-cart-btn auth-submit-btn ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? <span className="spinner" /> : '發送重設信件'}
        </button>
        <button type="button" className="quick-btn" onClick={onBack} style={{ marginTop: 10 }}>
          返回登入
        </button>
      </form>
    </div>
  );
};
