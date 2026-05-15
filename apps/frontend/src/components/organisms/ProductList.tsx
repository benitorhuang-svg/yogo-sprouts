import { FC } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useFilteredProducts } from '@/hooks/useFilteredProducts';

// Atomic Components
import { ProductSection } from '../molecules/ProductSection';
import { EmptyResults } from '../molecules/EmptyResults';

/**
 * 🏛️ ProductList (Orchestrator / 指揮官)
 * 管理商品的過濾邏輯，並決定渲染哪些分類區塊或空狀態
 */
const ProductList: FC = () => {
  const { products, categories, selectedCategory, searchQuery, favorites } = useAppContext();

  // 1. 使用自定義 Hook 處理過濾邏輯
  const filteredProducts = useFilteredProducts(products, selectedCategory, searchQuery, favorites);

  // 2. 如果完全沒結果，顯示空狀態
  if (filteredProducts.length === 0) {
    return (
      <main className="shop-main">
        <EmptyResults searchQuery={searchQuery} isFavorites={selectedCategory === 'favorites'} />
      </main>
    );
  }

  return (
    <main className="shop-main" id="shop">
      {categories
        .filter(
          (cat: any) =>
            selectedCategory === 'all' ||
            selectedCategory === cat.id ||
            selectedCategory === 'favorites'
        )
        .map((cat: any) => {
          // 只渲染該分類下的過濾後商品
          const catProducts = filteredProducts.filter((p: any) => p.category === cat.id);

          return (
            <ProductSection key={cat.id} id={cat.id} title={cat.label} products={catProducts} />
          );
        })}
    </main>
  );
};

export default ProductList;
