---
name: verify
description: Run the verify loop — build, test, lint before claiming work is done
---

# Verify

Run pre-completion checks. Use this before committing or claiming a task is done.

**Announce at start:** "Running verification checks."

## Steps

1. Run `./scripts/verify.sh`
2. If any check fails, report which check failed and the error output
3. Do NOT claim work is complete until all checks pass
4. If a check fails, fix the issue and re-run
