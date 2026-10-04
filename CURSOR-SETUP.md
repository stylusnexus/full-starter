# Cursor Setup

Point Cursor at this file to set up your project:

```
Read CURSOR-SETUP.md and set up my project.
```

## What This Does

This starter includes development + testing infrastructure built for Claude Code. This guide helps you adapt it for Cursor using Cursor conventions (.cursorrules, Marketplace plugins, @references).

## Setup Steps

### Step 1: Create .cursorrules

The project brain lives in `AGENTS.md` at the root (Claude Code's `CLAUDE.md` is just a
pointer to it). Cursor uses `.cursorrules` instead — create one at your project root by
transferring from `AGENTS.md` (skip its "About This Template" section; it describes the starter, not your project):

```markdown
# Project Rules

## Overview
[What the app does, 2 sentences]

## Tech Stack
[Framework, database, hosting]

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm test` — run smoke tests

## Critical Rules
[Transfer the critical rules from AGENTS.md]

## Gotchas
[Transfer the gotchas from AGENTS.md]

## Domain Knowledge
When working on specific areas, reference these docs:
- Architectural decisions: read `.claude/guidances/architectural-decisions.md`
- Database/migrations: read `.claude/guidances/database-patterns.md`
- AI/prompts: read `.claude/guidances/ai-safety.md`
- Testing: read `.claude/guidances/testing-strategy.md`
- Shared fixes (a bug that could recur elsewhere): read `.claude/guidances/shared-primitives.md`
- Long sessions: read `.claude/guidances/session-hygiene.md`
- Unattended/background runs: read `.claude/guidances/unattended-agents.md`
```

### Step 2: Install Marketplace Plugins

Browse [cursor.com/marketplace](https://cursor.com/marketplace) or use `/add-plugin`:

Recommended:
- **GitHub** — PR and issue management
- **Linear/Jira** — issue tracking (if you use them)
- **Your database provider** — Supabase, PlanetScale, Neon, etc.
- **Sentry/Datadog** — error tracking and observability

### Step 3: Configure Testing

The `e2e/` directory works with Cursor out of the box (Playwright is tool-agnostic). Adapt:

- `e2e/mocks/ai-generation-mock.ts` — change route patterns to your API endpoints
- `e2e/mocks/profile-mock.ts` — adjust tier configs and profile API route
- `e2e/pages/sample-page.ts` — replace selectors with your UI elements
- `e2e/app-contract.ts` — fill it in using the "Fill in the App Contract" rules in `SETUP.md` (ask the user only whether people sign in; read the rest from the code)
- `e2e/auth.setup.ts` — configure for your auth system

### Step 4: Install Skills from agent-plugins

Cursor doesn't have slash-command skills like Claude Code, but the
[Skills CLI](https://github.com/vercel-labs/skills) writes agent-plugins skills straight
into Cursor's own skills directory — no marketplace step, one command does both:

```bash
npx skills add stylusnexus/agent-plugins -a cursor              # choose interactively
npx skills add stylusnexus/agent-plugins -a cursor --skill '*'  # install all of them
```

That covers TDD, verify, deploy, review-and-ship, and the rest. For anything not
installed yet: "Run `./scripts/verify.sh`" before claiming work is done still applies
regardless of skill tooling.

### Step 5: Use @References for Context

Where Claude Code uses hooks to auto-load context, Cursor uses @references:

- `@.claude/guidances/database-patterns.md` when working on database code
- `@.claude/guidances/ai-safety.md` when working on AI features
- `@e2e/mocks/ai-generation-mock.ts` when writing tests

### Step 6: CI Workflows

Same as other tools — update `.github/workflows/` with your build/start commands.

## Learn More

- [agent-plugins](https://github.com/stylusnexus/agent-plugins) — the marketplace this starter's skills come from
