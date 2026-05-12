import { Product } from "./types.js";
import { cart, updateCartDisplay } from "./cart.js";
import { showToast } from "./toast.js";
import { logAnalyticsEvent } from "./analytics.js";

let currentSlideIndex = 0;
let modalSlides: string[] = [];

export function openDetailModal(product: Product) {
  const modal = document.getElementById('product-detail-modal');
  if (!modal) return;

  currentSlideIndex = 0;
  // Initialize slides. We reuse product main image + fallback to logo/banner to simulate multi-image carousel
  modalSlides = [product.img || '', 'img/brand/about-banner.png'];
  if (!product.img) {
    modalSlides = ['img/brand/logo.png', 'img/brand/about-banner.png'];
  }

  const badgeClass = product.cold ? 'badge-cold' : 'badge-normal';
  const badgeText = product.cold ? '❄️ 冷藏運送' : '📦 常溫商品';

  // Stock status text in modal
  let stockStatusHtml = '';
  if (product.stock === 0) {
    stockStatusHtml = `<span class="badge badge-soldout" aria-disabled="true">🔴 目前已售完</span>`;
  } else {
    stockStatusHtml = `<span class="badge badge-stock">在庫數量：${product.stock} 件</span>`;
  }

  const featuresHtml = product.features.map(f => `<li>✨ ${f}</li>`).join('');

  // Cart quantity in detail modal
  const cartQty = cart[product.id] || 0;
  // Detail Modal internal temp counter
  let tempQty = product.stock === 0 ? 0 : Math.max(1, cartQty);
  if (tempQty > product.stock) {
    tempQty = product.stock;
  }

  // Log view_item event (C1. Firebase Analytics)
  logAnalyticsEvent('view_item', {
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    category: product.category
  });

  // C3. ARIA: role="dialog", aria-modal="true", aria-labelledby="modal-title"
  modal.innerHTML = `
    <div class="modal-backdrop" id="detail-modal-backdrop"></div>
    <div class="modal-card detail-modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-close-btn" id="close-detail-modal-btn" aria-label="關閉商品詳情彈窗">&times;</button>
      
      <div class="detail-modal-layout">
        <!-- Left Column: Carousel -->
        <div class="detail-gallery">
          <div class="slideshow-container">
            <button class="slide-nav-btn prev-slide" id="prev-slide-btn" aria-label="上一張圖片">&#10094;</button>
            <div class="slide-wrapper" id="slide-wrapper">
              <img src="${modalSlides[0]}" alt="${product.name} 商品圖" class="active-slide-img" id="active-slide-img">
            </div>
            <button class="slide-nav-btn next-slide" id="next-slide-btn" aria-label="下一張圖片">&#10095;</button>
          </div>
          <div class="thumbnail-indicator-track" id="thumbnail-track">
            ${modalSlides.map((s, index) => `<img src="${s}" class="thumbnail-item ${index === 0 ? 'active' : ''}" data-index="${index}" alt="${product.name} 縮圖 ${index + 1}">`).join('')}
          </div>
        </div>

        <!-- Right Column: Info & Action -->
        <div class="detail-main-info">
          <div class="detail-title-row">
            <h2 id="modal-title">${product.name}</h2>
            <button class="line-share-btn" id="line-share-btn" title="分享到 LINE" aria-label="分享商品到 LINE">
              <svg class="line-share-icon" viewBox="0 0 24 24" style="width: 14px; height: 14px; fill: currentColor;">
                <path d="M24 10.3c0-4.7-5.4-8.5-12-8.5S0 5.6 0 10.3c0 4.2 4.3 7.7 10.1 8.4.4.1.9.3 1.1.7l.4 1.8c.1.5-.2.8-.5.7-.3-.1-1.6-.8-2.2-1.3l-.2-.1C3.8 19.3 0 15.2 0 10.3c0-4.7 5.4-8.5 12-8.5s12 3.8 12 8.5c0 4.9-3.8 9-8.7 9.5l-.2.1c-.6.5-1.9 1.2-2.2 1.3-.3.1-.6-.2-.5-.7l.4-1.8c.2-.4.7-.6 1.1-.7 5.8-.7 10.1-4.2 10.1-8.4z"/>
              </svg>
              <span>分享</span>
            </button>
            <div class="detail-badges">
              <span class="badge ${badgeClass}">${badgeText}</span>
              ${stockStatusHtml}
            </div>
          </div>
          
          <div class="detail-meta-box">
            <span class="detail-price-tag">$${product.price}</span>
            <span class="detail-spec-tag">/ 規格：${product.spec}</span>
          </div>

          <div class="detail-features-box">
            <h3>🌱 鮮菜特色與介紹</h3>
            <ul>
              ${featuresHtml}
            </ul>
          </div>

          <div class="detail-shipping-alert">
            <p>🚚 <strong>低溫/常溫獨立運算說明</strong></p>
            <p>本坊鮮菜與套組採雙溫層裝箱。常溫訂單滿 $800 免運，冷藏滿 $2,000 免運，未達門檻時運費將由專人電話/LINE另行報價。</p>
          </div>

          <!-- Purchase control -->
          <div class="detail-purchase-bar">
            <div class="detail-qty-wrapper">
              <span class="qty-label">選購數量：</span>
              <div class="qty-control">
                <button class="qty-btn" id="modal-qty-minus" aria-label="減少選購數量" ${tempQty <= 1 ? 'disabled' : ''}>−</button>
                <span class="qty-display active" id="modal-qty-display">${tempQty}</span>
                <button class="qty-btn" id="modal-qty-plus" aria-label="增加選購數量" ${product.stock === 0 || tempQty >= product.stock ? 'disabled' : ''}>+</button>
              </div>
            </div>
            
            <button class="modal-add-to-cart-btn" id="modal-add-btn" aria-label="將商品加入購物籃" ${product.stock === 0 ? 'disabled' : ''}>
              ${product.stock === 0 ? '🔴 目前無庫存' : '🛒 加入購物籃'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.classList.add('modal-open');

  // Slide navigation logic
  const activeSlideImg = document.getElementById('active-slide-img') as HTMLImageElement;
  const thumbnails = modal.querySelectorAll('.thumbnail-item');

  function showSlide(index: number) {
    if (index >= modalSlides.length) currentSlideIndex = 0;
    else if (index < 0) currentSlideIndex = modalSlides.length - 1;
    else currentSlideIndex = index;

    activeSlideImg.src = modalSlides[currentSlideIndex];
    thumbnails.forEach((t, i) => {
      if (i === currentSlideIndex) t.classList.add('active');
      else t.classList.remove('active');
    });
  }

  document.getElementById('prev-slide-btn')?.addEventListener('click', () => showSlide(currentSlideIndex - 1));
  document.getElementById('next-slide-btn')?.addEventListener('click', () => showSlide(currentSlideIndex + 1));
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      const idx = Number((e.currentTarget as HTMLElement).dataset.index);
      showSlide(idx);
    });
  });

  // Modal local quantity modification
  const modalMinus = document.getElementById('modal-qty-minus') as HTMLButtonElement;
  const modalPlus = document.getElementById('modal-qty-plus') as HTMLButtonElement;
  const modalDisplay = document.getElementById('modal-qty-display') as HTMLElement;
  const modalAddBtn = document.getElementById('modal-add-btn') as HTMLButtonElement;

  function updateModalQtyControls() {
    if (modalMinus) modalMinus.disabled = tempQty <= 1;
    if (modalPlus) modalPlus.disabled = tempQty >= product.stock;
    if (modalDisplay) modalDisplay.textContent = tempQty.toString();
  }

  modalMinus?.addEventListener('click', () => {
    if (tempQty > 1) {
      tempQty--;
      updateModalQtyControls();
    }
  });

  modalPlus?.addEventListener('click', () => {
    if (tempQty < product.stock) {
      tempQty++;
      updateModalQtyControls();
    } else {
      showToast('已達該品項庫存上限！');
    }
  });

  modalAddBtn?.addEventListener('click', () => {
    if (product.stock === 0) return;
    cart[product.id] = tempQty;
    
    // Sync main card display quantity
    const display = document.getElementById(`qty-${product.id}`);
    if (display) {
      display.textContent = tempQty.toString();
      display.classList.add('active');
    }
    // Update minus button disabled on main grid card
    const cardMinus = document.querySelector(`.product-card[data-id="${product.id}"] .btn-minus`) as HTMLButtonElement;
    if (cardMinus) cardMinus.disabled = false;

    // Log add_to_cart event (C1. Firebase Analytics)
    logAnalyticsEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: tempQty,
      value: product.price * tempQty
    });

    updateCartDisplay();
    closeDetailModal();
    showToast(`成功加入 ${product.name} x${tempQty} 件！`);
  });

  // LINE Share button handler
  document.getElementById('line-share-btn')?.addEventListener('click', () => {
    const text = `🌱 推薦你 YoGo 有夠菜的「${product.name}」只要 $${product.price}！\n👉 ${window.location.href}`;
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });

  // Modal closing hooks
  document.getElementById('close-detail-modal-btn')?.addEventListener('click', closeDetailModal);
  document.getElementById('detail-modal-backdrop')?.addEventListener('click', closeDetailModal);
}

export function closeDetailModal() {
  const modal = document.getElementById('product-detail-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.innerHTML = '';
  }
  document.body.classList.remove('modal-open');
}
