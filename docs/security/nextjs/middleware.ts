// middleware.ts — copy to your project root (next to app/).
//
// Alternative/companion to next.config.mjs headers. Use middleware when you also want
// per-request logic: a nonce-based CSP, auth redirects, or edge rate limiting.
// If you set headers here, REMOVE the equivalent ones from next.config.mjs.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Same baseline as security-headers.mjs — keep the two in sync if you use both files
  // for different routes.
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload',
  );

  // Example: nonce-based CSP (uncomment to allow specific inline scripts safely).
  // const nonce = crypto.randomUUID().replace(/-/g, '');
  // response.headers.set(
  //   'Content-Security-Policy',
  //   `default-src 'self'; script-src 'self' 'nonce-${nonce}'; object-src 'none'; base-uri 'self'`,
  // );
  // response.headers.set('x-nonce', nonce); // read in your root layout for <script nonce=...>

  return response;
}

// Apply to everything except static assets. Adjust as needed.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
