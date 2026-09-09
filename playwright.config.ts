import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3099',
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      'x-test-bypass': 'true',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'PORT=3099 npm run preview',
    port: 3099,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      SKIP_ADMIN_AUTH: 'true',
    },
  },
})
