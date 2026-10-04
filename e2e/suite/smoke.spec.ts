import { test, expect } from '@playwright/test';
import { captureConsoleErrors } from '../helpers/console-errors';
import { appContract } from '../app-contract';

// What these tests assume about your app lives in e2e/app-contract.ts.
test.describe('@smoke Core Routes', () => {
  test('home page loads', async ({ page }) => {
    const getErrors = captureConsoleErrors(page);
    await page.goto(appContract.homePath);
    await expect(page.locator('body')).not.toBeEmpty();
    expect(getErrors()).toHaveLength(0);
  });

  test('login page loads', async ({ page }) => {
    test.skip(appContract.loginPath === null, 'app-contract: loginPath is null (no login page)');
    const getErrors = captureConsoleErrors(page);
    await page.goto(appContract.loginPath as string);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    expect(getErrors()).toHaveLength(0);
  });

  test('navigation links work', async ({ page }) => {
    test.skip(!appContract.checkNav, 'app-contract: checkNav is false');
    await page.goto(appContract.homePath);
    const links = page.locator('nav a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
