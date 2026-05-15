import React, { FC } from 'react';

interface CardQuantityControlProps {
  qty: number;
  stock: number;
  onAdd: (e: React.MouseEvent) => void;
  onRemove: (e: React.MouseEvent) => void;
}

/**
 * 🔢 CardQuantityControl Component
 * 商品卡片底部的數量加減控制項
 */
export const CardQuantityControl: FC<CardQuantityControlProps> = ({
  qty,
  stock,
  onAdd,
  onRemove,
}) => {
  const isPlusDisabled = qty >= stock || stock === 0;

  return (
    <div className="qty-control" onClick={(e) => e.stopPropagation()}>
      <button
        className="qty-btn btn-minus"
        aria-label="減少數量"
        disabled={qty === 0}
        onClick={onRemove}
      >
        −
      </button>
      <span className={`qty-display ${qty > 0 ? 'active' : ''}`}>{qty}</span>
      <button
        className="qty-btn btn-plus"
        aria-label="增加數量"
        disabled={isPlusDisabled}
        onClick={onAdd}
      >
        +
      </button>
    </div>
  );
};
