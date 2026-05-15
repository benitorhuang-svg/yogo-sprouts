import React, { FC, useState } from 'react';

/**
 * 🎨 LogoBrand Component
 * 處理 Logo 顯示與「連點 5 次進入管理後台」的隱藏邏輯
 */
export const LogoBrand: FC = () => {
  const [clicks, setClicks] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();

    // 如果距離上次點擊超過 2 秒，重置計數
    if (now - lastTime > 2000) {
      setClicks(1);
    } else {
      const newCount = clicks + 1;
      if (newCount >= 5) {
        const password = prompt('🔐 請輸入管理員密碼：');
        if (password === 'yogo2026') {
          alert('✅ 管理員登入成功！進入後台... (模擬中)');
          window.location.href = '/admin.html';
        }
        setClicks(0);
      } else {
        setClicks(newCount);
      }
    }
    setLastTime(now);
  };

  return (
    <a className="logo" href="/" onClick={handleClick}>
      <img src="img/brand/logo.png" alt="YoGo Logo" className="logo-img" />
      <span>YoGo 有夠菜-芽菜工坊</span>
    </a>
  );
};
