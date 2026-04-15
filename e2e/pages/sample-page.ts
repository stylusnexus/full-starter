import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export class GeneratorPage {
  readonly page: Page;
  readonly generateButton: Locator;
  readonly resultContainer: Locator;
  readonly errorMessage: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.generateButton = page.getByRole('button', { name: /generate/i });
    this.resultContainer = page.locator('[data-testid="generation-result"]');
    this.errorMessage = page.locator('[data-testid="generation-error"]');
    this.loadingSpinner = page.locator('[data-testid="loading"]');
  }

  async goto() {
    await this.page.goto('/generate');
    await this.page.waitForLoadState('networkidle');
  }

  async clickGenerate() {
    await expect(this.generateButton).toBeEnabled();
    await this.generateButton.click();
  }

  async waitForResult(timeout = 10000) {
    await expect(this.resultContainer).toBeVisible({ timeout });
  }

  async expectResultVisible() {
    await expect(this.resultContainer).toBeVisible();
  }

  async expectError(text?: RegExp) {
    await expect(this.errorMessage).toBeVisible();
    if (text) {
      await expect(this.errorMessage).toContainText(text);
    }
  }
}
