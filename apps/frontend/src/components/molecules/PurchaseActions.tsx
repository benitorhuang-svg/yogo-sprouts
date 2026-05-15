import React, { FC, useState } from 'react';

interface PurchaseActionsProps {
  stock: number;
  onAdd: (qty: number) => void;
}

/**
 * 🛒 PurchaseActions Component
 * 處理數量選擇與加入購物車按鈕
 */
export const PurchaseActions: FC<PurchaseActionsProps> = ({ stock, onAdd }) => {
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    onAdd(qty);
    setQty(1); // 重置
  };

  return (
    <div className="detail-purchase-bar">
      <div className="detail-qty-wrapper">
        <span className="qty-label">數量</span>
        <div className="qty-control">
          <button className="qty-btn btn-minus" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>
            −
          </button>
          <span className="qty-display active">{qty}</span>
          <button
            className="qty-btn btn-plus"
            disabled={qty >= stock}
            onClick={() => setQty(qty + 1)}
          >
            +
          </button>
        </div>
      </div>
      <button className="modal-add-to-cart-btn" disabled={stock === 0} onClick={handleAdd}>
        加入購物車
      </button>
    </div>
  );
};
