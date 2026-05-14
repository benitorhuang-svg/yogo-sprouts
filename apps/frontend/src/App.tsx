import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import AnnouncementBar from '@/components/AnnouncementBar';
import SearchBar from '@/components/SearchBar';
import CategoryTabs from '@/components/CategoryTabs';
import ProductList from '@/components/ProductList';
import CartBar from '@/components/CartBar';
import { audioManager } from '@/audioManager';

import MusicPlayer from '@/components/MusicPlayer';

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
        {/* Modals will be added here later */}
        <div id="product-detail-modal" className="modal-wrapper"></div>
        <div id="checkout-modal" className="modal-wrapper"></div>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;