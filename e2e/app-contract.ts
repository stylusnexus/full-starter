/**
 * What the smoke tests assume about YOUR app. Edit this file; leave the specs alone.
 *
 * Set an optional entry to `null` (or `false`) when your app doesn't have that
 * feature. The matching test is then skipped, with the reason in the report.
 * An entry you leave set is a promise: if the route is missing, the test fails.
 */
export const appContract = {
  /** Page that must load with a non-empty body and no console errors. */
  homePath: '/',

  /**
   * Login page. Must contain an email input. Also used by e2e/auth.setup.ts
   * in real-auth mode (email, password, and a submit button).
   * `null` = the app has no login page.
   */
  loginPath: '/login' as string | null,

  /** Where a successful real login lands. Used only by e2e/auth.setup.ts. */
  postLoginUrl: /\/(dashboard|home|app)/,

  /** Require at least one link inside a <nav> on the home page. `false` = skip. */
  checkNav: true,

  /**
   * A route that answers 200 (healthy) or 503 (degraded) and carries the
   * security headers below. `null` = the app has no such route.
   */
  healthPath: '/api/health' as string | null,

  /**
   * Exact expected response headers (lowercase names). Exact values, not
   * loose shapes: a regex like /max-age=\d+/ would still pass with HSTS
   * disabled (max-age=0). `null` = skip the security-headers tests.
   */
  securityHeaders: {
    'strict-transport-security': 'max-age=63072000; includeSubDomains',
    'x-frame-options': 'DENY',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  } as Record<string, string> | null,
};
