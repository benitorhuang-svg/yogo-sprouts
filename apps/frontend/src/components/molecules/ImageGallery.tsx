import React, { FC, useState } from 'react';

interface ImageGalleryProps {
  productName: string;
  images: string[];
}

/**
 * 🖼️ ImageGallery Component
 * 處理商品詳情的輪播與縮圖展示
 */
export const ImageGallery: FC<ImageGalleryProps> = ({ productName, images }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const handlePrev = () => setActiveIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () => setActiveIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  if (images.length === 0) return null;

  return (
    <div className="detail-gallery">
      <div className="slideshow-container">
        <div className="slide-wrapper">
          <img src={images[activeIdx]} alt={productName} className="active-slide-img" />
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
              className={`thumbnail-item ${idx === activeIdx ? 'active' : ''}`}
              onClick={() => setActiveIdx(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
