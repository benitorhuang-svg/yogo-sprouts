import { FC } from 'react';
import { Product } from '@yogo/shared';
import ProductCard from '../organisms/ProductCard';

interface ProductSectionProps {
  id: string;
  title: string;
  products: Product[];
}

export const ProductSection: FC<ProductSectionProps> = ({ id, title, products }) => {
  if (products.length === 0) return null;

  return (
    <section className="product-category" id={id}>
      <h2 className="category-title">{title}</h2>
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
