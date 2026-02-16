import { test, expect } from '@playwright/test';

test.describe('End-to-End User Journey Tests', () => {
  test('complete purchase flow', async ({ page }) => {
    // Step 1: Visit homepage
    await page.goto('/');
    await expect(page.locator('h1, .section-title').first()).toBeVisible();
    
    // Step 2: Navigate to menu
    await page.locator('#menuBtn').click();
    await page.locator('.nav-menu a', { hasText: 'MENU' }).click();
    await expect(page).toHaveURL(/menu.html/);
    
    // Step 3: Select a category with products
    await page.locator('.category-link', { hasText: 'ALL' }).click();
    await page.waitForTimeout(500);
    
    // Step 4: Click on a product
    const productCards = page.locator('.menu-item, .info-card');
    if (await productCards.count() > 0) {
      await productCards.first().click();
      
      // Step 5: Configure product (select size if available)
      const sizeBtns = page.locator('.size-btn');
      if (await sizeBtns.count() > 1) {
        await sizeBtns.nth(1).click();
      }
      
      // Step 6: Add to cart
      await page.locator('.add-btn').click();
      await expect(page.locator('#toast')).toContainText('Added to cart');
      
      // Step 7: Go to cart
      await page.goto('/cart.html');
      await expect(page.locator('.cart-item')).toBeVisible();
      
      // Step 8: Proceed to checkout
      await page.locator('.checkout-btn').click();
      await expect(page.locator('#checkoutModal')).toHaveClass(/active/);
      
      // Step 9: Fill customer details
      await page.fill('#custName', 'Test Customer');
      await page.fill('#custAddr', '123 Test Street, Test City, 12345');
      
      // Step 10: Complete order (mock)
      const [popup] = await Promise.all([
        page.waitForEvent('popup').catch(() => null),
        page.locator('#confirmBtn').click()
      ]);
      
      if (popup) {
        await expect(popup).toHaveURL(/wa.me/);
        await popup.close();
      }
      
      // Step 11: Verify cart is cleared
      await expect(page.locator('.cart-empty')).toBeVisible();
    }
  });

  test('browse and explore multiple categories', async ({ page }) => {
    await page.goto('/');
    
    // Visit different product categories
    const categories = [
      { name: 'KAJU VARIETY', path: '/kaju.variety.html' },
      { name: 'LADOO', path: '/ladoo.html' },
      { name: 'ASSORTED SWEETS', path: '/assorted-sweets.html' }
    ];
    
    for (const category of categories) {
      // Navigate from homepage
      await page.goto('/');
      const card = page.locator('.info-card', { hasText: category.name });
      await card.click();
      
      // Verify we're on the correct page
      await expect(page).toHaveURL(new RegExp(category.path.replace('/', '')));
      
      // Check page content
      await expect(page.locator('h1, h2, h3').first()).toBeVisible();
      
      // Go back to home
      const homeBtn = page.locator('.home-btn');
      if (await homeBtn.isVisible().catch(() => false)) {
        await homeBtn.click();
        await expect(page).toHaveURL(/index.html|\/$/);
      }
    }
  });

  test('feedback submission flow', async ({ page }) => {
    // Step 1: Go to feedback page
    await page.goto('/feedback.html');
    await expect(page.locator('h1')).toContainText('Share Your Feedback');
    
    // Step 2: Fill in feedback form
    await page.fill('#customerName', 'Happy Customer');
    await page.fill('#contactInfo', 'happy@example.com');
    
    // Step 3: Select feedback type
    await page.check('input[value="sweets"]');
    
    // Step 4: Rate the experience
    const stars = page.locator('[data-rating="tasteRating"] span');
    await stars.nth(4).click(); // 5 stars
    
    // Step 5: Add comments
    await page.fill('#comments', 'The sweets were absolutely delicious! Will definitely order again.');
    
    // Step 6: Submit feedback
    const [popup] = await Promise.all([
      page.waitForEvent('popup').catch(() => null),
      page.click('button[type="submit"]')
    ]);
    
    if (popup) {
      await popup.close();
    }
    
    // Step 7: Verify success message
    await expect(page.locator('#successMessage')).toBeVisible();
    await expect(page.locator('#successMessage h2')).toContainText('Thank You');
  });

  test('contact page exploration', async ({ page }) => {
    // Step 1: Visit contact page
    await page.goto('/contact.html');
    await expect(page.locator('h1')).toContainText('Contact Us');
    
    // Step 2: View contact information
    await expect(page.locator('.contact-item', { hasText: 'Proprietor' })).toBeVisible();
    await expect(page.locator('.contact-item', { hasText: 'Phone' })).toBeVisible();
    await expect(page.locator('.contact-item', { hasText: 'Address' })).toBeVisible();
    
    // Step 3: Explore different branch maps
    const branches = ['Piduguralla', 'Miryalaguda', 'Narasaraopeta'];
    
    for (const branch of branches) {
      await page.locator('.map-tab', { hasText: branch }).click();
      await expect(page.locator(`#map-${branch.toLowerCase()}`)).toBeVisible();
    }
    
    // Step 4: Click WhatsApp button
    const whatsappBtn = page.locator('.whatsapp-float');
    await expect(whatsappBtn).toBeVisible();
    
    // Step 5: Navigate back to home
    const backLink = page.locator('.back-link');
    await backLink.click();
    await expect(page).toHaveURL(/index.html|\/$/);
  });

  test('cart management flow', async ({ page }) => {
    // Step 1: Add multiple items to cart
    await page.goto('/menu.html');
    await page.locator('.category-link', { hasText: 'ALL' }).click();
    await page.waitForTimeout(500);
    
    const productCards = page.locator('.menu-item, .info-card');
    const productCount = await productCards.count();
    
    if (productCount >= 2) {
      // Add first product
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
      
      // Step 2: Go to cart
      await page.goto('/cart.html');
      
      // Step 3: Verify both items are in cart
      const cartItems = page.locator('.cart-item');
      await expect(cartItems).toHaveCount(2);
      
      // Step 4: Update quantities
      const increaseBtns = page.locator('.qty-btn', { hasText: '+' });
      await increaseBtns.first().click();
      
      // Step 5: Remove one item
      const removeBtns = page.locator('.remove-btn');
      await removeBtns.first().click();
      
      // Step 6: Verify cart updated
      await expect(page.locator('.cart-item')).toHaveCount(1);
      
      // Step 7: Clear cart
      await page.locator('.clear-cart-btn').click();
      
      // Step 8: Verify cart is empty
      await expect(page.locator('.cart-empty')).toBeVisible();
    }
  });

  test('mobile navigation flow', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Step 1: Visit homepage
    await page.goto('/');
    
    // Step 2: Open navigation menu
    const hamburger = page.locator('#menuBtn');
    await hamburger.click();
    
    const sideNav = page.locator('#sideNav');
    await expect(sideNav).toHaveClass(/active/);
    
    // Step 3: Navigate to menu page
    await page.locator('.nav-menu a', { hasText: 'MENU' }).click();
    await expect(page).toHaveURL(/menu.html/);
    
    // Step 4: Select category
    await page.locator('.category-link', { hasText: 'ALL' }).click();
    await page.waitForTimeout(500);
    
    // Step 5: Scroll to see products
    await page.evaluate(() => window.scrollTo(0, 300));
    
    // Step 6: Navigate back using hamburger menu
    await hamburger.click();
    await page.locator('.nav-menu a', { hasText: 'CONTACT' }).click();
    await expect(page).toHaveURL(/contact.html/);
  });
});
