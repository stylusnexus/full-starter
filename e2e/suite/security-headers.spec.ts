import { test, expect } from '@playwright/test';

/**
 * @smoke @security-headers Production security-headers baseline
 *
 * Verifies the security headers your app's config (e.g. next.config.ts's
 * headers(), or equivalent middleware) is supposed to add are actually
 * present at the HTTP level, on a page route AND an API route — declaring
 * the headers only proves intent; this is what the browser actually gets.
 *
 * Adjust REQUIRED_HEADERS to match what your app sets, and replace
 * "/api/health" with a real route.
 */

// Exact expected values, not loose shape checks — a regex like /max-age=\d+/
// or a substring check like /camera=\(\)/ would still pass with HSTS disabled
// (max-age=0) or with microphone/geolocation left wide open.
const REQUIRED_HEADERS: Record<string, string> = {
  'strict-transport-security': 'max-age=63072000; includeSubDomains',
  'x-frame-options': 'DENY',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
};

function assertHeaders(headers: Record<string, string>) {
  for (const [name, expected] of Object.entries(REQUIRED_HEADERS)) {
    expect(headers[name], `header ${name}`).toBe(expected);
  }
}

test.describe('@smoke @security-headers', () => {
  test('home page response carries the security-headers baseline', async ({ request }) => {
    // maxRedirects: 0 — following redirects (the default) would assert on
    // whatever final page the browser lands on, which could be a DIFFERENT
    // response (e.g. an auth redirect from middleware) than the one actually
    // requested, and would silently miss a redirect hop that itself carries
    // no headers.
    const response = await request.get('/', { maxRedirects: 0 });
    expect(response.status(), 'expected a real response, not a client/server error').toBeLessThan(400);
    assertHeaders(response.headers());
  });

  test('an API route response carries the security-headers baseline', async ({ request }) => {
    const response = await request.get('/api/health', { maxRedirects: 0 });
    // A health-check route legitimately returns 503 when the service reports
    // itself degraded — headers must still be present either way.
    expect([200, 503]).toContain(response.status());
    assertHeaders(response.headers());
  });
});
