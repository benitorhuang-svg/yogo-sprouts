import { FC, useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

const ProductDetailModal: FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useAppContext();
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImgIndex(0);
      setQty(1);
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const images =
    selectedProduct.detailImgs && selectedProduct.detailImgs.length > 0
      ? selectedProduct.detailImgs
      : [selectedProduct.img || ''];

  const handlePrev = () => {
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(selectedProduct.id);
    }
    setSelectedProduct(null);
  };

  const handleLineShare = () => {
    const text = `我發現了這個好東西：【${selectedProduct.name}】！\n規格：${selectedProduct.spec}\n快來看看吧：${window.location.href}`;
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const badgeClass = selectedProduct.cold ? 'badge-cold' : 'badge-normal';
  const badgeText = selectedProduct.cold ? '❄️ 冷藏' : '📦 常溫';

  return (
    <div className="modal-wrapper active" id="product-detail-modal">
      <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}></div>
      <div className="modal-card detail-modal-card">
        <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
          ✕
        </button>

        <div className="detail-modal-layout">
          {/* Left: Gallery */}
          <div className="detail-gallery">
            <div className="slideshow-container">
              <div className="slide-wrapper">
                <img
                  src={images[activeImgIndex]}
                  alt={selectedProduct.name}
                  className="active-slide-img"
                />
              </div>
              {images.length > 1 && (
                <>
                  <button className="slide-nav-btn prev-slide" onClick={handlePrev}>
                    ❮
                  </button>
                  <button className="slide-nav-btn next-slide" onClick={handleNext}>
                    ❯
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="thumbnail-indicator-track">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    className={`thumbnail-item ${idx === activeImgIndex ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="detail-main-info">
            <div className="detail-title-row">
              <h2>{selectedProduct.name}</h2>
              <div className="detail-badges">
                <span className={`badge ${badgeClass}`}>{badgeText}</span>
                {selectedProduct.stock <= 5 && selectedProduct.stock > 0 && (
                  <span className="badge badge-low-stock">⚠️ 僅剩 {selectedProduct.stock} 件</span>
                )}
                {selectedProduct.stock === 0 && (
                  <span className="badge badge-soldout">🔴 已售完</span>
                )}
              </div>
              <button className="line-share-btn" onClick={handleLineShare}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
                  alt="LINE"
                  className="line-share-icon"
                />
                分享
              </button>
            </div>

            <div className="detail-meta-box">
              <span className="detail-price-tag">${selectedProduct.price}</span>
              <span className="detail-spec-tag">/ {selectedProduct.spec}</span>
            </div>

            <div className="detail-features-box">
              <h3>✨ 商品特色</h3>
              <ul>
                {selectedProduct.features.map((f, i) => (
                  <li key={i}>✅ {f}</li>
                ))}
              </ul>
            </div>

            <div className="detail-shipping-alert">
              <p>🚚 配送運費依溫層與材積裝箱，未達免運由專人報價</p>
            </div>

            <div className="detail-purchase-bar">
              <div className="detail-qty-wrapper">
                <span className="qty-label">數量</span>
                <div className="qty-control">
                  <button
                    className="qty-btn btn-minus"
                    disabled={qty <= 1}
                    onClick={() => setQty(qty - 1)}
                  >
                    −
                  </button>
                  <span className="qty-display active">{qty}</span>
                  <button
                    className="qty-btn btn-plus"
                    disabled={qty >= selectedProduct.stock}
                    onClick={() => setQty(qty + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="modal-add-to-cart-btn"
                disabled={selectedProduct.stock === 0}
                onClick={handleAddToCart}
              >
                加入購物車
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
