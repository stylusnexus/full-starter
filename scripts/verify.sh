#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0
SKIP=0

run_check() {
  local name="$1"
  shift
  printf "${YELLOW}▶ %s${NC}\n" "$name"
  if "$@" 2>&1; then
    printf "${GREEN}✓ %s passed${NC}\n\n" "$name"
    PASS=$((PASS + 1))
  else
    printf "${RED}✗ %s failed${NC}\n\n" "$name"
    FAIL=$((FAIL + 1))
  fi
}

skip_check() {
  printf "${YELLOW}↷ %s skipped: %s${NC}\n\n" "$1" "$2"
  SKIP=$((SKIP + 1))
}

# The smoke tests drive a running app. A fresh fork has none, so playwright's
# webServer ("npm run dev") would die with "Missing script". Skip with the
# reason instead, and run them once there's an app to point at.
has_app() {
  [ -n "${BASE_URL:-}" ] || node -e 'process.exit(require("./package.json").scripts?.dev ? 0 : 1)'
}

echo "═══════════════════════════════════════════"
echo "  Verify Loop — Pre-Completion Checks"
echo "═══════════════════════════════════════════"
echo ""

# Adapt these commands to your project
# Uncomment the checks that apply to your stack

# run_check "TypeScript" npx tsc --noEmit
# run_check "Lint" npm run lint
# run_check "Build" npm run build
run_check "Security" ./scripts/security-scan.sh   # secrets + deps; see SECURITY.md
if has_app; then
  run_check "Smoke Tests" npx playwright test --grep @smoke
else
  skip_check "Smoke Tests" 'no app to test. Add a "dev" script to package.json or set BASE_URL.'
fi

echo "═══════════════════════════════════════════"
if [ "$FAIL" -gt 0 ]; then
  printf "${RED}  %d passed, %d failed, %d skipped${NC}\n" "$PASS" "$FAIL" "$SKIP"
  echo "═══════════════════════════════════════════"
  exit 1
elif [ "$PASS" -eq 0 ]; then
  printf "${RED}  No checks ran (%d skipped). Nothing was verified.${NC}\n" "$SKIP"
  echo "═══════════════════════════════════════════"
  exit 1
else
  printf "${GREEN}  %d passed, %d skipped${NC}\n" "$PASS" "$SKIP"
  echo "═══════════════════════════════════════════"
  exit 0
fi
