import { test, expect } from '@playwright/test';
import { mockAIRoute, mockAIRouteError } from '../mocks/ai-generation-mock';
import { captureConsoleErrors } from '../helpers/console-errors';
import { GeneratorPage } from '../pages/sample-page';

test.describe('@regression Generation with Mocks', () => {
  test('generates content with mocked AI response', async ({ page }) => {
    await mockAIRoute(page, '**/api/generate', 'sample-generation.json');
    const getErrors = captureConsoleErrors(page);

    const genPage = new GeneratorPage(page);
    await genPage.goto();
    await genPage.clickGenerate();

    await expect(page.getByText('Sample Generated Content')).toBeVisible({
      timeout: 10000,
    });

    expect(getErrors()).toHaveLength(0);
  });

  test('shows error UI when generation fails', async ({ page }) => {
    await mockAIRouteError(page, '**/api/generate', {
      status: 429,
      error: 'Rate limit exceeded',
      code: 'RATE_LIMIT',
    });

    const genPage = new GeneratorPage(page);
    await genPage.goto();
    await genPage.clickGenerate();

    await genPage.expectError(/rate limit|try again/i);
  });

  test('handles server error gracefully', async ({ page }) => {
    await mockAIRouteError(page, '**/api/generate', {
      status: 500,
      error: 'Internal server error',
    });

    const genPage = new GeneratorPage(page);
    await genPage.goto();
    await genPage.clickGenerate();

    await genPage.expectError(/error|failed/i);
  });
});
