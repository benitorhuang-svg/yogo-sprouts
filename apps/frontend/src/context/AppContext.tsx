import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, CartState } from '../types';
import { CATEGORIES, INITIAL_PRODUCTS } from '../../legacy-src/data'; // Importing initial data for now

interface AppContextType {
  products: Product[];
  categories: Category[];
  cart: CartState;
  selectedCategory: string;
  searchQuery: string;
  favorites: number[];
  setProducts: (products: Product[]) => void;
  setCart: React.Dispatch<React.SetStateAction<CartState>>;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  getTotal: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartState>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const savedFavs = localStorage.getItem('yogo-favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error('Failed to parse favorites from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('yogo-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    // Mimic loadProductsState
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          return;
        }
      } catch (e) {
        console.error('Failed to fetch products from API, falling back to local memory.', e);
      }
      setProducts(JSON.parse(JSON.stringify(INITIAL_PRODUCTS)));
    };

    fetchProducts();
  }, []);

  const addToCart = (productId: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      const newQty = (prev[productId] || 0) - 1;
      if (newQty <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [productId]: newQty,
      };
    });
  };

  const getTotal = () => {
    return products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId: number) => favorites.includes(productId);

  return (
    <AppContext.Provider
      value={{
        products,
        categories: CATEGORIES,
        cart,
        selectedCategory,
        searchQuery,
        favorites,
        setProducts,
        setCart,
        setSelectedCategory,
        setSearchQuery,
        toggleFavorite,
        isFavorite,
        addToCart,
        removeFromCart,
        getTotal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
