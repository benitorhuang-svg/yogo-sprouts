import React, { FC } from 'react';

interface CheckoutProgressBarProps {
  step: number;
}

/**
 * 🏁 CheckoutProgressBar Component
 * 顯示結帳進度條
 */
export const CheckoutProgressBar: FC<CheckoutProgressBarProps> = ({ step }) => {
  return (
    <div className="checkout-steps-bar">
      <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
        <div className="step-num">{step > 1 ? '✓' : '1'}</div>
        <div className="step-text">購物清單</div>
      </div>
      <div className={`step-line ${step > 1 ? 'completed' : ''}`}></div>
      <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
        <div className="step-num">{step > 2 ? '✓' : '2'}</div>
        <div className="step-text">配送資訊</div>
      </div>
      <div className={`step-line ${step > 2 ? 'completed' : ''}`}></div>
      <div className={`step-indicator ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
        <div className="step-num">{step > 3 ? '✓' : '3'}</div>
        <div className="step-text">最後確認</div>
      </div>
    </div>
  );
};
