import { CartState } from "./types.js";
import { PRODUCTS } from "./data.js";

export const cart: CartState = {};

export function getTotal(): number {
  return PRODUCTS.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
}

export function updateCartDisplay() {
  const total = getTotal();
  const cartTotalEl = document.getElementById('cart-total');
  if (cartTotalEl) {
    cartTotalEl.textContent = `$${total}`;
  }

  // Visual pulse on total change
  const cartBar = document.querySelector('.cart-bar');
  if (cartBar && total > 0) {
    cartBar.classList.add('pulse');
    setTimeout(() => cartBar.classList.remove('pulse'), 400);
  }
}

export function syncProductCardQty(productId: number) {
  const display = document.getElementById(`qty-${productId}`);
  const qty = cart[productId] || 0;
  if (display) {
    display.textContent = qty.toString();
    if (qty > 0) display.classList.add('active');
    else display.classList.remove('active');
  }
  const minusBtn = document.querySelector(`.product-card[data-id="${productId}"] .btn-minus`) as HTMLButtonElement;
  if (minusBtn) minusBtn.disabled = qty === 0;
}
