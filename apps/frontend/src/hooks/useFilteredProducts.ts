import { useMemo } from 'react';
import { Product } from '@yogo/shared';

/**
 * 🔍 useFilteredProducts Hook
 * 專門負責商品列表的過濾邏輯 (搜尋、分類、收藏)
 */
export const useFilteredProducts = (
  products: Product[],
  selectedCategory: string,
  searchQuery: string,
  favorites: number[]
) => {
  return useMemo(() => {
    return products.filter((p) => {
      // 1. 搜尋字串過濾 (名稱、規格、特色)
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.spec.toLowerCase().includes(query) ||
        p.features.some((f) => f.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // 2. 分類過濾
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'favorites') return favorites.includes(p.id);
      return p.category === selectedCategory;
    });
  }, [products, selectedCategory, searchQuery, favorites]);
};
