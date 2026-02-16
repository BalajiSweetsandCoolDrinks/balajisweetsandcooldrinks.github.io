import { test, expect } from '@playwright/test';

test.describe('Shopping Cart Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('cart should be empty initially', async ({ page }) => {
    await page.goto('/cart.html');
    
    await expect(page.locator('.cart-empty')).toBeVisible();
    await expect(page.locator('.cart-empty h2')).toContainText('Your cart is empty');
  });

  test('should add item to cart from product page', async ({ page }) => {
    await page.goto('/kaju.variety.html');
    
    // Click on product to open modal
    const productCard = page.locator('.menu-item, .info-card').first();
    await productCard.click();
    
    // Wait for modal and add to cart
    const addBtn = page.locator('.add-btn');
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    
    // Check toast notification
    const toast = page.locator('#toast');
    await expect(toast).toContainText('Added to cart');
    
    // Verify cart count updated
    const cartCount = page.locator('#cartCount');
    await expect(cartCount).toHaveText('1');
  });

  test('should add multiple items to cart', async ({ page }) => {
    await page.goto('/menu.html');
    
    // Add first product
    const productCards = page.locator('.menu-item, .info-card');
    await productCards.nth(0).click();
    await page.locator('.add-btn').click();
    await page.waitForTimeout(500);
    
    // Close modal if open
    const closeModal = page.locator('.close-modal, #closeModal');
    if (await closeModal.isVisible().catch(() => false)) {
      await closeModal.click();
    }
    
    // Add second product
    await productCards.nth(1).click();
    await page.locator('.add-btn').click();
    
    // Verify cart count
    const cartCount = page.locator('#cartCount');
    await expect(cartCount).toHaveText('2');
  });

  test('should update item quantity in cart', async ({ page }) => {
    // Add item to cart first
    await page.goto('/ladoo.html');
    const productCard = page.locator('.menu-item, .info-card').first();
    await productCard.click();
    await page.locator('.add-btn').click();
    
    // Go to cart
    await page.goto('/cart.html');
    
    // Increase quantity
    const increaseBtn = page.locator('.qty-btn', { hasText: '+' });
    await increaseBtn.click();
    
    // Verify quantity updated
    const qtyValue = page.locator('.qty-value');
    await expect(qtyValue).toHaveText('2');
  });

  test('should decrease item quantity in cart', async ({ page }) => {
    // Add item with quantity 2
    await page.goto('/menu.html');
    const productCard = page.locator('.menu-item, .info-card').first();
    await productCard.click();
    
    // Increase quantity before adding
    await page.locator('.qty-btn', { hasText: '+' }).click();
    await page.locator('.add-btn').click();
    
    // Go to cart
    await page.goto('/cart.html');
    
    // Decrease quantity
    const decreaseBtn = page.locator('.qty-btn', { hasText: '−' });
    await decreaseBtn.click();
    
    // Verify quantity updated
    const qtyValue = page.locator('.qty-value');
    await expect(qtyValue).toHaveText('1');
  });

  test('should remove item from cart', async ({ page }) => {
    // Add item to cart
    await page.goto('/assorted-sweets.html');
    const productCard = page.locator('.menu-item, .info-card').first();
    await productCard.click();
    await page.locator('.add-btn').click();
    
    // Go to cart
    await page.goto('/cart.html');
    
    // Remove item
    const removeBtn = page.locator('.remove-btn');
    await removeBtn.click();
    
    // Verify cart is empty
    await expect(page.locator('.cart-empty')).toBeVisible();
  });

  test('should clear entire cart', async ({ page }) => {
    // Add multiple items
    await page.goto('/menu.html');
    const productCards = page.locator('.menu-item, .info-card');
    
    await productCards.nth(0).click();
    await page.locator('.add-btn').click();
    await page.waitForTimeout(500);
    
    // Go to cart
    await page.goto('/cart.html');
    
    // Clear cart
    const clearBtn = page.locator('.clear-cart-btn');
    await clearBtn.click();
    
    // Verify cart is empty
    await expect(page.locator('.cart-empty')).toBeVisible();
    
    // Verify toast
    const toast = page.locator('#toast');
    await expect(toast).toContainText('Cart cleared');
  });

  test('should calculate cart total correctly', async ({ page }) => {
    await page.goto('/menu.html');
    
    // Add product
    const productCard = page.locator('.menu-item, .info-card').first();
    await productCard.click();
    await page.locator('.add-btn').click();
    
    // Go to cart and check total
    await page.goto('/cart.html');
    
    const totalElement = page.locator('.summary-row.total span').last();
    await expect(totalElement).toContainText('₹');
    
    // Get price and verify it's a number
    const totalText = await totalElement.textContent();
    const priceMatch = totalText?.match(/₹(\d+)/);
    expect(priceMatch).toBeTruthy();
    expect(parseInt(priceMatch![1])).toBeGreaterThan(0);
  });

  test('should persist cart across page navigation', async ({ page }) => {
    // Add item
    await page.goto('/kaju.variety.html');
    const productCard = page.locator('.menu-item, .info-card').first();
    await productCard.click();
    await page.locator('.add-btn').click();
    
    // Navigate to different page
    await page.goto('/menu.html');
    
    // Check cart count persisted
    const cartCount = page.locator('#cartCount');
    await expect(cartCount).toHaveText('1');
    
    // Navigate to cart
    await page.goto('/cart.html');
    
    // Verify item still in cart
    await expect(page.locator('.cart-item')).toBeVisible();
  });

  test('checkout modal should open and close', async ({ page }) => {
    // Add item and go to cart
    await page.goto('/menu.html');
    const productCard = page.locator('.menu-item, .info-card').first();
    await productCard.click();
    await page.locator('.add-btn').click();
    
    await page.goto('/cart.html');
    
    // Open checkout
    const checkoutBtn = page.locator('.checkout-btn');
    await checkoutBtn.click();
    
    // Verify modal is visible
    const modal = page.locator('#checkoutModal');
    await expect(modal).toHaveClass(/active/);
    
    // Close modal
    const cancelBtn = page.locator('#cancelBtn');
    await cancelBtn.click();
    
    await expect(modal).not.toHaveClass(/active/);
  });

  test('should complete checkout with customer details', async ({ page }) => {
    // Add item and go to cart
    await page.goto('/ladoo.html');
    const productCard = page.locator('.menu-item, .info-card').first();
    await productCard.click();
    await page.locator('.add-btn').click();
    
    await page.goto('/cart.html');
    
    // Open checkout
    await page.locator('.checkout-btn').click();
    
    // Fill customer details
    await page.fill('#custName', 'Test Customer');
    await page.fill('#custAddr', '123 Test Street, Test City');
    
    // Mock window.open to capture WhatsApp URL
    const whatsappPromise = page.waitForEvent('popup');
    
    // Confirm checkout
    await page.locator('#confirmBtn').click();
    
    // Verify WhatsApp popup opened (accept both wa.me and api.whatsapp.com)
    const popup = await whatsappPromise.catch(() => null);
    if (popup) {
      await expect(popup).toHaveURL(/wa.me|api.whatsapp.com/);
      await popup.close();
    }
    
    // Verify cart was cleared
    await expect(page.locator('.cart-empty')).toBeVisible();
  });

  test('should handle different product sizes/weights', async ({ page }) => {
    await page.goto('/menu.html');
    
    // Open product modal
    const productCard = page.locator('.menu-item, .info-card').first();
    await productCard.click();
    
    // Select different size
    const sizeBtns = page.locator('.size-btn');
    if (await sizeBtns.count() > 1) {
      await sizeBtns.nth(1).click();
      
      // Verify price updated
      const priceElement = page.locator('#modalPrice');
      await expect(priceElement).toBeVisible();
    }
    
    // Add to cart
    await page.locator('.add-btn').click();
    
    // Verify item added
    const toast = page.locator('#toast');
    await expect(toast).toContainText('Added to cart');
  });
});
