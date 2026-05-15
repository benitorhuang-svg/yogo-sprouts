import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseClient';
import { Product, INITIAL_PRODUCTS } from '@yogo/shared';

/**
 * 📦 useProducts Hook
 * 專職管理商品資料獲取與快取
 */
export const useProducts = () => {
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const productsCol = collection(db, 'products');
        const snap = await getDocs(productsCol);
        if (!snap.empty) {
          const firestoreProducts: Product[] = [];
          snap.forEach((docSnap) => {
            firestoreProducts.push(docSnap.data() as Product);
          });
          return firestoreProducts.sort((a, b) => a.id - b.id);
        } else {
          // 資料庫為空時，僅回傳本地預設資料，不嘗試寫入 (避免權限報錯)
          return INITIAL_PRODUCTS;
        }
      } catch (err) {
        console.error('Firestore products fetch error:', err);
        return INITIAL_PRODUCTS;
      }
    },
    initialData: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
    staleTime: 1000 * 30, // 30秒快取
  });

  return { products, isLoadingProducts };
};
