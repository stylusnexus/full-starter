# Codex Setup

Point Codex at this file to set up your project:

```
Read CODEX-SETUP.md and set up my project.
```

## What This Does

This starter includes development + testing infrastructure. This setup guide helps Codex adapt it to your project using Codex conventions (AGENTS.md, plugin directory, transcript persistence).

## Setup Steps

### Step 1: Create AGENTS.md

Codex uses `AGENTS.md` instead of `CLAUDE.md`. Create one at your project root with:

```markdown
# AGENTS.md

## Project Overview
[What the app does, 2 sentences]

## Tech Stack
[Framework, database, hosting]

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm test` — run smoke tests

## Rules
- [3-5 critical rules from CLAUDE.md]

## Gotchas
- [3-5 known issues from CLAUDE.md]
```

Transfer the content from `CLAUDE.md` into this format.

### Step 2: Configure Testing

The `e2e/` directory contains Playwright testing infrastructure. Adapt it:

- `e2e/mocks/ai-generation-mock.ts` — change route patterns to your API endpoints
- `e2e/mocks/profile-mock.ts` — adjust tier configs and profile API route
- `e2e/pages/sample-page.ts` — replace selectors with your UI elements
- `e2e/auth.setup.ts` — configure for your auth system or use bypass mode

### Step 3: Install Codex Plugins

Browse the Codex plugin directory for integrations:

```
# Open plugin directory
codex plugins

# Useful plugins:
# - GitHub (PR management, issues)
# - Slack (team communication)
# - Your CI/CD platform
```

### Step 4: Set Up MCP Servers

MCP servers work the same in Codex as other tools. Recommended:

- context7 — current library docs
- GitHub — PR and issue management
- Playwright — browser automation for visual testing

### Step 5: Domain Knowledge

The `.claude/guidances/` directory contains domain knowledge files. These work as reference docs in any tool — tell Codex to read the relevant file before working in a domain:

```
Before editing database code, read .claude/guidances/database-patterns.md
```

### Step 6: CI Workflows

The `.github/workflows/` directory has GitHub Actions for testing. Update:
- Uncomment build/start steps for your app
- See `.github/workflows/CI-STRATEGY.md` for tier options

## Learn More

- [Shipping with Agents](https://stylusnexus.github.io/shipping-with-agents/) — development patterns
- [Testing with Agents](https://stylusnexus.github.io/testing-with-agents/) — testing patterns
