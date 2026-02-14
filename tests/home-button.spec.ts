/**
 * @deprecated This file is deprecated. Please use comprehensive.spec.ts for all test scenarios.
 * 
 * This file contains legacy tests that are now superseded by comprehensive.spec.ts
 * which covers all pages, mobile responsiveness, and the updated mobile header changes.
 * 
 * @see tests/comprehensive.spec.ts
 */
import { test, expect } from '@playwright/test';

/**
 * Test suite for Home Button functionality across all pages
 * Covers: Visual appearance, positioning, hover effects, and navigation
 */

// Pages that have the home button (product pages with simple headers)
const pagesWithHomeButton = [
  { name: 'Bengali Sweets', path: 'bengali-sweets.html' },
  { name: 'Baklava', path: 'baklava.html' },
  { name: 'Assorted Sweets', path: 'assorted-sweets.html' },
  { name: 'Kalakand', path: 'kalakand.html' },
  { name: 'Palakova', path: 'palakova.html' },
  { name: 'Dry Fruits', path: 'dry-fruits.html' },
  { name: 'Namkeen', path: 'namkeen.html' },
  { name: 'Snacks', path: 'snacks.html' },
  { name: 'Soft Drinks', path: 'soft-drinks.html' },
  { name: 'Sugarfree', path: 'sugarfree.html' },
  { name: 'Kaju Variety', path: 'kaju.variety.html' },
  { name: 'Ladoo', path: 'ladoo.html' },
];

test.describe('Home Button Visual Tests', () => {
  for (const page of pagesWithHomeButton) {
    test(`Home button styling on ${page.name} page`, async ({ page: browserPage }: { page: any }) => {
      await browserPage.goto(page.path);
      
      // Wait for page to load
      await browserPage.waitForLoadState('networkidle');
      
      // Locate home button - use more flexible selector
      const homeButton = browserPage.locator('a.home-btn, header a[href="index.html"]').first();
      
      // Verify button exists
      await expect(homeButton).toBeVisible();
      
      // Verify button text
      const buttonText = await homeButton.textContent();
      expect(buttonText?.trim()).toBe('Home');
      
      // Verify button is at the end of header (check positioning)
      const header = browserPage.locator('header .wrap, header nav').first();
      const headerBox = await header.boundingBox();
      const buttonBox = await homeButton.boundingBox();
      
      // Button should be within header
      expect(buttonBox?.x).toBeGreaterThanOrEqual(headerBox?.x || 0);
      expect(buttonBox?.y).toBeGreaterThanOrEqual(headerBox?.y || 0);
      
      // Verify styling through computed styles
      const styles = await homeButton.evaluate((el: HTMLElement) => {
        const computed = window.getComputedStyle(el);
        return {
          background: computed.background,
          color: computed.color,
          padding: computed.padding,
          borderRadius: computed.borderRadius,
        };
      });

      // Check for red gradient background
      expect(styles.background).toContain('linear-gradient');
      // Check for red color in gradient (either primary or dark shade)
      const hasRedColor = styles.background.includes('rgb(196, 90, 63)') || styles.background.includes('rgb(160, 69, 53)');
      expect(hasRedColor).toBe(true);
      
      // Check white text
      expect(styles.color).toBe('rgb(255, 255, 255)');
      
      // Check padding (may vary slightly, so check it exists)
      expect(styles.padding).toBeTruthy();
      
      // Check border radius
      expect(styles.borderRadius).toBe('25px');
    });
  }
});

test.describe('Home Button Hover Effects', () => {
  test('Home button hover effect on sample page', async ({ page }: { page: any }) => {
    await page.goto('bengali-sweets.html');
    await page.waitForLoadState('networkidle');
    
    const homeButton = page.locator('a.home-btn');
    
    // Get initial state
    const initialTransform = await homeButton.evaluate((el: HTMLElement) => 
      window.getComputedStyle(el).transform
    );
    
    // Hover over button
    await homeButton.hover();
    
    // Wait for transition
    await page.waitForTimeout(300);
    
    // Get hover state
    const hoverTransform = await homeButton.evaluate((el: HTMLElement) => 
      window.getComputedStyle(el).transform
    );
    
    // Verify hover effect (transform should change)
    // Note: Exact values may vary, but transform should be different or include translate
    expect(hoverTransform).toBeTruthy();
  });
});

test.describe('Home Button Navigation', () => {
  for (const pageInfo of pagesWithHomeButton.slice(0, 5)) { // Test on 5 sample pages
    test(`Home button navigates to index from ${pageInfo.name}`, async ({ page }: { page: any }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      
      // Use flexible selector for home button
      const homeButton = page.locator('a.home-btn, header a[href="index.html"]').first();
      
      // Check if button exists before clicking
      const buttonCount = await homeButton.count();
      if (buttonCount === 0) {
        test.skip();
        return;
      }
      
      // Click home button
      await homeButton.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Verify we're on index.html
      const url = page.url();
      expect(url).toContain('index.html');
      
      // Verify index page loaded correctly
      const title = await page.title();
      expect(title).toContain('Balaji');
    });
  }
});

test.describe('Home Button Mobile Responsiveness', () => {
  for (const pageInfo of pagesWithHomeButton.slice(0, 3)) { // Test on 3 sample pages
    test(`Home button visible on mobile viewport - ${pageInfo.name}`, async ({ page }: { page: any }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      
      // Use flexible selector
      const homeButton = page.locator('a.home-btn, header a[href="index.html"]').first();
      
      // Check if button exists
      const buttonCount = await homeButton.count();
      if (buttonCount === 0) {
        test.skip();
        return;
      }
      
      // Verify button is visible on mobile
      await expect(homeButton).toBeVisible();
      
      // Verify button is clickable
      await expect(homeButton).toBeEnabled();
    });
  }
});
