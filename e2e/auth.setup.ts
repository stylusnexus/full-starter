/**
 * Authentication setup for E2E tests.
 *
 * Two modes:
 * 1. Bypass mode (E2E_BYPASS_AUTH=1): Skip real auth, navigate directly
 * 2. Real auth: Log in with test credentials, save session state
 */

import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authDir = path.join(__dirname, '../.playwright-auth');
const authFile = path.join(authDir, 'user.json');

if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir, { recursive: true });
}

setup('authenticate', async ({ page }) => {
  const bypassAuth = process.env.E2E_BYPASS_AUTH === '1';

  if (bypassAuth) {
    console.log('[Auth] Bypass mode — skipping authentication');
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.context().storageState({ path: authFile });
    return;
  }

  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'TEST_EMAIL and TEST_PASSWORD must be set for real auth mode.\n' +
      'Set E2E_BYPASS_AUTH=1 to bypass authentication instead.'
    );
  }

  console.log('[Auth] Logging in with test credentials...');
  await page.goto('/login');
  await page.waitForLoadState('domcontentloaded');

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();

  await page.waitForURL(/\/(dashboard|home|app)/, { timeout: 10000 });
  console.log('[Auth] Login successful');

  await page.context().storageState({ path: authFile });
});
