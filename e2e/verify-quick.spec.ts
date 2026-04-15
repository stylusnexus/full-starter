import { test, expect } from '@playwright/test';

test('app loads without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.screenshot({ path: 'e2e/screenshots/verification.png', fullPage: true });

  const title = await page.title();
  expect(title).toBeTruthy();

  const body = await page.locator('body').textContent();
  expect(body).toBeTruthy();

  const realErrors = errors.filter(
    (e) => !e.includes('ResizeObserver') && !e.includes('DevTools')
  );
  expect(realErrors).toHaveLength(0);
});
