import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import AnnouncementBar from './components/AnnouncementBar';
import SearchBar from './components/SearchBar';
import CategoryTabs from './components/CategoryTabs';
import ProductList from './components/ProductList';
import CartBar from './components/CartBar';

function App() {
  return (
    <AppProvider>
      <Header />
      <AnnouncementBar />
      <SearchBar />
      <CategoryTabs />
      <ProductList />
      <CartBar />
      {/* Modals will be added here later */}
      <div id="product-detail-modal" className="modal-wrapper"></div>
      <div id="checkout-modal" className="modal-wrapper"></div>
    </AppProvider>
  );
}

export default App;