# Balaji Sweets - Automation Test Suite

This comprehensive test suite covers all functionalities and features of the Balaji Sweets website using Playwright.

## Test Structure

### Test Files

1. **navigation.spec.ts** - Tests for page navigation, links, and routing
   - All pages load successfully
   - Navigation menu open/close functionality
   - Navigation links work correctly
   - Home button navigation
   - Product category card navigation
   - Footer links
   - WhatsApp and cart float buttons

2. **cart.spec.ts** - Shopping cart functionality tests
   - Empty cart state
   - Add items to cart
   - Add multiple items
   - Update item quantities (increase/decrease)
   - Remove items from cart
   - Clear entire cart
   - Cart total calculation
   - Cart persistence across pages
   - Checkout modal open/close
   - Complete checkout flow
   - Product size/weight selection

3. **feedback.spec.ts** - Feedback form tests
   - Form visibility
   - Submit feedback for sweets
   - Submit feedback for website
   - Submit feedback for service
   - Optional fields handling
   - Star rating interactivity
   - Feedback type toggling
   - Form accessibility

4. **contact.spec.ts** - Contact page tests
   - Contact information display
   - Map tabs functionality
   - Active tab styling
   - Map iframes presence
   - Back to home link
   - WhatsApp button
   - Responsive layout

5. **menu.spec.ts** - Menu page tests
   - Category buttons display
   - Category filtering
   - ALL category products
   - Coming soon categories
   - Product card clickability
   - Product modal display
   - Size selection and price updates
   - Quantity adjustment
   - Back to home link

6. **responsive.spec.ts** - Responsive design tests
   - Homepage rendering on different viewports
   - Navigation menu on mobile
   - Product grid column adaptation
   - Cart page responsiveness
   - Contact page maps responsiveness
   - Mobile feedback form usability
   - Category bar scrolling
   - Text readability

7. **accessibility.spec.ts** - Accessibility tests
   - Heading structure
   - Image alt text
   - Focusable interactive elements
   - Form input labels
   - Keyboard navigation
   - Color contrast
   - ARIA attributes
   - Language attribute
   - Landmark regions
   - Modal focus trapping

8. **performance.spec.ts** - Performance tests
   - Page load times
   - All pages load efficiently
   - Image loading
   - Cart operation speed
   - Navigation responsiveness
   - Console error detection
   - localStorage operation speed

9. **e2e.spec.ts** - End-to-end user journey tests
   - Complete purchase flow
   - Browse multiple categories
   - Feedback submission flow
   - Contact page exploration
   - Cart management flow
   - Mobile navigation flow

## Running Tests

### Prerequisites
```bash
npm install
npx playwright install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Navigation tests only
npx playwright test tests/navigation.spec.ts

# Cart tests only
npx playwright test tests/cart.spec.ts

# End-to-end tests
npx playwright test tests/e2e.spec.ts
```

### Run on Specific Browsers
```bash
# Chrome only
npm run test:chrome

# Firefox only
npm run test:firefox

# Safari only
npm run test:webkit

# Mobile browsers
npm run test:mobile
```

### Debug Mode
```bash
# Run with UI mode
npm run test:ui

# Run in headed mode (visible browser)
npm run test:headed

# Debug specific test
npx playwright test --debug
```

### View Reports
```bash
npm run test:report
```

## Test Configuration

Tests are configured in `playwright.config.ts` with:
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile device testing (Pixel 5, iPhone 12)
- Screenshot capture on failure
- Video recording on failure
- Trace collection for debugging
- Automatic local server startup

## Coverage Summary

### Features Tested
- ✅ All 20+ pages load correctly
- ✅ Navigation (hamburger menu, links, buttons)
- ✅ Shopping cart (add, update, remove, checkout)
- ✅ Product catalog and categories
- ✅ Feedback form with ratings
- ✅ Contact page with maps
- ✅ WhatsApp integration
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Accessibility (keyboard, ARIA, contrast)
- ✅ Performance (load times, operations)

### Browsers Tested
- ✅ Chromium (Chrome)
- ✅ Firefox
- ✅ WebKit (Safari)
- ✅ Mobile Chrome
- ✅ Mobile Safari

## Continuous Integration

To run tests in CI/CD:
```bash
CI=true npm test
```

This will:
- Run tests in headless mode
- Retry failed tests twice
- Use single worker for stability
- Generate HTML report

## Writing New Tests

When adding new tests:
1. Create a new `.spec.ts` file in the `tests/` directory
2. Import `{ test, expect } from '@playwright/test'`
3. Use descriptive test names
4. Group related tests with `test.describe()`
5. Use `test.beforeEach()` for common setup
6. Add assertions with `expect()`
7. Run tests locally before committing

## Troubleshooting

### Tests failing locally?
- Ensure the local server can start on port 8080
- Check that all HTML files are present
- Run `npx playwright install` to update browsers

### Screenshots not matching?
- Update snapshots: `npm run test:update-snapshots`
- Check for CSS changes that might affect layout

### Tests timing out?
- Increase timeout in `playwright.config.ts`
- Check network connectivity
- Verify local server is running
