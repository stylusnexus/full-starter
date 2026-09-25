import type { Page } from '@playwright/test';

const IGNORED_PATTERNS = [
  'ResizeObserver loop',
  'Download the React DevTools',
  '[Fast Refresh]',
  'Non-Error promise rejection',
  'Warning: Each child in a list',
  // Bypass-auth mode (E2E_BYPASS_AUTH=1) skips real sign-in, so components
  // that independently check auth state log these on mount — expected noise.
  'AuthSessionMissingError',
  'Auth session missing',
  // A mocked error response in a negative test (see mocks/ai-generation-mock.ts's
  // mockAIRouteError) still triggers a real browser resource-error log entry.
  '401 (Unauthorized)',
  '403 (Forbidden)',
  '404 (Not Found)',
  '429 (Too Many Requests)',
  '500 (Internal Server Error)',
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
