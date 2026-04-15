# Full Starter

The complete development + testing infrastructure in one repo. This is the pre-merged version of [agent-starter](https://github.com/stylusnexus/agent-starter) (development) and [test-starter](https://github.com/stylusnexus/test-starter) (testing). Fork and go — no manual merging required.

By [Stylus Nexus](https://github.com/stylusnexus).

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

### Development Infrastructure (from agent-starter)

- **CLAUDE.md** — project brain with rules, commands, and gotchas
- **Guidances** — on-demand domain knowledge (AI safety, database patterns, testing strategy)
- **6 agents** — backend-engineer, ui-engineer, ux-designer, ai-engineer, product-manager, technical-writer
- **Agent memory** — persistent knowledge directories per agent
- **11 skills** — brainstorm, TDD, verify, write-plan, execute-plan, debug, orient, review-and-ship, deploy, activity-summary, experiment
- **4 hooks** — domain context loader, instrumentation check, require-tests guard, test coverage advisory

### Testing Infrastructure (from test-starter)

- **Playwright E2E** — config, auth bypass, page objects, test suite
- **AI mock fixtures** — route interception with JSON fixture files
- **Profile mocking** — tier impersonation without real accounts
- **Visual verification** — screenshot baseline comparison
- **Verify loop** — build + test + lint pre-completion script
- **Experiment-as-test** — quality regression detection with baselines
- **3 CI workflows** — smoke (PR), regression (nightly), visual (UI changes)
- **3 skills** — verify, ux-review, test-e2e
- **1 agent** — test-reviewer (coverage gap analysis)

### Multi-Tool Setup Docs

- `CLAUDE-SETUP.md` — Claude Code specific setup (plugins, hooks, skills)
- `CODEX-SETUP.md` — OpenAI Codex setup (AGENTS.md, plugins, MCP)
- `CURSOR-SETUP.md` — Cursor setup (.cursorrules, Marketplace, @references)
- `SETUP.md` — Tool-agnostic automated setup runbook

## File Structure

```
full-starter/
├── CLAUDE.md                          # Project brain
├── SETUP.md                           # Tool-agnostic setup runbook
├── CLAUDE-SETUP.md                    # Claude Code setup
├── CODEX-SETUP.md                     # Codex setup
├── CURSOR-SETUP.md                    # Cursor setup
├── playwright.config.ts               # E2E test config
├── package.json                       # App + Playwright
│
├── .claude/
│   ├── guidances/                     # Domain knowledge (3 examples)
│   ├── agents/                        # 7 agents (6 dev + 1 testing)
│   ├── agent-memory/                  # Per-agent persistent knowledge
│   ├── skills/                        # 14 skills (11 dev + 3 testing)
│   ├── hooks/                         # 6 hooks (4 dev + 2 testing)
│   └── settings.json                  # All hooks wired
│
├── e2e/                               # Playwright test infrastructure
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
    └── CI-STRATEGY.md                 # Tiered CI guide
```

## Companion Guides

- **[Shipping with Agents](https://stylusnexus.github.io/shipping-with-agents/)** — the development patterns behind agent-starter
- **[Testing with Agents](https://stylusnexus.github.io/testing-with-agents/)** — the testing patterns behind test-starter

## License

MIT
