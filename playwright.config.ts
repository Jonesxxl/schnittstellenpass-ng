import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests in a real browser against the production build
 * (see the README, section "End-to-end tests"). npm run e2e builds the site
 * with the test feed and runs everything; npx playwright test reuses the last build.
 */
const PORT = 4300;
const CI = !!process.env['CI'];
// Editor tests need a local Decap backend, so they only run on request: npm run e2e:cms.
// Passed on through the environment, as the test workers do not see the command line.
if (process.argv.includes('--project=cms-editor')) {
  process.env['E2E_CMS_EDITOR'] = '1';
}
const CMS_EDITOR = !!process.env['E2E_CMS_EDITOR'];

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: CI,
  // A failing test is a finding, not something to retry away
  retries: 0,
  workers: CI ? 2 : undefined,
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Optional: a Chromium that is already installed (e.g. in Claude Code on the web)
    launchOptions: { executablePath: process.env['PLAYWRIGHT_CHROMIUM_EXECUTABLE'] || undefined }
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /cms-editor/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }
    },
    {
      // Site only: the CMS is meant for desktop
      name: 'mobile',
      testIgnore: /cms/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true }
    },
    ...(CMS_EDITOR ? [{ name: 'cms-editor', testMatch: /cms-editor/, use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }] : [])
  ],
  webServer: [
    {
      command: `node e2e/serve.mjs ${PORT}`,
      url: `http://localhost:${PORT}/`,
      reuseExistingServer: !CI
    },
    ...(CMS_EDITOR ? [{ command: 'node e2e/cms-backend.mjs', port: 8081, reuseExistingServer: false, timeout: 120_000 }] : [])
  ]
});
