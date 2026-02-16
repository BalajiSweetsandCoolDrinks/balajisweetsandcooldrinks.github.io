import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile Large', width: 414, height: 896 },
    { name: 'Mobile Small', width: 375, height: 667 },
    { name: 'Mobile Extra Small', width: 320, height: 568 },
  ];

  for (const viewport of viewports) {
    test(`homepage should render correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Check main elements are visible
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('.nav-logo-text, .logo')).toBeVisible();
      
      // Check grid layout adapts
      const grid = page.locator('.grid-layout');
      await expect(grid).toBeVisible();
      
      // Check product cards are visible
      const cards = page.locator('.info-card');
      await expect(cards.first()).toBeVisible();
      
      // Take screenshot for visual regression
      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, {
        fullPage: true,
        maxDiffPixels: 100
      });
    });

    test(`navigation menu should work on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // On mobile, hamburger menu should be visible
      if (viewport.width <= 768) {
        const hamburger = page.locator('#menuBtn');
        await expect(hamburger).toBeVisible();
        
        // Open menu
        await hamburger.click();
        const sideNav = page.locator('#sideNav');
        await expect(sideNav).toHaveClass(/active/);
        
        // Close menu
        await page.locator('#closeNavBtn').click();
        await expect(sideNav).not.toHaveClass(/active/);
      }
    });
  }

  test('product grid should adapt columns on different screen sizes', async ({ page }) => {
    await page.goto('/');
    
    // Desktop - 4 columns
    await page.setViewportSize({ width: 1280, height: 720 });
    const cards = page.locator('.info-card');
    const firstCard = cards.first();
    const desktopBox = await firstCard.boundingBox();
    expect(desktopBox?.width).toBeGreaterThan(200);
    
    // Tablet - 3 columns
    await page.setViewportSize({ width: 1024, height: 768 });
    const tabletBox = await firstCard.boundingBox();
    expect(tabletBox?.width).toBeGreaterThan(200);
    
    // Mobile - 2 columns
    await page.setViewportSize({ width: 600, height: 800 });
    const mobileBox = await firstCard.boundingBox();
    expect(mobileBox?.width).toBeGreaterThan(100);
    expect(mobileBox?.width).toBeLessThan(300);
  });

  test('cart page should be responsive', async ({ page }) => {
    await page.goto('/cart.html');
    
    // Desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('.cart-container')).toBeVisible();
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.cart-container')).toBeVisible();
    
    // Check cart items layout on mobile
    const cartItems = page.locator('.cart-item');
    if (await cartItems.count() > 0) {
      const firstItem = cartItems.first();
      await expect(firstItem).toBeVisible();
    }
  });

  test('contact page maps should be responsive', async ({ page }) => {
    await page.goto('/contact.html');
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      const mapContainer = page.locator('.map-container').first();
      await expect(mapContainer).toBeVisible();
      
      const iframe = mapContainer.locator('iframe');
      await expect(iframe).toBeVisible();
    }
  });

  test('feedback form should be usable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/feedback.html');
    
    // Form should be visible and accessible
    await expect(page.locator('#feedbackForm')).toBeVisible();
    
    // Input fields should be usable
    await page.fill('#customerName', 'Mobile Test User');
    await page.fill('#comments', 'Testing on mobile device');
    
    // Radio buttons should be clickable
    await page.check('input[value="sweets"]');
    
    // Star ratings should work
    const stars = page.locator('[data-rating="tasteRating"] span');
    await stars.nth(3).click();
  });

  test('menu page category bar should scroll horizontally on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/menu.html');
    
    const categoryBar = page.locator('.category-bar');
    await expect(categoryBar).toBeVisible();
    
    // Category buttons should be visible
    const categoryButtons = page.locator('.category-link');
    await expect(categoryButtons.first()).toBeVisible();
  });

  test('text should remain readable on all screen sizes', async ({ page }) => {
    await page.goto('/');
    
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Check that text is not too small
      const logo = page.locator('.nav-logo-text, .logo').first();
      const styles = await logo.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          fontSize: computed.fontSize,
          lineHeight: computed.lineHeight
        };
      });
      
      const fontSize = parseInt(styles.fontSize);
      expect(fontSize).toBeGreaterThanOrEqual(10); // Minimum readable size
    }
  });
});
