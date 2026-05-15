import React, { FC } from 'react';

interface ProductBadgeProps {
  cold: boolean;
  stock: number;
}

/**
 * 🏷️ ProductBadge Component
 * 處理溫層 (冷藏/常溫) 與 庫存狀態 (售完/低庫存) 的標籤顯示
 */
export const ProductBadge: FC<ProductBadgeProps> = ({ cold, stock }) => {
  const tempClass = cold ? 'badge-cold' : 'badge-normal';
  const tempText = cold ? '❄️ 冷藏' : '📦 常溫';

  return (
    <div className="product-badge-overlay">
      <span className={`badge ${tempClass}`}>{tempText}</span>

      {stock === 0 ? (
        <span className="badge badge-soldout">🔴 已售完</span>
      ) : stock <= 5 ? (
        <span className="badge badge-low-stock low-stock-badge">⚠️ 僅剩 {stock} 件</span>
      ) : (
        <span className="badge badge-stock">庫存: {stock}</span>
      )}
    </div>
  );
};
