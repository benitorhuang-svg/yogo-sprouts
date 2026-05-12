import { loadProductsState } from "./data.js";
import { renderShop, setupShopQtyDelegation } from "./shop.js";
import { updateCartDisplay } from "./cart.js";
import { setupScrollSpyAndSticky } from "./scrollSpy.js";
import { setupAdminSecretEntrance } from "./admin.js";
import { openCheckoutModal } from "./checkoutModal.js";
import { initSearch } from "./search.js";

document.addEventListener('DOMContentLoaded', async () => {
  // Load State
  await loadProductsState();
  
  // Render Main Page products
  renderShop();
  
  // Initialize product search filtering
  initSearch();
  
  // Wire dynamic shopping cart widgets
  updateCartDisplay();
  
  // Setup ScrollSpy & Sticky Category Bar
  setupScrollSpyAndSticky();
  
  // Wire global event delegation for shopping grids
  setupShopQtyDelegation();
  
  // Setup Admin 5-click trigger
  setupAdminSecretEntrance();
  
  // Setup Dark Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    const updateThemeIcon = (theme: string) => {
      themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    };
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeIcon(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      updateThemeIcon(nextTheme);
      localStorage.setItem('yogo_theme', nextTheme);
    });
  }

  // Wire Checkout Modal triggers
  document.getElementById('checkout-btn')?.addEventListener('click', openCheckoutModal);
});
