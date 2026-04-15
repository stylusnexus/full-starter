/**
 * Profile and tier mocking for E2E tests.
 *
 * Simplified pattern: inline tier configs instead of per-tier fixture files.
 */

import type { Page } from '@playwright/test';

export type Tier = 'free' | 'premium' | 'trial';

interface ProfileOverrides {
  generationsUsed?: number;
  generationLimit?: number;
  email?: string;
  name?: string;
}

const TIER_DEFAULTS: Record<Tier, { generationLimit: number; features: string[] }> = {
  free: {
    generationLimit: 10,
    features: ['basic-generation'],
  },
  premium: {
    generationLimit: 500,
    features: ['basic-generation', 'advanced-generation', 'export', 'history'],
  },
  trial: {
    generationLimit: 40,
    features: ['basic-generation', 'advanced-generation', 'export', 'history'],
  },
};

function buildProfile(tier: Tier, overrides?: ProfileOverrides) {
  const defaults = TIER_DEFAULTS[tier];
  return {
    id: 'test-user-001',
    email: overrides?.email ?? 'test@example.com',
    name: overrides?.name ?? 'Test User',
    tier,
    generationsUsed: overrides?.generationsUsed ?? 0,
    generationLimit: overrides?.generationLimit ?? defaults.generationLimit,
    features: defaults.features,
    createdAt: '2026-01-01T00:00:00Z',
  };
}

/**
 * Mock the profile/user API to return a specific tier.
 * Call BEFORE page.goto() so the mock is registered before the app fetches profile data.
 */
export async function mockProfile(
  page: Page,
  tier: Tier,
  overrides?: ProfileOverrides,
): Promise<void> {
  const profile = buildProfile(tier, overrides);

  await page.route('**/api/user/profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(profile),
    });
  });
}

/**
 * Mock a user who has exhausted their generation quota.
 */
export async function mockQuotaExhausted(
  page: Page,
  tier: Tier = 'free',
): Promise<void> {
  const limit = TIER_DEFAULTS[tier].generationLimit;
  await mockProfile(page, tier, {
    generationsUsed: limit,
    generationLimit: limit,
  });
}
