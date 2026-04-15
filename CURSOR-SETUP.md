# Cursor Setup

Point Cursor at this file to set up your project:

```
Read CURSOR-SETUP.md and set up my project.
```

## What This Does

This starter includes development + testing infrastructure built for Claude Code. This guide helps you adapt it for Cursor using Cursor conventions (.cursorrules, Marketplace plugins, @references).

## Setup Steps

### Step 1: Create .cursorrules

Cursor uses `.cursorrules` instead of `CLAUDE.md`. Create one at your project root:

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
[Transfer the critical rules from CLAUDE.md]

## Gotchas
[Transfer the gotchas from CLAUDE.md]

## Domain Knowledge
When working on specific areas, reference these docs:
- Auth/middleware: read `.claude/guidances/auth-security.md`
- Database/migrations: read `.claude/guidances/database-patterns.md`
- AI/prompts: read `.claude/guidances/ai-safety.md`
- Testing: read `.claude/guidances/testing-strategy.md`
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
- `e2e/auth.setup.ts` — configure for your auth system

### Step 4: Workflow Skills as Docs

Cursor doesn't have slash-command skills like Claude Code. But you can use the skill files as workflow docs:

- Tell Cursor: "Follow the process in `.claude/skills/brainstorm.md`" before creative work
- Tell Cursor: "Follow `.claude/skills/tdd.md`" for test-driven development
- Tell Cursor: "Run `./scripts/verify.sh`" before claiming work is done

The workflow discipline transfers even without the automation.

### Step 5: Use @References for Context

Where Claude Code uses hooks to auto-load context, Cursor uses @references:

- `@.claude/guidances/database-patterns.md` when working on database code
- `@.claude/guidances/ai-safety.md` when working on AI features
- `@e2e/mocks/ai-generation-mock.ts` when writing tests

### Step 6: CI Workflows

Same as other tools — update `.github/workflows/` with your build/start commands.

## Learn More

- [Shipping with Agents](https://stylusnexus.github.io/shipping-with-agents/) — development patterns (see purple adapter callouts)
- [Testing with Agents](https://stylusnexus.github.io/testing-with-agents/) — testing patterns
