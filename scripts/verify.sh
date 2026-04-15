#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

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

echo "═══════════════════════════════════════════"
echo "  Verify Loop — Pre-Completion Checks"
echo "═══════════════════════════════════════════"
echo ""

# Adapt these commands to your project
# Uncomment the checks that apply to your stack

# run_check "TypeScript" npx tsc --noEmit
# run_check "Lint" npm run lint
# run_check "Build" npm run build
run_check "Smoke Tests" npx playwright test --grep @smoke

echo "═══════════════════════════════════════════"
if [ "$FAIL" -gt 0 ]; then
  printf "${RED}  %d passed, %d failed${NC}\n" "$PASS" "$FAIL"
  echo "═══════════════════════════════════════════"
  exit 1
else
  printf "${GREEN}  All %d checks passed${NC}\n" "$PASS"
  echo "═══════════════════════════════════════════"
  exit 0
fi
