// Playwright config scoped to the tests workspace
// Unit tests load local HTML files directly without a web server.
// For future ITA/E2E, you can add a webServer here.
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: '.',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list']],
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
    // Base URL unused for file:// tests; reserved for future server tests.
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
};

export default config;
