import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Ensure the .playwright-auth directory and placeholder file exist before
// tests run — this prevents "ENOENT: no such file or directory" errors when
// Playwright validates the storageState path at initialization time.
const authDir = path.join(__dirname, '.playwright-auth');
const authFile = path.join(authDir, 'user.json');

if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}
if (!fs.existsSync(authFile)) {
  // Empty placeholder state — overwritten by auth.setup.ts on the real run.
  fs.writeFileSync(authFile, JSON.stringify({ cookies: [], origins: [] }));
}

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    storageState: '.playwright-auth/user.json',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      teardown: undefined,
      // Don't load a possibly-stale storageState while the setup project is
      // the one creating it — it should always start from a clean context.
      use: { storageState: undefined },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],

  // Auto-starts your dev server for local runs; in CI, point BASE_URL at an
  // already-running deployment instead and this is skipped via reuseExistingServer.
  webServer: {
    command: 'npm run dev',
    url: process.env.BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      ...(process.env.E2E_BYPASS_AUTH ? { E2E_BYPASS_AUTH: process.env.E2E_BYPASS_AUTH } : {}),
    },
  },
});
