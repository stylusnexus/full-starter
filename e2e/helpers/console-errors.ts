import type { Page } from '@playwright/test';

const IGNORED_PATTERNS = [
  'ResizeObserver loop',
  'Download the React DevTools',
  '[Fast Refresh]',
];

export function captureConsoleErrors(page: Page): () => string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      const isIgnored = IGNORED_PATTERNS.some((p) => text.includes(p));
      if (!isIgnored) {
        errors.push(text);
      }
    }
  });
  return () => [...errors];
}

export function assertNoConsoleErrors(errors: string[]): void {
  if (errors.length > 0) {
    throw new Error(
      `Console errors detected (${errors.length}):\n` +
      errors.map((e) => `  - ${e}`).join('\n')
    );
  }
}
