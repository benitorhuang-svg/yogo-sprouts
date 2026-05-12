import { Product } from "./types.js";
import { CATEGORIES, PRODUCTS } from "./data.js";
import { cart, updateCartDisplay } from "./cart.js";
import { openDetailModal } from "./detailModal.js";
import { showToast } from "./toast.js";
import { isFavorite, toggleFavorite } from "./favorites.js";
import { logAnalyticsEvent } from "./analytics.js";

export function renderShop() {
  const container = document.getElementById('shop');
  if (!container) return;
  container.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const products = PRODUCTS.filter(p => p.category === cat.id);
    const section = document.createElement('section');
    section.className = 'category-section';
    section.id = `section-${cat.id}`;
    section.dataset.category = cat.id;

    section.innerHTML = `<h3>${cat.label}</h3><div class="product-grid" id="grid-${cat.id}"></div>`;
    container.appendChild(section);

    const grid = section.querySelector('.product-grid') as HTMLElement;
    products.forEach(p => {
      grid.appendChild(createProductCard(p));
    });
  });
}

export function createProductCard(product: Product): HTMLElement {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.id = product.id.toString();

  if (product.stock === 0) {
    card.classList.add('sold-out');
  }

  const qty = cart[product.id] || 0;
  const badgeClass = product.cold ? 'badge-cold' : 'badge-normal';
  const badgeText = product.cold ? '❄️ 冷藏' : '📦 常溫';

  // Stock Badge
  let stockBadgeHtml = '';
  if (product.stock === 0) {
    stockBadgeHtml = `<span class="badge badge-soldout">🔴 已售完</span>`;
  } else if (product.stock <= 5) {
    stockBadgeHtml = `<span class="badge badge-low-stock low-stock-badge">⚠️ 僅剩 ${product.stock} 件</span>`;
  } else {
    stockBadgeHtml = `<span class="badge badge-stock">庫存: ${product.stock}</span>`;
  }

  const imgHtml = product.img
    ? `<img src="${product.img}" alt="${product.name}" class="product-img" loading="lazy">`
    : `<div class="product-img-placeholder">${product.emoji}</div>`;

  const isPlusDisabled = qty >= product.stock ? 'disabled' : '';

  card.innerHTML = `
    <div class="product-card-media-wrapper">
      ${imgHtml}
      <div class="product-badge-overlay">
        <span class="badge ${badgeClass}">${badgeText}</span>
        ${stockBadgeHtml}
      </div>
      <button class="favorite-toggle-btn" data-id="${product.id}" aria-label="收藏商品">
        ${isFavorite(product.id) ? '❤️' : '🤍'}
      </button>
    </div>
    <div class="product-info">
      <div class="product-name-row">
        <span class="product-name">${product.name}</span>
      </div>
      <div class="product-spec-row">
        <span class="product-spec-desc">${product.spec}</span>
      </div>
      <div class="product-bottom">
        <span class="product-price">$${product.price}</span>
        <div class="qty-control" onclick="event.stopPropagation();">
          <button class="qty-btn btn-minus" data-id="${product.id}" aria-label="減少數量" ${qty === 0 ? 'disabled' : ''}>−</button>
          <span class="qty-display ${qty > 0 ? 'active' : ''}" id="qty-${product.id}">${qty}</span>
          <button class="qty-btn btn-plus" data-id="${product.id}" aria-label="增加數量" ${product.stock === 0 || isPlusDisabled ? 'disabled' : ''}>+</button>
        </div>
      </div>
    </div>
  `;

  // Attach favorite click handler directly with stopPropagation
  const favBtn = card.querySelector('.favorite-toggle-btn') as HTMLButtonElement;
  if (favBtn) {
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering detail popup modal!
      const isFav = toggleFavorite(product.id);
      favBtn.textContent = isFav ? '❤️' : '🤍';
      if (isFav) {
        showToast('商品已加入我的收藏！');
      } else {
        showToast('已取消收藏該商品。');
        const activeTab = document.querySelector('.tab-btn.active') as HTMLElement;
        if (activeTab && activeTab.dataset.category === 'favorites') {
          card.classList.add('hidden');
          const section = card.closest('.category-section') as HTMLElement;
          if (section) {
            const visibleCards = section.querySelectorAll('.product-card:not(.hidden)');
            if (visibleCards.length === 0) {
              section.classList.add('hidden');
            }
          }
        }
      }
    });
  }

  // Attach card detail popup trigger
  card.addEventListener('click', () => {
    openDetailModal(product);
  });

  return card;
}

// Global Quantity Delegation for main Shop Grid
export function setupShopQtyDelegation() {
  const shop = document.getElementById('shop');
  if (!shop) return;

  shop.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.qty-btn') as HTMLButtonElement;
    if (!btn) return;

    e.stopPropagation();
    const id = Number(btn.dataset.id);
    const p = PRODUCTS.find(prod => prod.id === id);
    if (!p) return;

    const display = document.getElementById(`qty-${id}`);
    const minusBtn = shop.querySelector(`.product-card[data-id="${id}"] .btn-minus`) as HTMLButtonElement;
    const plusBtn = shop.querySelector(`.product-card[data-id="${id}"] .btn-plus`) as HTMLButtonElement;

    if (btn.classList.contains('btn-plus')) {
      const currentQty = cart[id] || 0;
      if (currentQty < p.stock) {
        cart[id] = currentQty + 1;
        logAnalyticsEvent('add_to_cart', {
          item_id: p.id,
          item_name: p.name,
          price: p.price,
          quantity: 1,
          value: p.price
        });
      } else {
        showToast('已達該品項庫存上限！');
      }
    } else if (btn.classList.contains('btn-minus')) {
      cart[id] = Math.max(0, (cart[id] || 0) - 1);
    }

    const nextQty = cart[id] || 0;
    
    // Update local widgets
    if (display) {
      display.textContent = nextQty.toString();
      if (nextQty > 0) display.classList.add('active');
      else display.classList.remove('active');
    }
    if (minusBtn) {
      minusBtn.disabled = nextQty === 0;
    }
    if (plusBtn) {
      plusBtn.disabled = nextQty >= p.stock;
    }

    updateCartDisplay();
  });
}
