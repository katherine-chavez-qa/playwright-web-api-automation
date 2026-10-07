import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';
import { authFile } from './src/config/paths';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testDir: './tests/setup',
      testMatch: /.*\.setup\.ts/,
      use: { baseURL: env.webBaseUrl },
    },
    {
      name: 'web-chromium',
      testDir: './tests/web',
      dependencies: ['setup'],
      use: { ...devices['Desktop Chrome'], baseURL: env.webBaseUrl, storageState: authFile },
    },
    {
      name: 'web-firefox',
      testDir: './tests/web',
      // axe inspects the DOM, so results do not depend on the browser engine.
      testIgnore: /accessibility\.spec\.ts/,
      dependencies: ['setup'],
      use: { ...devices['Desktop Firefox'], baseURL: env.webBaseUrl, storageState: authFile },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: env.apiBaseUrl,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
