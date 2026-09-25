#!/usr/bin/env bash
# PostToolUse hook: run the lockfile integrity sweep immediately after any
# Bash command that touches package-lock.json (npm install, npm audit fix,
# etc.) — catches a poisoned dependency at development time, before commit,
# instead of waiting for the manual-trigger CI workflow to run.
#
# Delegates to scripts/lockfile-integrity.sh so there's one blocklist to
# maintain, not two.
#
# Configure in .claude/settings.json:
#   "PostToolUse": [{
#     "matcher": "Bash",
#     "hooks": [{ "type": "command", "command": "bash .claude/hooks/lockfile-integrity-check.sh" }]
#   }]

set -uo pipefail

cat > /dev/null  # drain stdin (tool-output payload) — this hook only needs the working tree state

if ! git diff --name-only 2>/dev/null | grep -q "package-lock.json"; then
  exit 0
fi

SCRIPT="$(dirname "$0")/../../scripts/lockfile-integrity.sh"
if [ -x "$SCRIPT" ]; then
  "$SCRIPT"
fi

exit 0
