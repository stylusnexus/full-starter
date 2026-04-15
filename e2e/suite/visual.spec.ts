import { test, expect } from '@playwright/test';
import { mockProfile } from '../mocks/profile-mock';

test.describe('@visual Visual Regression', () => {
  test('home page matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('login page matches baseline', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('dashboard matches baseline (premium tier)', async ({ page }) => {
    await mockProfile(page, 'premium');
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('dashboard-premium.png', {
      maxDiffPixelRatio: 0.01,
    });
  });

  test('dashboard matches baseline (free tier)', async ({ page }) => {
    await mockProfile(page, 'free');
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('dashboard-free.png', {
      maxDiffPixelRatio: 0.01,
    });
  });
});
