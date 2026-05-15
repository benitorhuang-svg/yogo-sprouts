import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/context/AppContext';
import { audioManager } from '@/audioManager';

// Atomic Design Components
import MainLayout from '@/components/templates/MainLayout';
import CategoryTabs from '@/components/organisms/CategoryTabs';
import ProductList from '@/components/organisms/ProductList';
import CartBar from '@/components/organisms/CartBar';
import ProductDetailModal from '@/components/organisms/ProductDetailModal';
import CheckoutModal from '@/components/organisms/CheckoutModal';

const queryClient = new QueryClient();

/**
 * 🏛️ App (Orchestrator)
 * 網站入口，負責 Provider 配置與頁面組合
 */
function App() {
  useEffect(() => {
    audioManager.initBgmAutoplay();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <MainLayout>
          <CategoryTabs />
          <ProductList />
          <CartBar />
          <ProductDetailModal />
          <CheckoutModal />
        </MainLayout>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
