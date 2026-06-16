# Next.js security drop-ins

Copy-paste templates that turn three checklist items into structural defaults for a
Next.js (App Router) project. Apply these when this starter is used for a Next.js app.

| File | Copy to | Makes structural |
|---|---|---|
| `security-headers.mjs` | merge into `next.config.mjs` | Security headers on every response |
| `middleware.ts` | project root `middleware.ts` | Headers via middleware (alt/companion) + a hook for rate limiting |
| `rate-limited-ai-route.ts` | `app/api/ai/route.ts` | Rate-limited, server-side LLM endpoint |
| `eslint-no-client-secrets.mjs` | merge into `eslint.config.mjs` | Build fails if a secret reaches client code |

After copying, verify:

```bash
# headers are live
curl -sI http://localhost:3000 | grep -i -E 'content-security|strict-transport|x-content-type|x-frame'

# secret guard trips (should error)
echo 'const k = process.env.NEXT_PUBLIC_OPENAI_API_KEY' > app/_probe.tsx && npx eslint app/_probe.tsx; rm app/_probe.tsx

# the repo-level sweep still passes
./scripts/security-scan.sh
```

## Notes

- **Headers**: you only need *one* of `next.config.mjs` headers **or** `middleware.ts`.
  Config headers are simplest; middleware is better if you also want per-request logic
  (nonce-based CSP, auth redirects, rate limiting). Don't double-set the same header.
- **CSP**: the templates ship a deliberately strict baseline that *will* break inline
  scripts/styles and third-party embeds. Loosen per real needs — don't start permissive.
- **Rate limiting**: the route uses Upstash Redis (works on serverless, where in-memory
  counters reset every cold start). For a quick local spike, the file includes a clearly
  marked in-memory fallback — do **not** ship that to multi-instance/serverless.
