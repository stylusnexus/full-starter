# AGENTS.md

**Read [SOUL.md](./SOUL.md) first** — it defines how we think, decide, and communicate as a team.

This is the project brain every tool reads from. Claude Code's `CLAUDE.md` just points here — edit this file, not that one.

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

Rules that ship with the starter. Keep them or replace them, but decide on purpose:

- **Evidence before assertions.** Every "done / works / exists / shipped" claim carries the command or `file:line` that proves it. If you can't produce one, label the claim unverified. An honest "unverified" beats a confident guess.
- **Green checks are not proof.** Run the same script CI runs (not a looser local variant) and read the result counts. Type-checks verify types; they don't verify the feature works.
- **Stop after two failed fixes.** If verification fails twice after a reasonable fix, stop and report the exact commands, the output, and your best hypothesis. Don't loop a third time.
- **Blast radius before state changes.** Before a delete, a force operation, a bulk edit, or any production change, print the exact scope and confirm the evidence supports that action.
- **When live state contradicts the docs, say so.** Report the contradiction and stop that thread. Silently reconciling the two ships a wrong assumption.

## Preferred Tools

Token economics matter on long sessions. Default to the cheapest tool that gets the job done.

### Data Fetching

1. **WebFetch**: free, text-only, works on public pages that don't block bots.
2. **agent-browser CLI**: free, local Rust CLI plus Chrome via CDP. Use this for dynamic pages or auth walls that WebFetch can't handle. Returns the accessibility tree with element refs (~80% fewer tokens than screenshot-based browsing). Install: `npm i -g agent-browser && agent-browser install`.
3. **Notice recurring fetch patterns and propose wrapping them as dedicated tools.** When the same fetch/parse logic comes up more than once, suggest wrapping it as a named tool (a skill file or a script that calls `agent-browser` with the snapshot and extraction baked in).

### PDF Files

Use `pdftotext`, not the `Read` tool. `Read` loads PDFs as images, which is far more expensive. Reserve `Read` for cases where the user explicitly asks to analyze images or charts inside the document.

### Session Hygiene

See [.claude/guidances/session-hygiene.md](./.claude/guidances/session-hygiene.md) for cache protection, the five session moves (`/compact`, `/clear`, `/rewind`, subagent, fresh start), and `/effort` dial guidance. The starter ships with `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` and `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80` set in `.claude/settings.json`. Override either if your work genuinely benefits from the 1M window. (Claude Code specific — other tools can skip this section.)

### Unattended Work & Connected Tools

Before letting an agent run without you watching each step (`/schedule`, `/loop`, event-triggered or background work), read [.claude/guidances/unattended-agents.md](./.claude/guidances/unattended-agents.md) — the seven-point guardrail for narrow jobs, limited access, and human approval on high-risk changes. For MCP/plugin connection posture (start read-only, least privilege, production last), see the **Agent tooling** section of [SECURITY.md](./SECURITY.md).

### Architectural Decisions

Before a hard-to-reverse choice (framework, data model, auth strategy, deploy target) — or right after making one — read [.claude/guidances/architectural-decisions.md](./.claude/guidances/architectural-decisions.md) for the ADR template and where records live (`docs/adr/`).

### Shared Primitives

When a defect could recur on a sibling surface, fix it with a shared primitive the sibling has to opt out of, not a patch where the bug happened to be reported. See [.claude/guidances/shared-primitives.md](./.claude/guidances/shared-primitives.md).

## Common Gotchas

Give each gotcha a name, a one-line rule, and a date. A named failure can be cited in review; an unnamed one gets forgotten. Every entry should come from a real mistake that happened, ideally more than once.

Prune as you go. Cut an entry when the failure has become structurally impossible (a shared primitive now covers it) or when a later correction fully supersedes it. Move a pruned entry to a memory note instead of deleting it, so the incident stays findable without loading into every session.

<!-- Format: - **The Name.** What happened. → *The rule that prevents it.* (YYYY-MM-DD) -->
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
<!-- - Domain guidances: .claude/guidances/ (loaded automatically by hooks in Claude Code; read directly in other tools) -->
