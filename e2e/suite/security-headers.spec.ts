import { test, expect } from '@playwright/test';
import { appContract } from '../app-contract';

/**
 * @smoke @security-headers Production security-headers baseline
 *
 * Verifies the security headers your app's config (e.g. next.config.ts's
 * headers(), or equivalent middleware) is supposed to add are actually
 * present at the HTTP level, on a page route AND an API route — declaring
 * the headers only proves intent; this is what the browser actually gets.
 *
 * The expected headers and the routes live in e2e/app-contract.ts.
 */

function assertHeaders(headers: Record<string, string>) {
  for (const [name, expected] of Object.entries(appContract.securityHeaders ?? {})) {
    expect(headers[name], `header ${name}`).toBe(expected);
  }
}

test.describe('@smoke @security-headers', () => {
  test.skip(appContract.securityHeaders === null, 'app-contract: securityHeaders is null');

  test('home page response carries the security-headers baseline', async ({ request }) => {
    // maxRedirects: 0 — following redirects (the default) would assert on
    // whatever final page the browser lands on, which could be a DIFFERENT
    // response (e.g. an auth redirect from middleware) than the one actually
    // requested, and would silently miss a redirect hop that itself carries
    // no headers.
    const response = await request.get(appContract.homePath, { maxRedirects: 0 });
    expect(response.status(), 'expected a real response, not a client/server error').toBeLessThan(400);
    assertHeaders(response.headers());
  });

  test('an API route response carries the security-headers baseline', async ({ request }) => {
    test.skip(appContract.healthPath === null, 'app-contract: healthPath is null (no health route)');
    const response = await request.get(appContract.healthPath as string, { maxRedirects: 0 });
    // A health-check route legitimately returns 503 when the service reports
    // itself degraded — headers must still be present either way.
    expect([200, 503]).toContain(response.status());
    assertHeaders(response.headers());
  });
});
