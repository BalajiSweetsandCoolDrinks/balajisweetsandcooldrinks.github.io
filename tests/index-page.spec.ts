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
 * Test suite for Index Page specific tests
 * Covers: Spacing, layout, and main content
 */

test.describe('Index Page - Flavours Section Spacing', () => {
  test('Reduced spacing above Flavours for Every Moment heading', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    // Locate the section title using text content
    const sectionTitle = page.locator('.section-title').filter({ hasText: 'Flavours for Every Moment' }).first();
    
    // Verify the element exists
    await expect(sectionTitle).toBeVisible();
    
    // Get computed styles
    const marginTop = await sectionTitle.evaluate((el: HTMLElement) => 
      window.getComputedStyle(el).marginTop
    );
    
    // Verify margin-top is 30px (reduced from 60px)
    expect(marginTop).toBe('30px');
  });
  
  test('Section appears closer to header visually', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const header = page.locator('header');
    const sectionTitle = page.locator('.section-title').filter({ hasText: 'Flavours for Every Moment' }).first();
    
    const headerBox = await header.boundingBox();
    const titleBox = await sectionTitle.boundingBox();
    
    // Calculate distance between header and section
    const distance = (titleBox?.y || 0) - ((headerBox?.y || 0) + (headerBox?.height || 0));
    
    // Distance should be reasonable (not too large)
    expect(distance).toBeLessThan(100); // Less than 100px gap
  });
});

test.describe('Index Page - Visual Layout', () => {
  test('Main sections are visible', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    // Check main sections
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('.container')).toBeVisible();
    
    // Check for section titles
    const sectionTitles = page.locator('.section-title');
    await expect(sectionTitles.first()).toBeVisible();
  });
  
  test('Navigation links are present', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    // Verify navigation structure
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check for specific nav links
    const navLinks = page.locator('.nav-menu a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});

test.describe('Index Page - Mobile Responsiveness', () => {
  test('Layout adjusts correctly on mobile', async ({ page }: { page: any }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    // Verify main content is still visible
    const sectionTitle = page.locator('.section-title').filter({ hasText: 'Flavours for Every Moment' }).first();
    await expect(sectionTitle).toBeVisible();
    
    // Check that text is readable (not too small or cut off)
    const titleBox = await sectionTitle.boundingBox();
    expect(titleBox?.width).toBeGreaterThan(100); // Should be reasonably wide on mobile
  });
});
