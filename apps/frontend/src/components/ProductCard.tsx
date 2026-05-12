import { FC } from 'react';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, removeFromCart, isFavorite, toggleFavorite } = useAppContext();
  const qty = cart[product.id] || 0;

  const badgeClass = product.cold ? 'badge-cold' : 'badge-normal';
  const badgeText = product.cold ? '❄️ 冷藏' : '📦 常溫';

  let stockBadge;
  if (product.stock === 0) {
    stockBadge = <span className="badge badge-soldout">🔴 已售完</span>;
  } else if (product.stock <= 5) {
    stockBadge = <span className="badge badge-low-stock low-stock-badge">⚠️ 僅剩 {product.stock} 件</span>;
  } else {
    stockBadge = <span className="badge badge-stock">庫存: {product.stock}</span>;
  }

  const isPlusDisabled = qty >= product.stock;

  return (
    <div className={`product-card ${product.stock === 0 ? 'sold-out' : ''}`} data-id={product.id}>
      <div className="product-card-media-wrapper">
        {product.img ? (
          <img src={product.img} alt={product.name} className="product-img" loading="lazy" />
        ) : (
          <div className="product-img-placeholder">{product.emoji}</div>
        )}
        <div className="product-badge-overlay">
          <span className={`badge ${badgeClass}`}>{badgeText}</span>
          {stockBadge}
        </div>
        <button
          className="favorite-toggle-btn"
          aria-label="收藏商品"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
        >
          {isFavorite(product.id) ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="product-info">
        <div className="product-name-row">
          <span className="product-name">{product.name}</span>
        </div>
        <div className="product-spec-row">
          <span className="product-spec-desc">{product.spec}</span>
        </div>
        <div className="product-bottom">
          <span className="product-price">${product.price}</span>
          <div className="qty-control" onClick={(e) => e.stopPropagation()}>
            <button
              className="qty-btn btn-minus"
              aria-label="減少數量"
              disabled={qty === 0}
              onClick={() => removeFromCart(product.id)}
            >
              −
            </button>
            <span className={`qty-display ${qty > 0 ? 'active' : ''}`}>{qty}</span>
            <button
              className="qty-btn btn-plus"
              aria-label="增加數量"
              disabled={product.stock === 0 || isPlusDisabled}
              onClick={() => addToCart(product.id)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
