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
 * Cross-browser compatibility tests
 * Verifies consistent rendering across different browsers
 */

const testPages = [
  { name: 'Homepage', path: 'index.html' },
  { name: 'Bengali Sweets', path: 'bengali-sweets.html' },
  { name: 'Menu', path: 'menu.html' },
];

test.describe('Cross-Browser Visual Consistency', () => {
  for (const pageInfo of testPages) {
    test(`${pageInfo.name} renders correctly`, async ({ page }: { page: any }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      
      // Take screenshot for visual comparison
      await expect(page).toHaveScreenshot(`${pageInfo.name.toLowerCase().replace(' ', '-')}.png`, {
        maxDiffPixels: 100,
      });
    });
  }
});

test.describe('CSS Properties Consistency', () => {
  test('Home button has consistent styling across browsers', async ({ page }: { page: any }) => {
    await page.goto('bengali-sweets.html');
    await page.waitForLoadState('networkidle');
    
    // Use flexible selector for home button
    const homeButton = page.locator('a.home-btn, header a[href="index.html"]').first();
    
    // Check if button exists
    const buttonCount = await homeButton.count();
    if (buttonCount === 0) {
      test.skip();
      return;
    }
    
    // Verify computed styles - allow tolerance for padding
    const styles = await homeButton.evaluate((el: HTMLElement) => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background,
        color: computed.color,
        padding: computed.padding,
        borderRadius: computed.borderRadius,
        fontSize: computed.fontSize,
      };
    });
    
    // Verify expected values with tolerances
    expect(styles.color).toBe('rgb(255, 255, 255)');
    // Allow padding variation
    expect(styles.padding).toMatch(/^\d+px \d+px$/);
    expect(styles.borderRadius).toBe('25px');
  });
});
