---
name: ux-review
description: AI-powered visual UX review of screenshots. Analyzes layout, spacing, consistency, accessibility.
---

# UX Review

Feed screenshots to vision analysis for automated UX feedback.

**Announce at start:** "Running UX review."

## Usage

```
/ux-review                     # Review all existing snapshots
/ux-review --fresh             # Run visual tests first, then review
/ux-review <path>              # Review a specific screenshot
```

## Workflow

### Step 1: Gather Screenshots

**If --fresh:** Run Playwright visual tests to capture current state:
```bash
npx playwright test --grep @visual --update-snapshots
```

**Otherwise:** Find existing snapshots:
```bash
find . -path '*-snapshots/*.png' -not -path './node_modules/*' | head -50
```

### Step 2: Analyze Each Screenshot

Use the Read tool to view each image. Evaluate against:

- Content properly aligned, consistent spacing, no overlapping elements
- Primary action prominent, headers distinguishable
- Sufficient color contrast (WCAG AA: 4.5:1)
- Touch targets at least 44px, form inputs have visible labels

### Step 3: Report

For each screenshot:
- **Rating:** Good / Needs Attention / Needs Fix
- **Issues:** [severity] [description] — [suggestion]
