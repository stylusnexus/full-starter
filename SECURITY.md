# Security — Pre-Launch Gate

A pre-launch security pass, split the way it should be: **structural defaults** the
repo enforces for you (you can't regress them), and **judgment calls** that need a
human eye because they depend on what your app actually does.

Don't treat this as a flat checklist you re-read every launch. Lean on automation for
the first list; spend your attention on the second.

---

## Automated — enforced by this repo (verify they're wired, then forget them)

| Concern | Where it lives | How to confirm |
|---|---|---|
| Secrets in commits | `.claude/hooks/pre-commit-secrets.sh` + `security-scan` CI | `cp .claude/hooks/pre-commit-secrets.sh .git/hooks/pre-commit` |
| `.env` leaking | `.gitignore` (dotfile forms covered) + scan check | `git check-ignore .env.local` → prints the path |
| Vulnerable deps | `npm audit` in `security-scan.yml` + `security-scan.sh` | `./scripts/security-scan.sh` |
| Secrets in history | gitleaks (history-aware) in CI | Run the **Security Scan** workflow |
| Client-side key exposure | `security-scan.sh` client check | `./scripts/security-scan.sh` |

Run the whole automated sweep locally any time:

```bash
./scripts/security-scan.sh
```

> First-time setup per project: install the pre-commit hook (one line above) and, when
> ready, uncomment the `pull_request` trigger in `.github/workflows/security-scan.yml`.

### Framework-specific structural defaults

If this project is **Next.js**, copy the drop-in templates that make three more items
structural rather than remembered — security headers, a rate-limited AI route, and an
ESLint guard against client-side secrets:

```
docs/security/nextjs/     →  see its README for what to copy where
```

For other frameworks, replicate the same three ideas: response security headers,
rate limiting on any expensive (esp. LLM) endpoint, and a lint/CI guard that fails the
build if a secret-shaped value reaches client code.

---

## Judgment calls — review these by hand before launch

These can't be fully automated; they depend on your data flows and your auth logic.

- [ ] **Privacy policy** — published if you collect user data, and it reflects reality.
- [ ] **Data location known** — you can name every store (DB, object storage, analytics,
      every third-party processor) and where each lives. List them in this file.
- [ ] **Auth reviewed** — every protected route actually checks identity *and*
      authorization (not just "logged in" — can user A reach user B's data?).
- [ ] **No SQL injection** — all queries parameterized / via ORM. Audit any raw SQL.
      (React + an ORM kill most SQLi/XSS structurally; the gaps are raw SQL and
      `dangerouslySetInnerHTML` / `v-html` / unescaped templating.)
- [ ] **No XSS** — no untrusted input rendered as raw HTML.
- [ ] **API responses don't over-share** — you serialize explicit fields, not whole DB
      rows. The classic leak: returning a user object with `passwordHash`, internal
      flags, or other users' data. Read your actual response shapes.
- [ ] **Logs are clean** — no tokens, passwords, full PII, or API keys in logs. Prefer a
      logger with redaction over remembering not to log.
- [ ] **OWASP basics** — run a scanner (e.g. OWASP ZAP baseline) against a staging URL.
- [ ] **Security headers present** — confirm on a live response
      (`curl -sI https://your-app | grep -i -E 'content-security|strict-transport|x-content-type|x-frame'`).

---

## AI-specific — the layer the classic web checklist predates

If the app calls an LLM, treat these as first-class:

- [ ] **Keys are server-side only** — model API keys live in server env, never in the
      bundle or a `NEXT_PUBLIC_*` var. Calls go through a route handler / server action /
      proxy. (The scan flags `NEXT_PUBLIC_*SECRET|KEY|TOKEN`.)
- [ ] **Rate limit the model endpoint** — *before* launch, not after the bill. LLM calls
      are uniquely expensive; an open endpoint can run up four figures overnight. Limit
      per-IP/per-user, and consider a hard daily spend cap. See the Next.js drop-in.
- [ ] **Treat model output as untrusted input** — never feed it straight into SQL, a
      shell, `eval`, `dangerouslySetInnerHTML`, or an automatic tool call without
      validation. Prompt injection turns "summarize this page" into "run this."
- [ ] **Guard the system prompt & cross-user data** — assume users will try to exfiltrate
      your system prompt and other users' data through the model. Don't put secrets in
      the prompt; scope retrieval to the requesting user.
- [ ] **Bound cost & abuse** — cap max tokens/requests per user; log spend; alert on
      spikes. (OWASP LLM Top 10: LLM10 Unbounded Consumption, LLM01 Prompt Injection.)

---

## Data inventory (fill in per project)

| Data | Store | Region | Processor | Notes |
|---|---|---|---|---|
| _e.g. user accounts_ | _Postgres (Neon)_ | _us-east_ | _Neon_ | |
| | | | | |

_Keep this current — "know where user data is stored" is only true if it's written down._
