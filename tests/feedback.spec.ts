import { test, expect } from '@playwright/test';

test.describe('Feedback Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/feedback.html');
  });

  test('feedback form should be visible', async ({ page }) => {
    await expect(page.locator('#feedbackForm')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Share Your Feedback');
  });

  test('should fill and submit feedback form for sweets', async ({ page }) => {
    // Fill name
    await page.fill('#customerName', 'Test User');
    
    // Fill contact
    await page.fill('#contactInfo', 'test@example.com');
    
    // Select feedback type (default is sweets)
    await page.check('input[value="sweets"]');
    
    // Rate the stars - click on 4th star for each rating
    const ratingGroups = ['tasteRating', 'packRating', 'valueRating'];
    for (const rating of ratingGroups) {
      const stars = page.locator(`[data-rating="${rating}"] span`);
      await stars.nth(3).click(); // 4th star (index 3)
    }
    
    // Fill comments
    await page.fill('#comments', 'Great sweets! Loved the taste and freshness.');
    
    // Mock window.open to capture WhatsApp URL
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button[type="submit"]')
    ]);
    
    // Verify WhatsApp popup opened with correct message (accept both wa.me and api.whatsapp.com)
    await expect(popup).toHaveURL(/wa\.me|api\.whatsapp\.com/);
    await popup.close();
    
    // Verify success message shown
    await expect(page.locator('#successMessage')).toBeVisible();
    await expect(page.locator('#successMessage h2')).toContainText('Thank You');
  });

  test('should fill and submit feedback form for website', async ({ page }) => {
    // Fill name
    await page.fill('#customerName', 'Website Tester');
    
    // Select website feedback type
    await page.check('input[value="website"]');
    
    // Verify website rating group is visible
    await expect(page.locator('#websiteRatingGroup')).toBeVisible();
    
    // Rate website aspects
    const ratingGroups = ['navRating', 'infoRating', 'expRating'];
    for (const rating of ratingGroups) {
      const stars = page.locator(`[data-rating="${rating}"] span`);
      await stars.nth(4).click(); // 5th star (index 4)
    }
    
    // Fill comments
    await page.fill('#comments', 'Website is easy to navigate and looks great!');
    
    // Submit form
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button[type="submit"]')
    ]);
    
    // Verify WhatsApp popup opened with correct message (accept both wa.me and api.whatsapp.com)
    await expect(popup).toHaveURL(/wa\.me|api\.whatsapp\.com/);
    await popup.close();
  });

  test('should fill and submit feedback for service', async ({ page }) => {
    await page.fill('#customerName', 'Service Reviewer');
    await page.check('input[value="service"]');
    
    // Service type should hide product ratings
    await expect(page.locator('#productRatingGroup')).not.toBeVisible();
    await expect(page.locator('#websiteRatingGroup')).not.toBeVisible();
    
    await page.fill('#comments', 'Staff was very helpful and polite.');
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button[type="submit"]')
    ]);
    
    // Verify WhatsApp popup opened with correct message (accept both wa.me and api.whatsapp.com)
    await expect(popup).toHaveURL(/wa\.me|api\.whatsapp\.com/);
    await popup.close();
  });

  test('should handle optional fields', async ({ page }) => {
    // Submit with minimal info
    await page.check('input[value="other"]');
    await page.fill('#comments', 'General feedback about the store.');
    
    const [popup] = await Promise.all([
      page.waitForEvent('popup'),
      page.click('button[type="submit"]')
    ]);
    
    // Verify WhatsApp popup opened with correct message (accept both wa.me and api.whatsapp.com)
    await expect(popup).toHaveURL(/wa\.me|api\.whatsapp\.com/);
    await popup.close();
  });

  test('star ratings should be interactive', async ({ page }) => {
    // Select sweets type to show ratings
    await page.check('input[value="sweets"]');
    
    // Click different stars and verify they become active
    const tasteStars = page.locator('[data-rating="tasteRating"] span');
    
    // Click 3rd star
    await tasteStars.nth(2).click();
    
    // Verify first 3 stars are active
    for (let i = 0; i < 3; i++) {
      await expect(tasteStars.nth(i)).toHaveClass(/active/);
    }
    
    // Verify remaining stars are not active
    for (let i = 3; i < 5; i++) {
      await expect(tasteStars.nth(i)).not.toHaveClass(/active/);
    }
  });

  test('feedback type radio buttons should toggle rating sections', async ({ page }) => {
    // Default - sweets selected
    await expect(page.locator('#productRatingGroup')).toBeVisible();
    await expect(page.locator('#websiteRatingGroup')).not.toBeVisible();
    
    // Switch to website
    await page.check('input[value="website"]');
    await expect(page.locator('#productRatingGroup')).not.toBeVisible();
    await expect(page.locator('#websiteRatingGroup')).toBeVisible();
    
    // Switch to service
    await page.check('input[value="service"]');
    await expect(page.locator('#productRatingGroup')).not.toBeVisible();
    await expect(page.locator('#websiteRatingGroup')).not.toBeVisible();
    
    // Switch to other
    await page.check('input[value="other"]');
    await expect(page.locator('#productRatingGroup')).not.toBeVisible();
    await expect(page.locator('#websiteRatingGroup')).not.toBeVisible();
  });

  test('form should have proper accessibility attributes', async ({ page }) => {
    // Check for labels
    await expect(page.locator('label[for="customerName"]')).toBeVisible();
    await expect(page.locator('label[for="contactInfo"]')).toBeVisible();
    await expect(page.locator('label[for="comments"]')).toBeVisible();
    
    // Check radio buttons have proper labels
    const radioLabels = page.locator('.feedback-type label');
    await expect(radioLabels).toHaveCount(4);
  });
});
