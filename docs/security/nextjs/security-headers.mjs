// security-headers.mjs — merge into next.config.mjs
//
// Adds security headers to every response. Start strict, loosen per real need.
// Use EITHER this OR middleware.ts for headers — not both (avoid double-setting).

/** @type {{ key: string, value: string }[]} */
const securityHeaders = [
  // Force HTTPS for 2 years, including subdomains. Only enable once you're sure
  // every subdomain serves HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },

  // Don't let the browser MIME-sniff responses.
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Disallow being framed (clickjacking). Use CSP frame-ancestors for finer control.
  { key: 'X-Frame-Options', value: 'DENY' },

  // Don't leak full URLs to other origins.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Drop powerful features you don't use.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },

  // Content Security Policy — the strict baseline. This WILL break inline scripts,
  // inline styles, and third-party embeds until you allow them explicitly.
  // For nonce-based inline scripts, generate per-request via middleware instead.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'", // Next/Tailwind often need inline styles; tighten if you can
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'", // add your API origins (e.g. https://*.supabase.co)
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

// In next.config.mjs:
//
//   import securityHeaders from './docs/security/nextjs/security-headers.mjs'
//   const nextConfig = {
//     async headers() {
//       return [{ source: '/:path*', headers: securityHeaders }]
//     },
//   }
//   export default nextConfig

export default securityHeaders;
