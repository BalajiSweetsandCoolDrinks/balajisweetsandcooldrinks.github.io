import { test, expect } from '@playwright/test';

/**
 * Load Test: Place 100 random orders from the menu and checkout via WhatsApp
 * This test simulates user behavior by randomly selecting products,
 * choosing random sizes and quantities, adding them to cart, and completing checkout.
 */

const products = [
  { name: 'MOTICHOOR LADOO', price: 200, image: 'images/motichoor-ladoo.jpg', category: 'ladoo' },
  { name: 'KAJU KATLI', price: 500, image: 'images/kaju-variety.jpg', category: 'kaju' },
  { name: 'ASSORTED SWEETS', price: 300, image: 'images/indian-sweets.jpg', category: 'assorted' }
];

const sizes = [
  { weight: 0.25, label: '250 Gms' },
  { weight: 0.5, label: '500 Gms' },
  { weight: 1.0, label: '1 kg' }
];

// Customer data for checkout
const customerNames = [
  'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh',
  'Anita Desai', 'Rajesh Gupta', 'Meera Iyer', 'Suresh Nair', 'Lakshmi Rao'
];

const addresses = [
  '123 Main Road, Hyderabad', '45 Park Street, Bangalore', '78 Gandhi Nagar, Chennai',
  '12 Temple Lane, Mumbai', '89 Market Road, Delhi', '34 Lotus Colony, Pune'
];

test('Load Test: Place 100 random orders from menu and checkout', async ({ page, context }) => {
  // Navigate to menu page
  await page.goto('menu.html');
  
  // Wait for page to load
  await page.waitForSelector('.menu-grid', { timeout: 10000 });
  
  console.log('Starting load test: Placing 100 random orders with checkout...');
  
  let successCount = 0;
  let failCount = 0;
  let checkoutCount = 0;
  
  for (let i = 0; i < 100; i++) {
    try {
      // Randomly select a product
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      
      // Randomly select size
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      
      // Random quantity between 1 and 5
      const randomQty = Math.floor(Math.random() * 5) + 1;
      
      console.log(`Order ${i + 1}/100: ${randomProduct.name}, ${randomSize.label}, Qty: ${randomQty}`);
      
      // Click on the product to open modal
      const productCard = page.locator('.menu-item', { hasText: randomProduct.name }).first();
      await productCard.click();
      
      // Wait for modal to open
      await page.waitForSelector('#modalOverlay', { state: 'visible', timeout: 5000 });
      
      // Select size
      const sizeButtons = page.locator('.size-btn');
      const sizeIndex = sizes.findIndex(s => s.weight === randomSize.weight);
      await sizeButtons.nth(sizeIndex).click();
      
      // Set quantity
      const qtyDisplay = page.locator('#qtyVal');
      let currentQty = parseInt(await qtyDisplay.textContent() || '1');
      
      // Adjust quantity using +/- buttons
      const minusBtn = page.locator('.qty-btn').first();
      const plusBtn = page.locator('.qty-btn').last();
      
      // Reset to 1 first
      while (currentQty > 1) {
        await minusBtn.click();
        currentQty = parseInt(await qtyDisplay.textContent() || '1');
      }
      
      // Add to reach desired quantity
      for (let q = 1; q < randomQty; q++) {
        await plusBtn.click();
      }
      
      // Click Add to Cart
      await page.locator('.add-btn').click();
      
      // Wait for toast notification
      await page.waitForSelector('#toast', { state: 'visible', timeout: 5000 });
      
      // Wait for modal to close
      await page.waitForSelector('#modalOverlay', { state: 'hidden', timeout: 5000 });
      
      successCount++;
      
      // Every 10 orders, do a checkout
      if (successCount % 10 === 0) {
        console.log(`  -> Checking out order batch ${successCount / 10}...`);
        
        // Navigate to cart
        await page.goto('cart.html');
        await page.waitForLoadState('networkidle');
        
        // Wait for cart to render
        await page.waitForTimeout(500);
        
        // Check if cart has items
        const cartItems = await page.locator('.cart-item').count();
        if (cartItems > 0) {
          // Click checkout button
          await page.locator('.checkout-btn').click();
          
          // Wait for checkout modal
          await page.waitForSelector('#checkoutModal.active', { timeout: 5000 });
          
          // Fill in customer details
          const randomName = customerNames[Math.floor(Math.random() * customerNames.length)];
          const randomAddr = addresses[Math.floor(Math.random() * addresses.length)];
          
          await page.fill('#custName', randomName);
          await page.fill('#custAddr', randomAddr);
          
          // Intercept WhatsApp popup
          const [whatsappPage] = await Promise.all([
            context.waitForEvent('page', { timeout: 10000 }),
            page.locator('#confirmBtn').click()
          ]);
          
          // Verify WhatsApp URL (accepts both wa.me and api.whatsapp.com formats)
          await whatsappPage.waitForLoadState('domcontentloaded');
          const whatsappUrl = whatsappPage.url();
          expect(whatsappUrl).toMatch(/(wa\.me|api\.whatsapp\.com)/);
          expect(whatsappUrl).toContain('phone=919962899084');
          expect(whatsappUrl).toContain('text=');
          
          console.log(`  -> WhatsApp checkout opened: ${whatsappUrl.substring(0, 60)}...`);
          
          // Verify cart was cleared
          await page.waitForTimeout(500);
          const emptyCart = await page.locator('.cart-empty').isVisible().catch(() => false);
          console.log(`  -> Cart cleared: ${emptyCart}`);
          
          checkoutCount++;
        }
        
        // Go back to menu for next batch
        await page.goto('menu.html');
        await page.waitForSelector('.menu-grid', { timeout: 10000 });
      }
      
      // Small delay to simulate realistic user behavior
      await page.waitForTimeout(100);
      
    } catch (error) {
      console.error(`Failed to place order ${i + 1}:`, error);
      failCount++;
      
      // Try to close modal if it's still open
      try {
        const modal = page.locator('#modalOverlay');
        if (await modal.isVisible()) {
          await page.locator('#closeModal').click();
          await modal.waitFor({ state: 'hidden', timeout: 3000 });
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }
  
  console.log(`\nLoad Test Complete:`);
  console.log(`Successful orders added: ${successCount}`);
  console.log(`Checkouts completed: ${checkoutCount}`);
  console.log(`Failed orders: ${failCount}`);
  
  // Expect at least 90% success rate
  expect(successCount).toBeGreaterThanOrEqual(90);
  expect(checkoutCount).toBeGreaterThanOrEqual(9); // At least 9 checkouts (every 10 orders)
  
  // Take final screenshot
  await page.screenshot({ path: 'test-results/load-test-final.png', fullPage: true });
});
