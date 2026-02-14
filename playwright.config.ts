import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright configuration for Balaji Sweets website automation testing
 * @see https://playwright.dev/docs/test-configuration
 */

// Get the absolute path to the project directory
const projectDir = path.resolve(__dirname);

export default defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL - use absolute file path with trailing slash */
    baseURL: `file://${projectDir}/`,
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video recording */
    video: 'on-first-retry',
    
    /* Viewport size */
    viewport: { width: 1280, height: 720 },
    
    /* Action timeout */
    actionTimeout: 15000,
    
    /* Navigation timeout */
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Test against mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    /* Test against tablet */
    {
      name: 'Tablet Chrome',
      use: { ...devices['iPad (gen 7)'] },
    },
  ],
});
