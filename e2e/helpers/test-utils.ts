import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function waitForToast(
  page: Page,
  text: RegExp,
  timeout = 5000,
): Promise<void> {
  const toast = page.locator(
    '[data-sonner-toast], [role="alert"], .toast, .notification'
  );
  await expect(toast).toContainText(text, { timeout });
}

export async function takeScreenshot(
  page: Page,
  name: string,
): Promise<void> {
  await page.screenshot({
    path: `e2e/screenshots/${name}.png`,
    fullPage: true,
  });
}

export async function assertUrl(
  page: Page,
  pattern: RegExp,
): Promise<void> {
  await expect(page).toHaveURL(pattern);
}
