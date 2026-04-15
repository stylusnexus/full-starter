# Claude Code Setup

Point Claude Code at this file to set up your project:

```
Read CLAUDE-SETUP.md and set up my project.
```

## What This Does

This starter includes a complete development + testing infrastructure. When you run this setup, Claude will:

1. **Scan your codebase** to understand your tech stack, project structure, and conventions
2. **Customize CLAUDE.md** with your project's overview, dev commands, and initial gotchas
3. **Update guidances** to match your domain areas (auth, database, AI, etc.)
4. **Configure agent definitions** with your project-specific context
5. **Wire up testing** — update route patterns in mocks, selectors in page objects, auth config
6. **Configure hooks** — update the domain-context-loader path patterns to match your directory structure
7. **Set up CI** — uncomment and adjust the GitHub Actions workflow build/start commands

## Setup Steps

### Step 1: Project Context

Read the existing CLAUDE.md and SETUP.md to understand the starter structure, then scan the project to fill in:

- What does this app do? (2 sentences)
- Tech stack (framework, database, hosting)
- Dev commands (`npm run dev`, `npm run build`, etc.)
- 3-5 known gotchas or critical rules

### Step 1.5: Visual Planning

Run `/visualize-project` to generate architecture diagrams. The skill auto-detects project complexity and generates tiered Mermaid diagrams to `docs/architecture/diagrams/`. These ground the Architecture section in CLAUDE.md with confirmed visuals instead of guesses.

### Step 2: Testing Infrastructure

- Update `e2e/mocks/ai-generation-mock.ts` — replace `**/api/generate` with your actual AI endpoint(s)
- Update `e2e/mocks/profile-mock.ts` — adjust `TIER_DEFAULTS` to match your subscription tiers and `**/api/user/profile` to your profile API route
- Update `e2e/pages/sample-page.ts` — replace selectors with your actual UI elements
- Update `e2e/auth.setup.ts` — adjust login form selectors or configure bypass mode
- Create initial fixture files by documenting expected API response shapes in `e2e/fixtures/ai-responses/`

### Step 3: Hooks

- Update `.claude/hooks/domain-context-loader.sh` — change the `case` patterns to match your directory structure
- Update `.claude/hooks/instrumentation-check.sh` — adjust to your analytics/observability patterns
- Verify `.claude/settings.json` has all hooks wired correctly

### Step 4: CI Workflows

- In `.github/workflows/test-smoke.yml`, uncomment and adjust the build/start steps for your app
- Read `.github/workflows/CI-STRATEGY.md` to choose your testing tier (Minimal/Mid/Maximal)

### Step 5: Verify

Run `./scripts/verify.sh` to confirm the basic setup works.

## Recommended Plugins

After setup, install these plugins for the full workflow:

```bash
claude install-plugin superpowers      # Workflow skills (brainstorm, TDD, plans)
claude install-plugin hookify          # Create hooks from conversation analysis
claude install-plugin commit-commands  # Commit, push, PR automation
claude install-plugin pr-review-toolkit # Multi-agent code review
```

## Learn More

- [Shipping with Agents](https://stylusnexus.github.io/shipping-with-agents/) — development workflow patterns
- [Testing with Agents](https://stylusnexus.github.io/testing-with-agents/) — testing patterns
