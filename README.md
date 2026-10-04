# Full Starter

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude_Code-compatible-6B46C1)](CLAUDE-SETUP.md)
[![Codex](https://img.shields.io/badge/Codex-compatible-10A37F)](CODEX-SETUP.md)
[![Cursor](https://img.shields.io/badge/Cursor-compatible-000000)](CURSOR-SETUP.md)

A ready-to-fork project template for building software with an AI coding assistant such as Claude Code, Codex, or Cursor. It gives the assistant written rules to follow, specialist helper agents, automatic safety checks, and a test setup, so its work comes back checked instead of only claimed done.

Fork it, tell your assistant to set it up, and it asks a few questions and fits the template to your project.

By [Stylus Nexus](https://github.com/stylusnexus).

## What This Is For

**Use it when** an AI assistant does a lot of the work on your project and you want it to follow your rules, run its own checks, and stop before claiming "done" without proof.

| You are... | Use it to... |
|---|---|
| Starting a new web app or API in Node/TypeScript | Begin with the rules, checks, and tests already in place |
| Adding structure to a project you already have | Let the setup runbook scan your project and fill in the rules |
| A small team sharing one AI workflow | Keep everyone's assistant on the same written rules (`AGENTS.md`) |

## What This Is NOT For

- **Not an app, framework, or library.** There's no product code in it.
- **Not a replacement for human review.** The hooks and checks catch common mistakes. They don't prove code is correct or safe. The security scan is a report-only baseline, and the checklist in `SECURITY.md` still needs a person.
- **Not a compliance guarantee.** Setup asks about legal and privacy limits and writes them into `AGENTS.md`. Enforcing them is up to you.
- **Not built for non-web or non-Node projects as it stands.** The tests drive a web app over HTTP, and the hooks use `npm` and `jq`. The setup runbook recognizes Python, Rust, and Go projects, but we haven't tested it on them.
- **Not a managed service.** Your fork is yours. Updates from us don't arrive on their own, so you pull them in yourself.

**How it fits with our other repos:**
- [startup-plan](https://github.com/stylusnexus/startup-plan) explains the workflow in words. Read it first if you want the why.
- This repo (`full-starter`) is the template you fork to get that workflow set up.
- [agent-plugins](https://github.com/stylusnexus/agent-plugins) holds the skills (review, ship, harden) you install into any project, this one included.

## Prerequisites

| Tool | Why | Get it |
|---|---|---|
| **Node** (version in `.nvmrc`) | Runs everything — tests, hooks, scripts | nvm, fnm, volta, or your OS's installer |
| **npm** | Ships with Node | — |
| **git** | You're forking a repo | your OS's installer |
| **jq** | 4 hooks parse tool-call JSON with it (`domain-context-loader.sh` and others) | `apt install jq` / `brew install jq` / `choco install jq` / `scoop install jq` |

Optional: **gitleaks**, for `scripts/security-scan.sh`'s local secret scan — falls back to a
grep-based check if it isn't installed. CI installs its own copy either way.

## Get Started in 5 Minutes

1. **Fork and install.** Fork `stylusnexus/full-starter` on GitHub, clone your fork, and run `npm install`. You need Node (the version in `.nvmrc`) and `jq`.
2. **Open the clone in your AI tool** (Claude Code, Codex, Cursor, or another).
3. **Paste the one-line command for your tool** from the table below.
4. **Answer the questions it asks.** "Not sure" is a fine answer. It writes your `AGENTS.md` and fills in `e2e/app-contract.ts`.
5. **Run `./scripts/verify.sh`.** Until your app has a `dev` script, expect `1 passed, 1 skipped`. The first browser test run also needs `npx playwright install chromium`.

## Quick Start

Pick your AI coding tool and point it at the setup file:

| Tool | Command |
|------|---------|
| **Claude Code** | `Read CLAUDE-SETUP.md and set up my project.` |
| **Codex** | `Read CODEX-SETUP.md and set up my project.` |
| **Cursor** | `Read CURSOR-SETUP.md and set up my project.` |
| **Other tools** | `Read SETUP.md and set up my project.` |

Each setup doc walks your AI assistant through scanning your codebase and customizing the starter for your project.

## What's Inside

### Development Infrastructure

- **AGENTS.md** — project brain with rules, commands, and gotchas, read by every tool (`CLAUDE.md` is a one-line pointer to it)
- **Guidances** — on-demand domain knowledge (AI safety, architectural decisions, database patterns, session hygiene, shared primitives, testing strategy, unattended agents)
- **2 agents** — backend-engineer, technical-writer (plus 2 example templates to copy and rename)
- **Agent memory** — empty scaffold directories per agent role, ready to fill in as you work
- **13 hooks** — domain context loader, instrumentation check, test coverage advisory, require-tests guard, pre-commit secrets scan, pre-commit verify, session start, cleanup-logs, notify + notify-long-task, lockfile-integrity-check, suggest-commit-commands, db-truth-reminder

### Testing Infrastructure

- **Playwright E2E** — config, auth bypass, page objects, test suite; the smoke tests read their routes and expected headers from `e2e/app-contract.ts`, so you edit one file to fit your app
- **AI mock fixtures** — route interception with JSON fixture files
- **Profile mocking** — tier impersonation without real accounts
- **Visual verification** — screenshot baseline comparison
- **Verify loop** — build + test + lint pre-completion script
- **Experiment-as-test** — quality regression detection with baselines
- **3 CI workflows** — smoke (PR), regression (nightly), visual (UI changes)
- **3 opt-in workflows** — lockfile integrity, commit lint, release-please (see `CI-STRATEGY.md`)
- **1 agent** — test-reviewer (coverage gap analysis)

### Multi-Tool Setup Docs

- `CLAUDE-SETUP.md` — Claude Code specific setup (marketplace, hooks, agents)
- `CODEX-SETUP.md` — OpenAI Codex setup (AGENTS.md, marketplace, MCP)
- `CURSOR-SETUP.md` — Cursor setup (.cursorrules, marketplace, @references)
- `SETUP.md` — Tool-agnostic automated setup runbook

## Skills

Full Starter doesn't bundle a fixed skill set anymore — a copied skill goes stale the
moment its source updates. Instead, pull skills live from the
[stylusnexus/agent-plugins](https://github.com/stylusnexus/agent-plugins) marketplace:

```
# Claude Code
/plugin marketplace add stylusnexus/agent-plugins
/plugin install ship-pipeline@stylus-nexus        # or hardening, reporting-comms, etc.

# Codex
codex plugin marketplace add stylusnexus/agent-plugins
codex plugin add ship-pipeline@stylus-nexus

# Everything else (Cursor, Copilot, Windsurf, Zed, ~60 more)
npx skills add stylusnexus/agent-plugins
```

See the [agent-plugins README](https://github.com/stylusnexus/agent-plugins#install) for the full pack list.

### Skills we like

Not from agent-plugins, but in daily rotation on Stylus Nexus projects — install via
`/plugin install <name>@<marketplace>`. Top pick: **superpowers**
(`/plugin install superpowers@claude-plugins-official`) — brainstorming, TDD,
systematic debugging, plan-then-execute. We love this one.

| Skill | Marketplace | For |
|---|---|---|
| **superpowers** | `claude-plugins-official` | Brainstorming, TDD, systematic debugging, plan-then-execute |
| **pr-review-toolkit** | `claude-plugins-official` | Multi-agent PR review before merge |
| **commit-commands** | `claude-code-plugins` | Commit, push, PR automation |
| **code-simplifier** | `claude-plugins-official` | Post-implementation cleanup pass |
| **context7** | `claude-plugins-official` | Pulls current library docs instead of guessing from training data |

**Where to find more:** in Claude Code, `/plugin` → Discover browses every marketplace
you've added, including `claude-plugins-official` and `claude-code-plugins` above. In
Codex, `codex plugin marketplace list` does the same. For any other agent, `npx skills
add <owner>/<repo>` installs from any public GitHub repo of skills, not just
agent-plugins.

## File Structure

```
full-starter/
├── AGENTS.md                          # Project brain, read by every tool
├── CLAUDE.md                          # One-line pointer to AGENTS.md
├── SETUP.md                           # Tool-agnostic setup runbook
├── CLAUDE-SETUP.md                    # Claude Code setup
├── CODEX-SETUP.md                     # Codex setup
├── CURSOR-SETUP.md                    # Cursor setup
├── .nvmrc                             # Node version, single source of truth
├── playwright.config.ts               # E2E test config
├── package.json                       # App + Playwright
├── release-please-config.json         # Optional — see release-please.yml
├── .release-please-manifest.json      # Optional — see release-please.yml
│
├── .claude/
│   ├── guidances/                     # 7 domain knowledge docs
│   ├── agents/                        # 3 agents (2 dev + 1 testing) + 2 templates
│   ├── agent-memory/                  # Empty per-agent scaffold directories
│   ├── hooks/                         # 13 hooks
│   └── settings.json                  # All hooks wired
│
├── e2e/                               # Playwright test infrastructure
│   ├── app-contract.ts                # What the smoke tests assume about your app (edit this)
│   ├── auth.setup.ts                  # Auth bypass
│   ├── mocks/                         # AI + profile mocking
│   ├── fixtures/                      # Deterministic test data
│   ├── suite/                         # smoke, generation, tier, visual
│   ├── helpers/                       # Shared utilities
│   └── pages/                         # Page objects
│
├── scripts/
│   ├── verify.sh                      # Pre-completion verification
│   └── experiment-baseline.ts         # Quality regression detection
│
└── .github/workflows/                 # CI (all manual-trigger by default)
    ├── test-smoke.yml
    ├── test-regression.yml
    ├── test-visual.yml
    ├── security-scan.yml
    ├── lockfile-integrity.yml         # npm only
    ├── commitlint.yml
    ├── release-please.yml             # optional
    └── CI-STRATEGY.md                 # Tiered CI guide, full workflow table
```

## Community

- [SECURITY.md](SECURITY.md) — pre-launch security gate; report vulnerabilities to security@stylusnexus.com
- [CONTRIBUTING.md](CONTRIBUTING.md) — setup, commit format, and what belongs here vs. in agent-plugins

## License

[MIT](LICENSE)

---

This repo replaces two earlier starters, [agent-starter](https://github.com/stylusnexus/agent-starter) and [test-starter](https://github.com/stylusnexus/test-starter), which are now archived.
