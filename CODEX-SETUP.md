# Codex Setup

Point Codex at this file to set up your project:

```
Read CODEX-SETUP.md and set up my project.
```

## What This Does

This starter includes development + testing infrastructure. This setup guide helps Codex adapt it to your project using Codex conventions (AGENTS.md, plugin directory, transcript persistence).

## Setup Steps

### Step 1: Customize AGENTS.md

Codex's native convention is `AGENTS.md`, and this starter already ships one at the
project root — `CLAUDE.md` is just a one-line pointer to it, so Codex users read the
same file Claude Code users edit. Nothing to create or transfer; fill in `AGENTS.md`
directly, and delete its "About This Template" section when you're done (it describes the
starter, not your project):

- **Project Overview** — what the app does, 2 sentences
- **Development Commands** — uncomment and adjust the `npm run dev`/`build`/`test`/`lint` block
- **Critical Rules** — uncomment 3-5 that apply, or add your own
- **Common Gotchas** — fill in as you find them

### Step 2: Configure Testing

The `e2e/` directory contains Playwright testing infrastructure. Adapt it:

- `e2e/mocks/ai-generation-mock.ts` — change route patterns to your API endpoints
- `e2e/mocks/profile-mock.ts` — adjust tier configs and profile API route
- `e2e/pages/sample-page.ts` — replace selectors with your UI elements
- `e2e/app-contract.ts` — fill it in using the "Fill in the App Contract" rules in `SETUP.md` (ask the user only whether people sign in; read the rest from the code)
- `e2e/auth.setup.ts` — configure for your auth system or use bypass mode

### Step 3: Install Skills from agent-plugins

Full Starter doesn't bundle skills as static files — this starter's workflow skills
(TDD, verify, deploy, review-and-ship, and the rest) come from the agent-plugins
marketplace, which publishes real Codex plugin manifests:

```
codex plugin marketplace add stylusnexus/agent-plugins
codex plugin add ship-pipeline@stylus-nexus       # daily verify → review → merge loop
codex plugin add hardening@stylus-nexus           # pre-launch security gates
```

Codex reads its own index at `.agents/plugins/marketplace.json` inside agent-plugins —
same marketplace, different schema from Claude Code's. Invoke installed skills the
Codex way: `@ship-pipeline` or `/skills`. See the
[agent-plugins README](https://github.com/stylusnexus/agent-plugins#install) for the
full pack list.

Also browse the Codex plugin directory for other integrations:

```
codex plugins
# Useful: GitHub (PR management, issues), Slack, your CI/CD platform
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

- [agent-plugins](https://github.com/stylusnexus/agent-plugins) — the marketplace this starter's skills come from
