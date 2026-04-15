import { test, expect } from '@playwright/test';
import { mockProfile, mockQuotaExhausted } from '../mocks/profile-mock';

test.describe('@regression Tier Access', () => {
  test('premium user sees premium features', async ({ page }) => {
    await mockProfile(page, 'premium');
    await page.goto('/dashboard');
    await expect(page.getByText(/export|advanced/i)).toBeVisible();
  });

  test('free user sees upgrade prompt instead of premium features', async ({ page }) => {
    await mockProfile(page, 'free');
    await page.goto('/dashboard');
    await expect(page.getByText(/upgrade|unlock/i)).toBeVisible();
  });

  test('user at quota limit sees exhaustion message', async ({ page }) => {
    await mockQuotaExhausted(page, 'free');
    await page.goto('/generate');
    await expect(page.getByText(/limit|quota|upgrade/i)).toBeVisible();
  });

  test('trial user has same access as premium', async ({ page }) => {
    await mockProfile(page, 'trial');
    await page.goto('/dashboard');
    await expect(page.getByText(/export|advanced/i)).toBeVisible();
  });
});
