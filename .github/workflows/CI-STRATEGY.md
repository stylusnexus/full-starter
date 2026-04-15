# CI Strategy — Choosing Your Testing Tier

All workflows default to **manual trigger only** (`workflow_dispatch`). This keeps costs at zero until you're ready. Enable automatic triggers by uncommenting the relevant sections in each workflow file.

## GitHub Actions Minutes

GitHub Free: **2,000 minutes/month** (Linux runners)
GitHub Pro: **3,000 minutes/month**
GitHub Team: **3,000 minutes/month**
GitHub Enterprise: **50,000 minutes/month**

Each E2E test run typically uses 2-10 minutes depending on test count and app build time.

## Three Tiers

### Minimal (Solo Devs)

Keep everything manual. Run tests locally with `/test-e2e` or `npm test`. Trigger workflows from GitHub UI when you want a CI check before merging.

**Enable:** Nothing — use `workflow_dispatch` as-is
**Cost:** ~0 minutes/month (only when you manually trigger)
**When:** You're the only developer and you trust your local testing

### Mid-Tier (Small Teams, Recommended)

Enable smoke tests on PRs. Keep regression and visual tests manual or nightly.

**Enable in test-smoke.yml:**
```yaml
on:
  workflow_dispatch:
  pull_request:
    branches: [main]
```

**Optionally enable nightly regression in test-regression.yml:**
```yaml
on:
  workflow_dispatch:
  schedule:
    - cron: '0 6 * * *'
```

**Cost:** ~50-200 minutes/month (depending on PR volume)
**When:** 2-5 developers, regular PR flow, want CI safety net

### Maximal (Enterprise / High-Stakes)

Enable all automatic triggers. Smoke on every PR, visual on UI changes, nightly regression.

**Enable all triggers in all three workflow files.**

**Cost:** ~500-2000 minutes/month
**When:** Large team, production SaaS, can't afford regressions shipping to users

## Our Recommendation

Start with **Minimal**. Move to **Mid-Tier** when you have multiple contributors or when a bug ships that local testing would have caught. You'll know when you need Maximal — it's when the cost of a shipped bug exceeds the cost of CI minutes.
