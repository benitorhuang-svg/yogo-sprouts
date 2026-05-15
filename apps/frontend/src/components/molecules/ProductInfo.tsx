import React, { FC } from 'react';
import { Product } from '@yogo/shared';

interface ProductInfoProps {
  product: Product;
  onShare: () => void;
}

/**
 * 🏷️ ProductInfo Component
 * 展示標題、標籤、分享按鈕、價格與特色
 */
export const ProductInfo: FC<ProductInfoProps> = ({ product, onShare }) => {
  const badgeClass = product.cold ? 'badge-cold' : 'badge-normal';
  const badgeText = product.cold ? '❄️ 冷藏' : '📦 常溫';

  return (
    <>
      <div className="detail-title-row">
        <h2>{product.name}</h2>
        <div className="detail-badges">
          <span className={`badge ${badgeClass}`}>{badgeText}</span>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="badge badge-low-stock">⚠️ 僅剩 {product.stock} 件</span>
          )}
          {product.stock === 0 && <span className="badge badge-soldout">🔴 已售完</span>}
        </div>
        <button className="line-share-btn" onClick={onShare}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
            alt="LINE"
            className="line-share-icon"
          />
          分享
        </button>
      </div>

      <div className="detail-meta-box">
        <span className="detail-price-tag">${product.price}</span>
        <span className="detail-spec-tag">/ {product.spec}</span>
      </div>

      <div className="detail-features-box">
        <h3>✨ 商品特色</h3>
        <ul>
          {product.features.map((f, i) => (
            <li key={i}>✅ {f}</li>
          ))}
        </ul>
      </div>

      <div className="detail-shipping-alert">
        <p>🚚 配送運費依溫層與材積裝箱，未達免運由專人報價</p>
      </div>
    </>
  );
};
