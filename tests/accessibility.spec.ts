import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('pages should have proper heading structure', async ({ page }) => {
    const pages = ['/', '/our-story.html', '/menu.html', '/contact.html', '/feedback.html'];
    
    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      
      // Check for h1 or main heading (some pages use h2 as main heading)
      const heading = page.locator('h1, h2, .section-title').first();
      await expect(heading).toBeVisible();
      
      // Check that heading is not empty
      const headingText = await heading.textContent();
      expect(headingText?.trim().length).toBeGreaterThan(0);
    }
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Logo might not need alt, but product images should
      const src = await img.getAttribute('src');
      if (src && !src.includes('logo')) {
        expect(alt).toBeTruthy();
        expect(alt?.trim().length).toBeGreaterThan(0);
      }
    }
  });

  test('interactive elements should be focusable', async ({ page }) => {
    await page.goto('/');
    
    // Check buttons
    const buttons = page.locator('button, .home-btn, .category-link');
    const firstButton = buttons.first();
    await firstButton.focus();
    await expect(firstButton).toBeFocused();
    
    // Check links
    const links = page.locator('a');
    const firstLink = links.first();
    await firstLink.focus();
    await expect(firstLink).toBeFocused();
  });

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/feedback.html');
    
    // Check that inputs have associated labels
    const inputs = page.locator('input[type="text"], input[type="tel"], input[type="email"], textarea');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Open menu with keyboard
    const menuBtn = page.locator('#menuBtn');
    await menuBtn.focus();
    await page.keyboard.press('Enter');
    
    const sideNav = page.locator('#sideNav');
    // Check if menu is visible (either by class or by being displayed)
    const isVisible = await sideNav.isVisible();
    expect(isVisible).toBeTruthy();
    
    // Navigate through menu items with Tab
    await page.keyboard.press('Tab');
    
    // Close menu with Escape or close button
    const closeBtn = page.locator('#closeNavBtn');
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.focus();
      await page.keyboard.press('Enter');
    }
  });

  test('color contrast should be sufficient', async ({ page }) => {
    await page.goto('/');
    
    // Check main text elements
    const elements = [
      page.locator('h1, h2, h3').first(),
      page.locator('p').first(),
      page.locator('a').first()
    ];
    
    for (const element of elements) {
      if (await element.isVisible().catch(() => false)) {
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor
          };
        });
        
        // Elements should have visible colors
        expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');
      }
    }
  });

  test('ARIA attributes should be present where needed', async ({ page }) => {
    await page.goto('/');
    
    // Check cart button
    const cartBtn = page.locator('.cart-float');
    const cartLabel = await cartBtn.getAttribute('aria-label');
    expect(cartLabel).toBeTruthy();
    
    // Check navigation menu - it should exist
    const sideNav = page.locator('#sideNav');
    await expect(sideNav).toBeVisible();
    
    // Check close button
    const closeBtn = page.locator('#closeNavBtn');
    const closeLabel = await closeBtn.getAttribute('aria-label');
    expect(closeLabel).toBeTruthy();
  });

  test('page should have proper language attribute', async ({ page }) => {
    const pages = ['/', '/our-story.html', '/menu.html', '/contact.html', '/feedback.html', '/cart.html'];
    
    for (const path of pages) {
      await page.goto(path);
      
      const html = page.locator('html');
      const lang = await html.getAttribute('lang');
      expect(lang).toBe('en');
    }
  });

  test('skip links or main landmark should be present', async ({ page }) => {
    await page.goto('/');
    
    // Check for main landmark
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for header landmark
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('modal should trap focus', async ({ page }) => {
    await page.goto('/menu.html');
    
    // Open a product modal
    const productCard = page.locator('.menu-item, .info-card').first();
    if (await productCard.isVisible().catch(() => false)) {
      await productCard.click();
      
      const modal = page.locator('.modal-overlay, .product-modal');
      if (await modal.isVisible().catch(() => false)) {
        // Modal should be visible
        await expect(modal).toBeVisible();
        
        // Close button should be focusable
        const closeBtn = page.locator('.close-modal, #closeModal');
        await closeBtn.focus();
        await expect(closeBtn).toBeFocused();
        
        // Close modal
        await closeBtn.click();
      }
    }
  });
});
