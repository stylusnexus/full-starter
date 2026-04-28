# CLAUDE.md

**Read [SOUL.md](./SOUL.md) first** — it defines how we think, decide, and communicate as a team.

## Project Overview
<!-- Describe what your project does, its tech stack, and current phase -->
<!-- Example: "A Next.js SaaS that helps teams manage project timelines. Currently in MVP phase." -->

## Development Commands

```bash
# npm run dev        # Start dev server
# npm run build      # Production build
# npm run test       # Run tests
# npm run lint       # Lint code
```

<!-- Uncomment and update the commands above for your project -->

## Critical Rules

<!-- Rules that MUST be followed. Add your own: -->

<!-- - Always sanitize user input before database queries -->
<!-- - Never expose API keys or secrets client-side -->
<!-- - Run tests before committing changes to auth or payment code -->
<!-- - Use parameterized queries, never string concatenation -->

## Preferred Tools

Token economics matter on long sessions. Default to the cheapest tool that gets the job done.

### Data Fetching

1. **WebFetch**: free, text-only, works on public pages that don't block bots.
2. **agent-browser CLI**: free, local Rust CLI plus Chrome via CDP. Use this for dynamic pages or auth walls that WebFetch can't handle. Returns the accessibility tree with element refs (~80% fewer tokens than screenshot-based browsing). Install: `npm i -g agent-browser && agent-browser install`.
3. **Notice recurring fetch patterns and propose wrapping them as dedicated tools.** When the same fetch/parse logic comes up more than once, suggest wrapping it as a named tool (a skill file or a script that calls `agent-browser` with the snapshot and extraction baked in).

### PDF Files

Use `pdftotext`, not the `Read` tool. `Read` loads PDFs as images, which is far more expensive. Reserve `Read` for cases where the user explicitly asks to analyze images or charts inside the document.

### Session Hygiene

See [.claude/guidances/session-hygiene.md](./.claude/guidances/session-hygiene.md) for cache protection, the five session moves (`/compact`, `/clear`, `/rewind`, subagent, fresh start), and `/effort` dial guidance. The starter ships with `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` and `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80` set in `.claude/settings.json`. Override either if your work genuinely benefits from the 1M window.

## Common Gotchas

<!-- Bugs and patterns that keep biting. Add yours as you find them: -->

<!-- 1. Auth tokens expire after 1 hour — refresh before long operations -->
<!-- 2. The ORM doesn't auto-migrate — run migrations manually after schema changes -->
<!-- 3. Environment variable changes require a server restart -->
<!-- 4. The test database resets between runs — don't rely on seeded data -->

## Architecture Links

<!-- Pointers to deeper documentation: -->

<!-- - API docs: docs/api/ -->
<!-- - Database schema: docs/schema.md -->
<!-- - Deployment: docs/deploy.md -->
<!-- - Domain guidances: .claude/guidances/ (loaded automatically by hooks) -->
