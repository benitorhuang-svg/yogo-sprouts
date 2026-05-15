import React, { FC } from 'react';

interface TabItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

/**
 * 🏷️ TabItem Component
 * 處理單個分類按鈕的顯示與選取狀態
 */
export const TabItem: FC<TabItemProps> = ({ id, label, isActive, onClick }) => {
  return (
    <button
      id={id === 'favorites' ? 'favorites-tab-btn' : undefined}
      className={`tab-btn ${isActive ? 'active' : ''}`}
      onClick={() => onClick(id)}
    >
      {label}
    </button>
  );
};
