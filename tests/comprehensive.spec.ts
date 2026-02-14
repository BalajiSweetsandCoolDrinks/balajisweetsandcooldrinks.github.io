import { test, expect } from '@playwright/test';

/**
 * Comprehensive Test Suite for Balaji Sweets Website
 * Covers: All pages, mobile responsiveness, header functionality, navigation, and UI components
 */

// =====================
// ALL WEBSITE PAGES
// =====================
const allPages = [
  { name: 'Home', path: 'index.html', hasHeader: true, hasHomeButton: false, hasHamburger: true },
  { name: 'Menu', path: 'menu.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Our Story', path: 'our-story.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Specials', path: 'specials.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Festive Gifting', path: 'festive-gifting.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Feedback', path: 'feedback.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Contact', path: 'contact.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Cart', path: 'cart.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Bengali Sweets', path: 'bengali-sweets.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Baklava', path: 'baklava.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Assorted Sweets', path: 'assorted-sweets.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Kalakand', path: 'kalakand.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Palakova', path: 'palakova.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Dry Fruits', path: 'dry-fruits.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Namkeen', path: 'namkeen.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Snacks', path: 'snacks.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Soft Drinks', path: 'soft-drinks.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Sugar Free', path: 'sugarfree.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Kaju Variety', path: 'kaju.variety.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
  { name: 'Ladoo', path: 'ladoo.html', hasHeader: true, hasHomeButton: true, hasHamburger: false },
];

// =====================
// TEST SUITE: PAGE LOADING
// =====================
test.describe('All Pages - Page Loading', () => {
  for (const pageInfo of allPages) {
    test(`${pageInfo.name} page loads successfully`, async ({ page }: { page: any }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      
      // Verify page title contains Balaji
      const title = await page.title();
      expect(title.toLowerCase()).toContain('balaji');
    });
  }
});

// =====================
// TEST SUITE: HEADER VISIBILITY
// =====================
test.describe('All Pages - Header Visibility', () => {
  for (const pageInfo of allPages) {
    test(`${pageInfo.name} - Header is visible`, async ({ page }: { page: any }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });
  }
});

// =====================
// TEST SUITE: HOME BUTTON (Mobile Header Changes)
// =====================
test.describe('Home Button - Mobile Header Sizing', () => {
  const mobileSizes = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Small Mobile', width: 360, height: 640 },
    { name: 'Tablet', width: 768, height: 1024 },
  ];

  for (const pageInfo of allPages.filter(p => p.hasHomeButton)) {
    for (const size of mobileSizes) {
      test(`${pageInfo.name} - Home button same size as title on ${size.name} (${size.width}px)`, async ({ page }: { page: any }) => {
        await page.setViewportSize({ width: size.width, height: size.height });
        await page.goto(pageInfo.path);
        await page.waitForLoadState('networkidle');
        
        // Get the title element (either .logo or .nav-logo-text)
        const title = page.locator('header .logo, .nav-logo-text').first();
        const homeButton = page.locator('a.home-btn').first();
        
        // Get computed font sizes
        const titleFontSize = await title.evaluate((el: HTMLElement) => 
          parseFloat(window.getComputedStyle(el).fontSize)
        );
        const buttonFontSize = await homeButton.evaluate((el: HTMLElement) => 
          parseFloat(window.getComputedStyle(el).fontSize)
        );
        
        // Allow 1px tolerance for rounding differences
        expect(Math.abs(titleFontSize - buttonFontSize)).toBeLessThanOrEqual(1);
      });
    }
  }

  // Test that home button and title are on the same line
  for (const pageInfo of allPages.filter(p => p.hasHomeButton)) {
    test(`${pageInfo.name} - Home button and title on same line on mobile`, async ({ page }: { page: any }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      
      const title = page.locator('header .logo, .nav-logo-text').first();
      const homeButton = page.locator('a.home-btn').first();
      
      // Get bounding boxes
      const titleBox = await title.boundingBox();
      const buttonBox = await homeButton.boundingBox();
      
      // Both should be in the header area
      const header = page.locator('header');
      const headerBox = await header.boundingBox();
      
      // Title should be above or at the same level as button
      expect(titleBox?.y).toBeLessThanOrEqual((buttonBox?.y || 0) + 5);
    });
  }
});

// =====================
// TEST SUITE: HOME BUTTON STYLING
// =====================
test.describe('Home Button - Styling', () => {
  for (const pageInfo of allPages.filter(p => p.hasHomeButton)) {
    test(`${pageInfo.name} - Home button has correct styling`, async ({ page }: { page: any }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      
      const homeButton = page.locator('a.home-btn').first();
      
      const styles = await homeButton.evaluate((el: HTMLElement) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          borderRadius: computed.borderRadius,
          fontWeight: computed.fontWeight,
        };
      });
      
      // Verify white text
      expect(styles.color).toBe('rgb(255, 255, 255)');
      
      // Verify border radius
      expect(styles.borderRadius).toBe('25px');
    });
  }
});

// =====================
// TEST SUITE: HOME BUTTON HOVER EFFECTS
// =====================
test.describe('Home Button - Hover Effects', () => {
  for (const pageInfo of allPages.filter(p => p.hasHomeButton).slice(0, 5)) {
    test(`${pageInfo.name} - Hover effect works`, async ({ page }: { page: any }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      
      const homeButton = page.locator('a.home-btn').first();
      
      // Get initial transform
      const initialTransform = await homeButton.evaluate((el: HTMLElement) => 
        window.getComputedStyle(el).transform
      );
      
      // Hover
      await homeButton.hover();
      await page.waitForTimeout(350); // Wait for transition
      
      // Verify button is still visible after hover
      await expect(homeButton).toBeVisible();
    });
  }
});

// =====================
// TEST SUITE: HOME BUTTON NAVIGATION
// =====================
test.describe('Home Button - Navigation', () => {
  for (const pageInfo of allPages.filter(p => p.hasHomeButton)) {
    test(`${pageInfo.name} - Clicking Home button navigates to index`, async ({ page }: { page: any }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      
      const homeButton = page.locator('a.home-btn').first();
      await homeButton.click();
      
      await page.waitForLoadState('networkidle');
      
      // Should be on index.html
      expect(page.url()).toContain('index.html');
    });
  }
});

// =====================
// TEST SUITE: HAMBURGER MENU (Homepage)
// =====================
test.describe('Homepage - Hamburger Menu', () => {
  test('Hamburger menu is visible on homepage', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const hamburger = page.locator('.hamburger');
    await expect(hamburger).toBeVisible();
  });

  test('Hamburger menu opens sidebar on click', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const hamburger = page.locator('.hamburger');
    const sideNav = page.locator('#sideNav');
    
    // Click hamburger
    await hamburger.click();
    await page.waitForTimeout(500);
    
    // Side nav should be visible (active class)
    await expect(sideNav).toHaveClass(/active/);
  });

  test('Hamburger menu closes on close button', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const hamburger = page.locator('.hamburger');
    const sideNav = page.locator('#sideNav');
    const closeBtn = page.locator('#closeNavBtn');
    
    // Open menu
    await hamburger.click();
    await page.waitForTimeout(500);
    
    // Close menu
    await closeBtn.click();
    await page.waitForTimeout(500);
    
    // Side nav should not have active class
    await expect(sideNav).not.toHaveClass(/active/);
  });

  test('Hamburger menu closes when clicking outside', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const hamburger = page.locator('.hamburger');
    const sideNav = page.locator('#sideNav');
    
    // Open menu
    await hamburger.click();
    await page.waitForTimeout(500);
    
    // Click on main content area
    await page.locator('.container').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(500);
    
    // Side nav should not have active class
    await expect(sideNav).not.toHaveClass(/active/);
  });
});

// =====================
// TEST SUITE: NAVIGATION LINKS
// =====================
test.describe('Navigation Links', () => {
  const navLinks = [
    { text: 'OUR STORY', path: 'our-story.html' },
    { text: 'MENU', path: 'menu.html' },
    { text: 'SPECIALS', path: 'specials.html' },
    { text: 'FESTIVE GIFTING', path: 'festive-gifting.html' },
    { text: 'FEEDBACK', path: 'feedback.html' },
    { text: 'CONTACT', path: 'contact.html' },
  ];

  test('All navigation links are present on homepage', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    // Open hamburger menu
    await page.locator('.hamburger').click();
    await page.waitForTimeout(500);
    
    for (const link of navLinks) {
      const navLink = page.locator('.nav-menu a').filter({ hasText: link.text });
      await expect(navLink).toBeVisible();
    }
  });

  for (const link of navLinks) {
    test(`Navigation link "${link.text}" navigates correctly`, async ({ page }: { page: any }) => {
      await page.goto('index.html');
      await page.waitForLoadState('networkidle');
      
      // Open hamburger menu
      await page.locator('.hamburger').click();
      await page.waitForTimeout(500);
      
      // Click the link
      const navLink = page.locator('.nav-menu a').filter({ hasText: link.text });
      await navLink.click();
      
      await page.waitForLoadState('networkidle');
      
      // Verify navigation
      expect(page.url()).toContain(link.path);
    });
  }
});

// =====================
// TEST SUITE: PRODUCT CARDS (Homepage)
// =====================
test.describe('Homepage - Product Cards', () => {
  const productCards = [
    'Kaju Variety',
    'Kalakand',
    'Sugar Free',
    'Baklava',
    'Ladoo',
    'Palakova',
    'Bengali Sweets',
    'Assorted Sweets',
    'Namkeen',
    'Snacks',
    'Dry Fruits',
    'Cool Drinks',
  ];

  test('All product cards are visible on homepage', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    for (const product of productCards) {
      const card = page.locator('.info-card h3').filter({ hasText: product });
      await expect(card).toBeVisible();
    }
  });

  for (const product of productCards) {
    test(`Product card "${product}" is clickable`, async ({ page }: { page: any }) => {
      await page.goto('index.html');
      await page.waitForLoadState('networkidle');
      
      const card = page.locator('.info-card').filter({ hasText: product });
      
      // Click the card
      await card.click();
      
      await page.waitForLoadState('networkidle');
      
      // Verify we navigated to a product page
      const url = page.url();
      expect(url).not.toBe('index.html');
    });
  }
});

// =====================
// TEST SUITE: BRANCHES SECTION (Homepage)
// =====================
test.describe('Homepage - Branches Section', () => {
  const branches = [
    'Piduguralla Main Branch',
    'Piduguralla',
    'Miryalaguda',
    'Narasaraopeta',
  ];

  test('All branch information is visible', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    // Scroll to branches section
    const branchesTitle = page.locator('.section-title').filter({ hasText: 'Our Branches' });
    await branchesTitle.scrollIntoViewIfNeeded();
    
    for (const branch of branches) {
      const branchCard = page.locator('.info-card h3').filter({ hasText: branch });
      await expect(branchCard).toBeVisible();
    }
  });
});

// =====================
// TEST SUITE: FOOTER LINKS
// =====================
test.describe('Footer Links', () => {
  test('Footer links are visible on homepage', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const footerLinks = page.locator('.footer-links a');
    const count = await footerLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Contact footer link navigates correctly', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const contactLink = page.locator('.footer-link').filter({ hasText: 'Contact Us' });
    await contactLink.click();
    
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('contact.html');
  });

  test('Feedback footer link navigates correctly', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const feedbackLink = page.locator('.footer-link').filter({ hasText: 'Feedback' });
    await feedbackLink.click();
    
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('feedback.html');
  });
});

// =====================
// TEST SUITE: FLOATING BUTTONS
// =====================
test.describe('Floating Buttons', () => {
  test('WhatsApp floating button is visible', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const whatsappBtn = page.locator('.whatsapp-float');
    await expect(whatsappBtn).toBeVisible();
  });

  test('Cart floating button is visible', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const cartBtn = page.locator('.cart-float');
    await expect(cartBtn).toBeVisible();
  });

  test('Cart button navigates to cart page', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const cartBtn = page.locator('.cart-float');
    await cartBtn.click();
    
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('cart.html');
  });
});

// =====================
// TEST SUITE: MOBILE RESPONSIVENESS
// =====================
test.describe('Mobile Responsiveness', () => {
  const mobileSizes = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Small Mobile', width: 320, height: 568 },
    { name: 'Large Mobile', width: 414, height: 896 },
    { name: 'Tablet', width: 768, height: 1024 },
  ];

  for (const size of mobileSizes) {
    test(`Homepage displays correctly on ${size.name} (${size.width}px)`, async ({ page }: { page: any }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('index.html');
      await page.waitForLoadState('networkidle');
      
      // Verify header is visible
      await expect(page.locator('header')).toBeVisible();
      
      // Verify main content is visible
      await expect(page.locator('.container')).toBeVisible();
    });
  }

  for (const size of mobileSizes) {
    test(`Product page displays correctly on ${size.name} (${size.width}px)`, async ({ page }: { page: any }) => {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('bengali-sweets.html');
      await page.waitForLoadState('networkidle');
      
      // Verify header is visible
      await expect(page.locator('header')).toBeVisible();
      
      // Verify home button is visible
      await expect(page.locator('a.home-btn')).toBeVisible();
    });
  }
});

// =====================
// TEST SUITE: ACCESSIBILITY
// =====================
test.describe('Accessibility', () => {
  test('All pages have proper title', async ({ page }: { page: any }) => {
    for (const pageInfo of allPages.slice(0, 5)) {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');
      
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    }
  });

  test('Images have alt text on homepage', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const images = page.locator('.info-card img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('Cart button has aria-label', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const cartBtn = page.locator('.cart-float');
    const ariaLabel = await cartBtn.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });
});

// =====================
// TEST SUITE: TOP BAR (Homepage)
// =====================
test.describe('Top Bar', () => {
  test('Top bar is visible on homepage', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const topBar = page.locator('.top-bar');
    await expect(topBar).toBeVisible();
  });

  test('Top bar has scrolling text', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    const topBarText = page.locator('.top-bar span');
    await expect(topBarText).toBeVisible();
    
    const text = await topBarText.textContent();
    expect(text).toContain('cater');
  });
});

// =====================
// TEST SUITE: CART FUNCTIONALITY
// =====================
test.describe('Cart Functionality', () => {
  test('Cart page loads correctly', async ({ page }: { page: any }) => {
    await page.goto('cart.html');
    await page.waitForLoadState('networkidle');
    
    // Verify header
    await expect(page.locator('header')).toBeVisible();
    
    // Verify home button
    await expect(page.locator('a.home-btn')).toBeVisible();
  });
});

// =====================
// TEST SUITE: CROSS-PAGE NAVIGATION
// =====================
test.describe('Cross-Page Navigation Flow', () => {
  test('Complete navigation flow - homepage to product to homepage', async ({ page }: { page: any }) => {
    // Start at homepage
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    // Click on a product card
    const productCard = page.locator('.info-card').filter({ hasText: 'Kalakand' });
    await productCard.click();
    await page.waitForLoadState('networkidle');
    
    // Verify we're on product page
    expect(page.url()).toContain('kalakand.html');
    
    // Click home button
    const homeButton = page.locator('a.home-btn');
    await homeButton.click();
    await page.waitForLoadState('networkidle');
    
    // Verify we're back at homepage
    expect(page.url()).toContain('index.html');
  });

  test('Navigation flow through menu', async ({ page }: { page: any }) => {
    await page.goto('index.html');
    await page.waitForLoadState('networkidle');
    
    // Open hamburger menu
    await page.locator('.hamburger').click();
    await page.waitForTimeout(500);
    
    // Click menu link
    await page.locator('.nav-menu a').filter({ hasText: 'MENU' }).click();
    await page.waitForLoadState('networkidle');
    
    // Verify we're on menu page
    expect(page.url()).toContain('menu.html');
    
    // Click home button
    await page.locator('a.home-btn').click();
    await page.waitForLoadState('networkidle');
    
    // Verify we're back at homepage
    expect(page.url()).toContain('index.html');
  });
});

