/**
 * AI route interceptor for E2E tests.
 *
 * Simplified pattern: you specify the route and fixture file.
 * No type registry — works with any API endpoint.
 */

import type { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const FIXTURE_DIR = path.resolve(__dirname, '../fixtures/ai-responses');

const fixtureCache = new Map<string, string>();

function loadFixture(filename: string): string {
  if (fixtureCache.has(filename)) {
    return fixtureCache.get(filename)!;
  }

  const filePath = path.join(FIXTURE_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `[ai-mock] No fixture found at ${filePath}. ` +
      `Available fixtures: ${fs.readdirSync(FIXTURE_DIR).join(', ')}`
    );
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  fixtureCache.set(filename, data);
  return data;
}

/**
 * Intercept a route and return fixture data instead of hitting the real API.
 * Only intercepts POST requests — GET requests pass through.
 */
export async function mockAIRoute(
  page: Page,
  routePattern: string,
  fixtureFile: string,
): Promise<void> {
  const fixture = loadFixture(fixtureFile);

  await page.route(routePattern, async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: fixture,
    });
  });
}

/**
 * Intercept a route and return an error response.
 */
export async function mockAIRouteError(
  page: Page,
  routePattern: string,
  options?: { status?: number; error?: string; code?: string },
): Promise<void> {
  await page.route(routePattern, async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: options?.status ?? 500,
      contentType: 'application/json',
      body: JSON.stringify({
        error: options?.error ?? 'Generation failed',
        code: options?.code ?? 'GENERATION_ERROR',
      }),
    });
  });
}

/**
 * Intercept multiple routes at once.
 */
export async function mockMultipleAIRoutes(
  page: Page,
  mocks: Array<{ route: string; fixture: string }>,
): Promise<void> {
  for (const { route, fixture } of mocks) {
    await mockAIRoute(page, route, fixture);
  }
}
