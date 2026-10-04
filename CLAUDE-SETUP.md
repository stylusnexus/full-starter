# Claude Code Setup

Point Claude Code at this file to set up your project:

```
Read CLAUDE-SETUP.md and set up my project.
```

## What This Does

This starter includes a complete development + testing infrastructure. When you run this setup, Claude will:

1. **Scan your codebase** to understand your tech stack, project structure, and conventions
2. **Customize AGENTS.md** with your project's overview, dev commands, and initial gotchas — `CLAUDE.md` just points there, leave it alone. Delete the "About This Template" section at the top of `AGENTS.md` once setup is done; it describes the starter, not your project
3. **Update guidances** to match your domain areas (auth, database, AI, etc.)
4. **Configure agent definitions** with your project-specific context
5. **Wire up testing** — update route patterns in mocks, selectors in page objects, auth config
6. **Configure hooks** — update the domain-context-loader path patterns to match your directory structure
7. **Set up CI** — uncomment and adjust the GitHub Actions workflow build/start commands

## Setup Steps

### Step 1: Project Context

Read the existing AGENTS.md and SETUP.md to understand the starter structure, then scan the project to fill in:

- What does this app do? (2 sentences)
- Tech stack (framework, database, hosting)
- Dev commands (`npm run dev`, `npm run build`, etc.)
- 3-5 known gotchas or critical rules

### Step 1.5: Visual Planning

Install `codebase-intel@stylus-nexus` from the agent-plugins marketplace (see Recommended Plugins below) and run its `codebase-architecture-scanner` skill to generate layered architecture diagrams. These ground the Architecture section in AGENTS.md with confirmed visuals instead of guesses.

### Step 2: Testing Infrastructure

- Update `e2e/mocks/ai-generation-mock.ts` — replace `**/api/generate` with your actual AI endpoint(s)
- Update `e2e/mocks/profile-mock.ts` — adjust `TIER_DEFAULTS` to match your subscription tiers and `**/api/user/profile` to your profile API route
- Update `e2e/pages/sample-page.ts` — replace selectors with your actual UI elements
- Update `e2e/app-contract.ts` — fill it in using the "Fill in the App Contract" rules in `SETUP.md` (ask the user only whether people sign in; read the rest from the code)
- Update `e2e/auth.setup.ts` — adjust login form selectors or configure bypass mode
- Create initial fixture files by documenting expected API response shapes in `e2e/fixtures/ai-responses/`

### Step 3: Hooks

- Update `.claude/hooks/domain-context-loader.sh` — change the `case` patterns to match your directory structure
- Update `.claude/hooks/instrumentation-check.sh` — adjust to your analytics/observability patterns
- Verify `.claude/settings.json` has all hooks wired correctly

### Step 4: CI Workflows

- In `.github/workflows/test-smoke.yml`, uncomment and adjust the build/start steps for your app once it has a build and start command. Until then, leave them commented (don't add commands that don't work yet)
- Read `.github/workflows/CI-STRATEGY.md` to choose your testing tier (Minimal/Mid/Maximal)

### Step 5: Verify

Run `./scripts/verify.sh` to confirm the basic setup works.

## Recommended Plugins

Full Starter doesn't bundle skills as static files — install them live instead:

```
/plugin marketplace add stylusnexus/agent-plugins
/plugin install ship-pipeline@stylus-nexus       # daily verify → review → merge loop
/plugin install hardening@stylus-nexus           # pre-launch security gates
/plugin install codebase-intel@stylus-nexus      # architecture scans, docs grounding
```

See `README.md`'s Skills section for the full pack list, plus a short list of
non-agent-plugins skills in daily rotation (superpowers, pr-review-toolkit,
commit-commands, code-simplifier, context7).

## Learn More

- [agent-plugins](https://github.com/stylusnexus/agent-plugins) — the marketplace this starter's skills come from
