import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const authDir = path.join(__dirname, '.playwright-auth');
const authFile = path.join(authDir, 'user.json');

if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}
if (!fs.existsSync(authFile)) {
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
    { name: 'setup', testMatch: /auth\.setup\.ts/, teardown: undefined },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
});
