import React, { FC } from 'react';
import { Product } from '@yogo/shared';
import { useAppContext } from '@/context/AppContext';

// Atomic Components
import { ProductBadge } from '../atoms/ProductBadge';
import { FavoriteButton } from '../atoms/FavoriteButton';
import { CardQuantityControl } from '../atoms/CardQuantityControl';

interface ProductCardProps {
  product: Product;
}

/**
 * 🏛️ ProductCard (Switcher / 總指揮)
 * 負責單個商品的展示外框、基礎資訊與交互事件調度
 */
const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, removeFromCart, isFavorite, toggleFavorite, setSelectedProduct } =
    useAppContext();

  const qty = cart[product.id] || 0;

  return (
    <div
      className={`product-card ${product.stock === 0 ? 'sold-out' : ''}`}
      onClick={() => setSelectedProduct(product)}
    >
      <div className="product-card-media-wrapper">
        {product.img ? (
          <img src={product.img} alt={product.name} className="product-img" loading="lazy" />
        ) : (
          <div className="product-img-placeholder">{product.emoji}</div>
        )}

        {/* Atomic: Tags & Badges */}
        <ProductBadge cold={product.cold} stock={product.stock} />

        {/* Atomic: Favorite Toggle */}
        <FavoriteButton
          isFavorite={isFavorite(product.id)}
          onToggle={(e: React.MouseEvent) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
        />
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

          {/* Atomic: Qty Control */}
          <CardQuantityControl
            qty={qty}
            stock={product.stock}
            onAdd={(e: React.MouseEvent) => {
              e.stopPropagation();
              addToCart(product.id);
            }}
            onRemove={(e: React.MouseEvent) => {
              e.stopPropagation();
              removeFromCart(product.id);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
