# 🧪 Balaji Sweets Website - Automation Testing Framework

A comprehensive Playwright-based automation testing framework for the Balaji Sweets website.

## 📋 Overview

This framework provides automated end-to-end testing for:
- ✅ Home button styling and functionality across all 19 product pages
- ✅ Index page layout and spacing verification
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)
- ✅ Mobile responsiveness testing
- ✅ Visual regression testing

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Run the setup script
./setup-tests.sh

# Or manually:
npm install
npx playwright install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run with UI for debugging
npm run test:ui

# Run specific browser
npm run test:chrome
npm run test:firefox

# Run mobile tests
npm run test:mobile
```

### 3. View Results

```bash
# Open HTML report
npm run report
```

## 📁 Framework Structure

```
BalajiSweetsandCoolDrinks.github.io/
├── tests/
│   ├── home-button.spec.ts      # Home button tests (19 pages)
│   ├── index-page.spec.ts       # Index page specific tests
│   ├── cross-browser.spec.ts    # Cross-browser compatibility
│   └── README.md                # Test documentation
├── .github/
│   └── workflows/
│       └── playwright.yml       # CI/CD pipeline
├── package.json                 # Dependencies & scripts
├── playwright.config.ts         # Playwright configuration
├── setup-tests.sh              # Setup automation script
├── test-cases.md               # Manual test cases
├── TESTING-FRAMEWORK.md        # This file
└── .gitignore                  # Git ignore rules
```

## 🎯 Test Coverage

### Home Button Tests (`home-button.spec.ts`)
| Test | Description | Pages |
|------|-------------|-------|
| Visual Styling | Verify red gradient, padding, border radius | All 19 pages |
| Hover Effects | Test translateY and shadow animations | Sample pages |
| Navigation | Verify click navigates to index.html | Sample pages |
| Mobile View | Test visibility on mobile viewport | All pages |

### Index Page Tests (`index-page.spec.ts`)
| Test | Description |
|------|-------------|
| Spacing Verification | Confirm 30px margin-top (reduced from 60px) |
| Visual Layout | Check main sections visibility |
| Mobile Responsive | Layout adjustment on mobile |

### Cross-Browser Tests (`cross-browser.spec.ts`)
| Test | Browsers |
|------|----------|
| Visual Consistency | Chrome, Firefox, Safari |
| CSS Properties | All browsers |

## 🔧 Configuration

### Playwright Settings (`playwright.config.ts`)

```typescript
// Browsers tested
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)
- Tablet Chrome (iPad)

// Features
- Screenshots on failure
- Video recording on retry
- Trace collection on retry
- Parallel execution
- HTML & JSON reporting
```

### Test Execution

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:ui` | Interactive UI mode |
| `npm run test:debug` | Debug mode |
| `npm run test:headed` | Visible browser |
| `npm run test:chrome` | Chrome only |
| `npm run test:firefox` | Firefox only |
| `npm run test:webkit` | Safari only |
| `npm run test:mobile` | Mobile devices |
| `npm run report` | View HTML report |

## 📝 Writing Tests

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('description', async ({ page }) => {
  // Navigate
  await page.goto('/page.html');
  await page.waitForLoadState('networkidle');
  
  // Interact
  const button = page.locator('a.home-btn');
  await button.hover();
  
  // Assert
  await expect(button).toHaveText('Home');
  await expect(button).toBeVisible();
});
```

### Best Practices

1. **Always wait for load state** after navigation
2. **Use semantic locators** (text, role) over CSS selectors
3. **Group related tests** with `test.describe()`
4. **Add meaningful descriptions** to tests
5. **Use page objects** for repeated elements

## 🔄 CI/CD Integration

### GitHub Actions Workflow

Automatically runs on:
- Push to `main` or `master`
- Pull requests to `main` or `master`

Features:
- Runs on Ubuntu latest
- Tests on all configured browsers
- Uploads reports as artifacts
- 60-minute timeout

### Artifact Retention

- **Playwright Report**: 30 days
- **Test Results**: 30 days (on failure)

## 📊 Test Reports

### HTML Report
```bash
npm run report
```
- Visual test results
- Screenshots
- Trace viewer
- Video recordings

### JSON Report
- Located at `test-results/test-results.json`
- Programmatic access to results
- CI/CD integration

## 🐛 Debugging

### Debug Mode
```bash
npx playwright test --debug
```

### UI Mode
```bash
npm run test:ui
```

### Update Screenshots
```bash
npx playwright test --update-snapshots
```

## 📱 Mobile Testing

### Viewports Tested
- **Mobile**: 375x667 (iPhone SE size)
- **Tablet**: 768x1024 (iPad size)
- **Desktop**: 1280x720 (default)

### Mobile-Specific Tests
- Touch event handling
- Responsive layout
- Font size readability
- Button clickability

## 🌐 Cross-Browser Testing

### Supported Browsers
| Browser | Version | Platform |
|---------|---------|----------|
| Chromium | Latest | Ubuntu |
| Firefox | Latest | Ubuntu |
| WebKit | Latest | Ubuntu |

### Visual Regression
- Screenshot comparison
- 100 pixel difference threshold
- Automatic baseline updates

## 🎓 Learning Resources

### Playwright Documentation
- [Official Docs](https://playwright.dev/)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Test Examples
See `tests/` directory for working examples:
- `home-button.spec.ts` - Element styling tests
- `index-page.spec.ts` - Layout and spacing tests
- `cross-browser.spec.ts` - Multi-browser tests

## 🔍 Troubleshooting

### Common Issues

**Tests timing out?**
```typescript
// Increase timeout in config
actionTimeout: 30000,
navigationTimeout: 60000,
```

**Screenshots not matching?**
```bash
# Update baselines
npx playwright test --update-snapshots
```

**Mobile tests failing?**
- Check viewport settings
- Verify touch events
- Check responsive CSS

### Getting Help

1. Check `tests/README.md` for detailed documentation
2. Review `test-cases.md` for manual test procedures
3. Check Playwright documentation
4. Review error messages in test output

## 📈 Future Enhancements

Potential additions to the framework:
- [ ] Performance testing (Lighthouse integration)
- [ ] Accessibility testing (axe-core)
- [ ] API testing for dynamic content
- [ ] Visual AI testing (Applitools)
- [ ] Test data management
- [ ] Environment-specific configs

## 🤝 Contributing

When adding new tests:
1. Follow existing test structure
2. Add tests to appropriate spec file
3. Update documentation
4. Run full test suite before committing
5. Update this README if needed

## 📄 License

MIT License - See LICENSE file for details

---

**Happy Testing! 🧪✨**

For questions or issues, please refer to the documentation or contact the development team.
