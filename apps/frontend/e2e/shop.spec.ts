import { test, expect } from '@playwright/test';

test.describe('YoGo Store E2E Tests', () => {
  test('homepage has title and renders products', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/');

    // 2. Expect title
    await expect(page).toHaveTitle(/YoGo 有夠菜/);

    // 3. Expect header to be visible
    const header = page.locator('header.site-header');
    await expect(header).toBeVisible();

    // 4. Expect category tabs to be visible
    const tabs = page.locator('.category-tabs');
    await expect(tabs).toBeVisible();

    // 5. Expect at least one product card to be visible
    const productCards = page.locator('.product-card');
    await expect(productCards.first()).toBeVisible();
  });
});
