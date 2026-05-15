import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import CategoryTabs from '@/components/CategoryTabs';
import ProductList from '@/components/ProductList';
import CartBar from '@/components/CartBar';
import { audioManager } from '@/audioManager';

import ProductDetailModal from '@/components/ProductDetailModal';
import CheckoutModal from '@/components/CheckoutModal';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    audioManager.initBgmAutoplay();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Header />
        <AnnouncementBar />
        <CategoryTabs />
        <ProductList />
        <CartBar />
        <ProductDetailModal />
        <CheckoutModal />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
