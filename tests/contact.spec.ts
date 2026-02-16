import { test, expect } from '@playwright/test';

test.describe('Contact Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact.html');
  });

  test('contact page should display all information', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Contact Us');
    
    // Check for proprietor info
    await expect(page.locator('.contact-item', { hasText: 'Proprietor' })).toContainText('Ariga Kishore Reddy');
    
    // Check for phone
    await expect(page.locator('.contact-item', { hasText: 'Phone' })).toContainText('+91 9000044256');
    
    // Check for address
    await expect(page.locator('.contact-item', { hasText: 'Address' })).toBeVisible();
    await expect(page.locator('.address-lines')).toContainText('Piduguralla');
  });

  test('map tabs should be present and functional', async ({ page }) => {
    const tabs = ['Piduguralla', 'Miryalaguda', 'Narasaraopeta'];
    
    for (const tabName of tabs) {
      const tab = page.locator('.map-tab', { hasText: tabName });
      await expect(tab).toBeVisible();
    }
    
    // Click on different tabs
    await page.locator('.map-tab', { hasText: 'Miryalaguda' }).click();
    await expect(page.locator('#map-miryalaguda')).toBeVisible();
    
    await page.locator('.map-tab', { hasText: 'Narasaraopeta' }).click();
    await expect(page.locator('#map-narasaraopeta')).toBeVisible();
    
    // Switch back to Piduguralla
    await page.locator('.map-tab', { hasText: 'Piduguralla' }).click();
    await expect(page.locator('#map-piduguralla')).toBeVisible();
  });

  test('active tab should have correct styling', async ({ page }) => {
    // Piduguralla should be active by default
    const pidugurallaTab = page.locator('.map-tab', { hasText: 'Piduguralla' });
    await expect(pidugurallaTab).toHaveClass(/active/);
    
    // Click on Miryalaguda
    await page.locator('.map-tab', { hasText: 'Miryalaguda' }).click();
    
    // Miryalaguda should now be active
    const miryalagudaTab = page.locator('.map-tab', { hasText: 'Miryalaguda' });
    await expect(miryalagudaTab).toHaveClass(/active/);
    
    // Piduguralla should not be active
    await expect(pidugurallaTab).not.toHaveClass(/active/);
  });

  test('map iframes should be present', async ({ page }) => {
    // Check active map (Piduguralla) is visible by default
    const activeMap = page.locator('#map-piduguralla');
    await expect(activeMap).toBeVisible();
    
    // Check iframe in active map
    const activeIframe = activeMap.locator('iframe');
    await expect(activeIframe).toBeVisible();
    const src = await activeIframe.getAttribute('src');
    expect(src).toContain('google.com/maps');
    
    // Check other maps exist but are hidden
    const hiddenMaps = ['map-miryalaguda', 'map-narasaraopeta'];
    for (const mapId of hiddenMaps) {
      const mapContainer = page.locator(`#${mapId}`);
      await expect(mapContainer).toBeHidden();
      
      // But iframe should still exist in DOM
      const iframe = mapContainer.locator('iframe');
      await expect(iframe).toHaveCount(1);
    }
    
    // Click on Miryalaguda tab and check it becomes visible
    await page.locator('.map-tab', { hasText: 'Miryalaguda' }).click();
    await expect(page.locator('#map-miryalaguda')).toBeVisible();
    await expect(page.locator('#map-piduguralla')).toBeHidden();
  });

  test('back to home link should work', async ({ page }) => {
    const backLink = page.locator('.back-link');
    await backLink.click();
    
    await expect(page).toHaveURL(/index.html|\/$/);
  });

  test('WhatsApp float button should be visible', async ({ page }) => {
    const whatsappBtn = page.locator('.whatsapp-float');
    await expect(whatsappBtn).toBeVisible();
    
    const href = await whatsappBtn.getAttribute('href');
    expect(href).toContain('wa.me');
  });

  test('contact grid should be responsive', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(grid).toBeVisible();
  });
});
