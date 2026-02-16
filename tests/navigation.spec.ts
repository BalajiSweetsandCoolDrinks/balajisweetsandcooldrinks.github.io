import { test, expect } from '@playwright/test';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Our Story', path: '/our-story.html' },
  { name: 'Menu', path: '/menu.html' },
  { name: 'Specials', path: '/specials.html' },
  { name: 'Festive Gifting', path: '/festive-gifting.html' },
  { name: 'Feedback', path: '/feedback.html' },
  { name: 'Contact', path: '/contact.html' },
  { name: 'Cart', path: '/cart.html' },
  { name: 'Kaju Variety', path: '/kaju.variety.html' },
  { name: 'Kalakand', path: '/kalakand.html' },
  { name: 'Sugar Free', path: '/sugarfree.html' },
  { name: 'Baklava', path: '/baklava.html' },
  { name: 'Ladoo', path: '/ladoo.html' },
  { name: 'Palakova', path: '/palakova.html' },
  { name: 'Bengali Sweets', path: '/bengali-sweets.html' },
  { name: 'Assorted Sweets', path: '/assorted-sweets.html' },
  { name: 'Namkeen', path: '/namkeen.html' },
  { name: 'Snacks', path: '/snacks.html' },
  { name: 'Dry Fruits', path: '/dry-fruits.html' },
  { name: 'Cool Drinks', path: '/soft-drinks.html' },
];

test.describe('Navigation Tests', () => {
  test('all pages should load successfully', async ({ page }) => {
    for (const pageInfo of pages) {
      await page.goto(pageInfo.path);
      await expect(page).toHaveTitle(/Balaji Sweets/i);
      
      // Check for common elements
      const logo = page.locator('.logo, .nav-logo-text').first();
      await expect(logo).toBeVisible();
      
      // Check page-specific content
      if (pageInfo.name === 'Home') {
        await expect(page.locator('.section-title').first()).toContainText('Flavours for Every Moment');
      }
    }
  });

  test('navigation menu should open and close', async ({ page }) => {
    await page.goto('/');
    
    // Open menu
    const menuBtn = page.locator('#menuBtn');
    await menuBtn.click();
    
    const sideNav = page.locator('#sideNav');
    await expect(sideNav).toHaveClass(/active/);
    
    // Check all navigation links
    const navLinks = [
      'OUR STORY',
      'MENU',
      'SPECIALS',
      'FESTIVE GIFTING',
      'FEEDBACK',
      'CONTACT'
    ];
    
    for (const linkText of navLinks) {
      await expect(page.locator('.nav-menu a', { hasText: linkText })).toBeVisible();
    }
    
    // Close menu
    const closeBtn = page.locator('#closeNavBtn');
    await closeBtn.click();
    await expect(sideNav).not.toHaveClass(/active/);
  });

  test('navigation links should work correctly', async ({ page }) => {
    await page.goto('/');
    
    // Open menu and click each link
    const menuBtn = page.locator('#menuBtn');
    await menuBtn.click();
    
    // Test Our Story link
    await page.locator('.nav-menu a', { hasText: 'OUR STORY' }).click();
    await expect(page).toHaveURL(/our-story.html/);
    await expect(page.locator('h1').first()).toContainText('Our Story');
    
    // Go back and test Menu link
    await page.goto('/');
    await menuBtn.click();
    await page.locator('.nav-menu a', { hasText: 'MENU' }).click();
    await expect(page).toHaveURL(/menu.html/);
    await expect(page.locator('h1').first()).toContainText('Our Menu');
  });

  test('Home button should navigate to index', async ({ page }) => {
    await page.goto('/our-story.html');
    
    const homeBtn = page.locator('.home-btn');
    await homeBtn.click();
    
    await expect(page).toHaveURL(/index.html|\/$/);
  });

  test('product category cards should navigate to correct pages', async ({ page }) => {
    await page.goto('/');
    
    const categories = [
      { name: 'KAJU VARIETY', url: /kaju.variety.html/ },
      { name: 'KALAKAND', url: /kalakand.html/ },
      { name: 'SUGAR FREE', url: /sugarfree.html/ },
      { name: 'BAKLAVA', url: /baklava.html/ },
      { name: 'LADOO', url: /ladoo.html/ },
      { name: 'PALAKOVA', url: /palakova.html/ },
      { name: 'BENGALI SWEETS', url: /bengali-sweets.html/ },
      { name: 'ASSORTED SWEETS', url: /assorted-sweets.html/ },
      { name: 'NAMKEEN', url: /namkeen.html/ },
      { name: 'SNACKS', url: /snacks.html/ },
      { name: 'DRY FRUITS', url: /dry-fruits.html/ },
      { name: 'COOL DRINKS', url: /soft-drinks.html/ },
    ];
    
    for (const category of categories) {
      await page.goto('/');
      const card = page.locator('.info-card', { hasText: category.name });
      await card.click();
      await expect(page).toHaveURL(category.url);
    }
  });

  test('footer links should work', async ({ page }) => {
    await page.goto('/');
    
    // Test Contact Us footer link
    const contactLink = page.locator('.footer-link', { hasText: 'Contact Us' });
    await contactLink.click();
    await expect(page).toHaveURL(/contact.html/);
    
    // Test Feedback footer link
    await page.goto('/');
    const feedbackLink = page.locator('.footer-link', { hasText: 'Feedback' });
    await feedbackLink.click();
    await expect(page).toHaveURL(/feedback.html/);
  });

  test('WhatsApp float button should be visible', async ({ page }) => {
    await page.goto('/');
    
    const whatsappBtn = page.locator('.whatsapp-float');
    await expect(whatsappBtn).toBeVisible();
    
    // Check href contains WhatsApp number
    const href = await whatsappBtn.getAttribute('href');
    expect(href).toContain('wa.me');
  });

  test('cart float button should navigate to cart', async ({ page }) => {
    await page.goto('/');
    
    const cartBtn = page.locator('.cart-float');
    await cartBtn.click();
    
    await expect(page).toHaveURL(/cart.html/);
  });
});
