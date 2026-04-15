import { test, expect } from '@playwright/test';
import { captureConsoleErrors } from '../helpers/console-errors';

test.describe('@smoke Core Routes', () => {
  test('home page loads', async ({ page }) => {
    const getErrors = captureConsoleErrors(page);
    await page.goto('/');
    await expect(page.locator('body')).not.toBeEmpty();
    expect(getErrors()).toHaveLength(0);
  });

  test('login page loads', async ({ page }) => {
    const getErrors = captureConsoleErrors(page);
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    expect(getErrors()).toHaveLength(0);
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('nav a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });
});
