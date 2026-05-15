import { FC, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

// Atomic Components
import { ImageGallery } from '../molecules/ImageGallery';
import { ProductInfo } from '../molecules/ProductInfo';
import { PurchaseActions } from '../molecules/PurchaseActions';

/**
 * 🏛️ ProductDetailModal (Switcher / 總指揮)
 * 負責管理詳情視圖的佈局、外部狀態與分享邏輯
 */
const ProductDetailModal: FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useAppContext();

  useEffect(() => {
    if (selectedProduct) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  // 1. 準備圖片陣列
  const images =
    selectedProduct.detailImgs && selectedProduct.detailImgs.length > 0
      ? selectedProduct.detailImgs
      : [selectedProduct.img || ''];

  // 2. 處理加入購物車 (批次)
  const handleBatchAdd = (qty: number) => {
    for (let i = 0; i < qty; i++) {
      addToCart(selectedProduct.id);
    }
    setSelectedProduct(null);
  };

  // 3. 處理 LINE 分享
  const handleLineShare = () => {
    const text = `我發現了這個好東西：【${selectedProduct.name}】！\n規格：${selectedProduct.spec}\n快來看看吧：${window.location.href}`;
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="modal-wrapper active" id="product-detail-modal">
      <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}></div>
      <div className="modal-card detail-modal-card">
        <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
          ✕
        </button>

        <div className="detail-modal-layout">
          {/* Left: Gallery (Atomic) */}
          <ImageGallery productName={selectedProduct.name} images={images} />

          {/* Right: Info & Actions */}
          <div className="detail-main-info">
            <ProductInfo product={selectedProduct} onShare={handleLineShare} />
            <PurchaseActions stock={selectedProduct.stock} onAdd={handleBatchAdd} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
