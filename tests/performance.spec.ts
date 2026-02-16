import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('homepage should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check that main content is visible
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.grid-layout')).toBeVisible();
  });

  test('all pages should load efficiently', async ({ page }) => {
    const pages = [
      '/',
      '/our-story.html',
      '/menu.html',
      '/specials.html',
      '/festive-gifting.html',
      '/feedback.html',
      '/contact.html',
      '/cart.html'
    ];
    
    for (const path of pages) {
      const startTime = Date.now();
      await page.goto(path);
      const loadTime = Date.now() - startTime;
      
      // Each page should load in less than 2 seconds
      expect(loadTime).toBeLessThan(2000);
      
      // Check that page has content
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('images should load properly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for images to load
    await page.waitForLoadState('networkidle');
    
    const images = page.locator('img');
    const count = await images.count();
    
    let loadedCount = 0;
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const isVisible = await img.isVisible().catch(() => false);
      if (isVisible) {
        loadedCount++;
      }
    }
    
    // At least 80% of images should load
    expect(loadedCount / count).toBeGreaterThan(0.8);
  });

  test('cart operations should be fast', async ({ page }) => {
    await page.goto('/menu.html');
    
    // Add item to cart
    const productCard = page.locator('.menu-item, .info-card').first();
    if (await productCard.isVisible().catch(() => false)) {
      const startTime = Date.now();
      await productCard.click();
      await page.locator('.add-btn').click();
      const addTime = Date.now() - startTime;
      
      // Add to cart should take less than 1 second
      expect(addTime).toBeLessThan(1000);
      
      // Toast should appear quickly
      const toast = page.locator('#toast');
      await expect(toast).toBeVisible();
    }
  });

  test('navigation should be responsive', async ({ page }) => {
    await page.goto('/');
    
    // Open menu
    const startTime = Date.now();
    await page.locator('#menuBtn').click();
    const openTime = Date.now() - startTime;
    
    // Menu should open in less than 500ms
    expect(openTime).toBeLessThan(500);
    
    await expect(page.locator('#sideNav')).toHaveClass(/active/);
  });

  test('page should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to a few pages
    await page.goto('/menu.html');
    await page.goto('/cart.html');
    
    // Should not have critical errors
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('google-analytics')
    );
    
    expect(criticalErrors.length).toBe(0);
  });

  test('localStorage operations should be fast', async ({ page }) => {
    await page.goto('/');
    
    // Test localStorage write
    const writeStart = Date.now();
    await page.evaluate(() => {
      localStorage.setItem('test_key', 'test_value');
    });
    const writeTime = Date.now() - writeStart;
    
    // Write should be instant
    expect(writeTime).toBeLessThan(100);
    
    // Test localStorage read
    const readStart = Date.now();
    const value = await page.evaluate(() => {
      return localStorage.getItem('test_key');
    });
    const readTime = Date.now() - readStart;
    
    // Read should be instant
    expect(readTime).toBeLessThan(100);
    expect(value).toBe('test_value');
    
    // Cleanup
    await page.evaluate(() => {
      localStorage.removeItem('test_key');
    });
  });
});
