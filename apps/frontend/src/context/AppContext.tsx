import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Product, Category, CartState, CATEGORIES } from '@yogo/shared';
import { useToasts } from '../hooks/useToasts';
import { useProducts } from '../hooks/useProducts';
import { useAuth, User } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

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
  clearCart: (orderData?: unknown) => Promise<void>;
  login: (
    email: string,
    name?: string,
    password?: string,
    provider?: 'google' | 'line',
    isSignup?: boolean
  ) => Promise<void>;
  logout: () => void;
  updateUserData: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  prewarm: () => void;
  getTotal: () => number;
  getDiscount: () => number;
  isLoadingProducts: boolean;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  appliedCoupon: string | null;
  setAppliedCoupon: (code: string) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAdminDashboardOpen: boolean;
  setIsAdminDashboardOpen: (open: boolean) => void;
  showToast: (message: string) => void;
  toasts: { id: number; message: string }[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * 🏛️ AppProvider (Facade / 門面)
 * 整合所有原子化的 Hooks 並提供統一的上下文介面
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. 原子化狀態 Hooks
  const { toasts, showToast } = useToasts();
  const { products, isLoadingProducts } = useProducts();
  const { user, login, logout, updateUserData, resetPassword, prewarm } = useAuth(showToast);

  const API_BASE =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'https://us-central1-yogo-sprouts-app.cloudfunctions.net/api'
      : '/api';

  const {
    cart,
    setCart,
    appliedCoupon,
    setAppliedCoupon,
    getTotal,
    getDiscount,
    addToCart,
    removeFromCart,
    clearCart,
  } = useCart(products, user, showToast, API_BASE);

  // 2. 共享的 UI 狀態
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

  // 3. 收藏邏輯 (簡單，暫留)
  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };
  const isFavorite = (productId: number) => favorites.includes(productId);

  // 4. 彙整 Provider Value (使用 useMemo 優化效能)
  const contextValue = useMemo(
    () => ({
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
      updateUserData,
      resetPassword,
      prewarm,
      getTotal,
      getDiscount,
      isLoadingProducts,
      selectedProduct,
      setSelectedProduct,
      appliedCoupon,
      setAppliedCoupon,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isAdminDashboardOpen,
      setIsAdminDashboardOpen,
      showToast,
      toasts,
    }),
    [
      products,
      cart,
      selectedCategory,
      searchQuery,
      favorites,
      user,
      isLoadingProducts,
      selectedProduct,
      appliedCoupon,
      isCheckoutOpen,
      isAdminDashboardOpen,
      toasts,
      showToast,
      login,
      logout,
      updateUserData,
      resetPassword,
      prewarm,
      addToCart,
      removeFromCart,
      clearCart,
      getTotal,
      getDiscount,
    ]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      <div className="toast-container">
        {toasts.map((t: { id: number; message: string }) => (
          <div key={t.id} className="toast">
            {t.message}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
