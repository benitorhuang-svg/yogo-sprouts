import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Product, Category, CartState, CATEGORIES, INITIAL_PRODUCTS } from '@yogo/shared';
import { audioManager } from '@/audioManager';

export interface User {
  name: string;
  email: string;
  tier: string;
  points: number;
}

interface AppContextType {
  products: Product[];
  categories: Category[];
  cart: CartState;
  selectedCategory: string;
  searchQuery: string;
  favorites: number[];
  user: User | null;
  setCart: React.Dispatch<React.SetStateAction<CartState>>;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  getTotal: () => number;
  isLoadingProducts: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartState>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('yogo-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

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
    if (user) {
      localStorage.setItem('yogo-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('yogo-user');
    }
  }, [user]);

  const login = (email: string, name?: string) => {
    audioManager.playSuccess();
    setUser({
      name: name || email.split('@')[0] || '綠手指芽農',
      email,
      tier: 'VIP 芽苗大使',
      points: 168
    });
  };

  const logout = () => {
    setUser(null);
  };

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    initialData: JSON.parse(JSON.stringify(INITIAL_PRODUCTS)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const addToCart = (productId: number) => {
    audioManager.playCartAdd();
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

  const clearCart = () => {
    setCart({});
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
        user,
        setCart,
        setSelectedCategory,
        setSearchQuery,
        toggleFavorite,
        isFavorite,
        addToCart,
        removeFromCart,
        clearCart,
        login,
        logout,
        getTotal,
        isLoadingProducts,
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
