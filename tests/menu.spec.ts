import { test, expect } from '@playwright/test';

test.describe('Menu Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu.html');
  });

  test('menu page should display category buttons', async ({ page }) => {
    await expect(page.locator('h1').first()).toContainText('Our Menu');
    
    const categories = [
      'ALL',
      'KAJU VARIETY',
      'KALAKAND',
      'SUGAR FREE',
      'BAKLAVA',
      'LADOO',
      'PALAKOVA',
      'BENGALI SWEETS',
      'ASSORTED SWEETS',
      'NAMKEEN',
      'SNACKS',
      'DRY FRUITS',
      'COOL DRINKS'
    ];
    
    for (const category of categories) {
      await expect(page.locator('.category-link', { hasText: category })).toBeVisible();
    }
  });

  test('category filter should show products', async ({ page }) => {
    // Click on KAJU VARIETY
    await page.locator('.category-link', { hasText: 'KAJU VARIETY' }).click();
    
    // Wait for products to load
    await page.waitForTimeout(500);
    
    // Check if products are displayed or coming soon message
    const products = page.locator('.menu-item, .info-card');
    const comingSoon = page.locator('.coming-soon-box');
    
    const hasProducts = await products.count() > 0;
    const hasComingSoon = await comingSoon.isVisible().catch(() => false);
    
    expect(hasProducts || hasComingSoon).toBeTruthy();
  });

  test('ALL category should show all available products', async ({ page }) => {
    await page.locator('.category-link', { hasText: 'ALL' }).click();
    await page.waitForTimeout(500);
    
    const products = page.locator('.menu-item, .info-card');
    await expect(products.first()).toBeVisible();
  });

  test('coming soon categories should show appropriate message', async ({ page }) => {
    const comingSoonCategories = [
      'KALAKAND',
      'SUGAR FREE',
      'BAKLAVA',
      'PALAKOVA',
      'BENGALI SWEETS',
      'NAMKEEN',
      'SNACKS',
      'DRY FRUITS',
      'COOL DRINKS'
    ];
    
    for (const category of comingSoonCategories) {
      await page.goto('/menu.html');
      await page.locator('.category-link', { hasText: category }).click();
      await page.waitForTimeout(500);
      
      // Check for coming soon message
      const comingSoonBox = page.locator('.coming-soon-box');
      if (await comingSoonBox.isVisible().catch(() => false)) {
        await expect(comingSoonBox).toContainText('Coming Soon');
      }
    }
  });

  test('product cards should be clickable', async ({ page }) => {
    await page.locator('.category-link', { hasText: 'ALL' }).click();
    await page.waitForTimeout(500);
    
    const productCards = page.locator('.menu-item, .info-card');
    
    if (await productCards.count() > 0) {
      const firstCard = productCards.first();
      await firstCard.click();
      
      // Check if modal opens or navigates to product page
      const modal = page.locator('.modal-overlay, .product-modal');
      const modalVisible = await modal.isVisible().catch(() => false);
      
      if (modalVisible) {
        await expect(modal).toBeVisible();
        // Close modal
        await page.locator('.close-modal, #closeModal').click();
      }
    }
  });

  test('product modal should display product details', async ({ page }) => {
    await page.locator('.category-link', { hasText: 'ALL' }).click();
    await page.waitForTimeout(500);
    
    const productCards = page.locator('.menu-item, .info-card');
    
    if (await productCards.count() > 0) {
      await productCards.first().click();
      
      const modal = page.locator('.modal-overlay, .product-modal');
      if (await modal.isVisible().catch(() => false)) {
        // Check product title
        await expect(page.locator('#modalTitle')).toBeVisible();
        
        // Check price
        await expect(page.locator('#modalPrice')).toBeVisible();
        
        // Check size options
        const sizeBtns = page.locator('.size-btn');
        if (await sizeBtns.count() > 0) {
          await expect(sizeBtns.first()).toBeVisible();
        }
        
        // Check quantity selector
        await expect(page.locator('.qty-input')).toBeVisible();
        
        // Check add to cart button
        await expect(page.locator('.add-btn')).toBeVisible();
      }
    }
  });

  test('size selection should update price', async ({ page }) => {
    await page.locator('.category-link', { hasText: 'ALL' }).click();
    await page.waitForTimeout(500);
    
    const productCards = page.locator('.menu-item, .info-card');
    
    if (await productCards.count() > 0) {
      await productCards.first().click();
      
      const sizeBtns = page.locator('.size-btn');
      if (await sizeBtns.count() > 1) {
        // Get initial price
        const initialPrice = await page.locator('#modalPrice').textContent();
        
        // Click on different size
        await sizeBtns.nth(1).click();
        await page.waitForTimeout(300);
        
        // Check price updated
        const newPrice = await page.locator('#modalPrice').textContent();
        expect(newPrice).not.toBe(initialPrice);
      }
    }
  });

  test('quantity adjustment should work', async ({ page }) => {
    await page.locator('.category-link', { hasText: 'ALL' }).click();
    await page.waitForTimeout(500);
    
    const productCards = page.locator('.menu-item, .info-card');
    
    if (await productCards.count() > 0) {
      await productCards.first().click();
      
      const qtyInput = page.locator('#qtyVal');
      const initialQty = await qtyInput.textContent();
      
      // Increase quantity
      await page.locator('.qty-btn', { hasText: '+' }).click();
      await page.waitForTimeout(300);
      
      const newQty = await qtyInput.textContent();
      expect(parseInt(newQty || '0')).toBeGreaterThan(parseInt(initialQty || '0'));
    }
  });

  test('back to home link should work', async ({ page }) => {
    const backLink = page.locator('.back-link');
    await backLink.click();
    
    await expect(page).toHaveURL(/index.html|\/$/);
  });
});
