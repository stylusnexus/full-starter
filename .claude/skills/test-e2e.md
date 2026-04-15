---
name: test-e2e
description: Run E2E tests with tier selection and server management
---

# Test E2E

Run Playwright E2E tests with smart tier selection.

**Announce at start:** "Running E2E tests."

## Usage

```
/test-e2e                  # Run smoke tests (default)
/test-e2e --smoke          # Smoke tests only
/test-e2e --regression     # Full regression suite
/test-e2e --visual         # Visual comparison tests
/test-e2e --all            # Everything
```

## Workflow

1. **Check for running dev server**: `curl -s http://localhost:3000 > /dev/null`
   - If not running, start it: `npm run dev &` and wait for ready
   - If running, use the existing server

2. **Select tier and run**:
   - --smoke: `npx playwright test --grep @smoke`
   - --regression: `npx playwright test --grep @regression`
   - --visual: `npx playwright test --grep @visual`
   - --all: `npx playwright test`

3. **On failure**: Capture screenshots, report failures, suggest checking playwright-report/

4. **Cleanup**: If we started the dev server, stop it
