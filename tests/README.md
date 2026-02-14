# Balaji Sweets Website - Automation Testing Framework

This directory contains the Playwright-based automation testing framework for the Balaji Sweets website.

## Test Structure

```
tests/
├── home-button.spec.ts      # Home button tests across all pages
├── index-page.spec.ts       # Index page specific tests
├── cross-browser.spec.ts    # Cross-browser compatibility tests
└── README.md               # This file
```

## Test Categories

### 1. Home Button Tests (`home-button.spec.ts`)
- **Visual Tests**: Verify button styling on all 19 pages
- **Hover Effects**: Test button hover animations
- **Navigation**: Verify button click navigates to index.html
- **Mobile Responsiveness**: Test on mobile viewports

### 2. Index Page Tests (`index-page.spec.ts`)
- **Spacing Tests**: Verify reduced margin-top on "Flavours for Every Moment"
- **Layout Tests**: Check main sections visibility
- **Mobile Tests**: Responsive layout verification

### 3. Cross-Browser Tests (`cross-browser.spec.ts`)
- **Visual Consistency**: Screenshot comparison across browsers
- **CSS Consistency**: Verify computed styles match expected values

## Running Tests

### Install Dependencies
```bash
npm install
npx playwright install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npx playwright test home-button.spec.ts
```

### Run in UI Mode (for debugging)
```bash
npm run test:ui
```

### Run in Headed Mode (see browser)
```bash
npm run test:headed
```

### Run on Specific Browser
```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Run Mobile Tests
```bash
npm run test:mobile
```

### View Test Report
```bash
npm run report
```

## Test Configuration

Tests are configured in `playwright.config.ts`:
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5, iPhone 12, iPad
- **Screenshots**: On failure
- **Videos**: On first retry
- **Tracing**: On first retry

## Writing New Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test('test description', async ({ page }) => {
  await page.goto('/page.html');
  await page.waitForLoadState('networkidle');
  
  // Your test code here
  const element = page.locator('.selector');
  await expect(element).toBeVisible();
});
```

### Test Best Practices
1. Always use `waitForLoadState('networkidle')` after navigation
2. Use semantic locators (prefer text or role over CSS selectors)
3. Add meaningful test descriptions
4. Group related tests with `test.describe()`
5. Use page objects for repeated elements

## Continuous Integration

Tests can be run in CI/CD pipelines. The framework supports:
- Parallel execution control via `workers` config
- Retry logic for flaky tests
- JSON and HTML reporting
- Screenshot and video capture on failures

## Troubleshooting

### Common Issues

**Tests failing due to timing:**
- Increase `actionTimeout` in config
- Add explicit waits with `page.waitForTimeout()`

**Screenshots not matching:**
- Update baselines with `npx playwright test --update-snapshots`
- Check for dynamic content (dates, random elements)

**Mobile tests failing:**
- Verify viewport settings
- Check for touch-specific event handlers

## Maintenance

### Updating Test Baselines
When UI changes intentionally:
```bash
npx playwright test --update-snapshots
```

### Debugging Tests
```bash
npx playwright test --debug
```

### Test Coverage
Current coverage includes:
- ✅ 19 product pages (Home button tests)
- ✅ Index page (spacing and layout)
- ✅ Cross-browser compatibility
- ✅ Mobile responsiveness

## Contact

For questions or issues with the testing framework, please contact the development team.
