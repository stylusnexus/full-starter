#!/usr/bin/env bash
#
# security-scan.sh — framework-agnostic pre-launch security sweep.
#
# Report-only. Runs the checks that catch the most common AI-app leaks:
#   - secrets committed to git history / working tree
#   - .env files that escaped .gitignore
#   - known-vulnerable dependencies
#   - obvious client-side key exposure
#
# Mirrors scripts/verify.sh — same colored run_check pattern.
# Each tool degrades gracefully if not installed (CI installs them; locally optional).
#
# Usage:  ./scripts/security-scan.sh
# CI:     see .github/workflows/security-scan.yml
set -uo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
DIM='\033[2m'
NC='\033[0m'

PASS=0
FAIL=0
SKIP=0

run_check() {
  local name="$1"; shift
  printf "${YELLOW}▶ %s${NC}\n" "$name"
  if "$@"; then
    printf "${GREEN}✓ %s${NC}\n\n" "$name"
    PASS=$((PASS + 1))
  else
    printf "${RED}✗ %s${NC}\n\n" "$name"
    FAIL=$((FAIL + 1))
  fi
}

skip() { printf "${DIM}— %s (skipped: %s)${NC}\n\n" "$1" "$2"; SKIP=$((SKIP + 1)); }

# ── 1. Secret scanning ────────────────────────────────────────────────
# Prefer gitleaks (history-aware). Fall back to a conservative grep so the
# check still runs on machines without it.
check_secrets() {
  if command -v gitleaks >/dev/null 2>&1; then
    # `gitleaks git` scans full history (incl. working tree). Uses .gitleaks.toml at
    # repo root automatically, which adds OpenAI/Anthropic rules over the defaults.
    gitleaks git --no-banner --redact --exit-code 1
    return $?
  fi
  printf "${DIM}gitleaks not found — using grep fallback (install gitleaks for history scanning)${NC}\n"
  # High-signal patterns only, to keep false positives low.
  local hits
  hits=$(git grep -nIE \
    'AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|sk-ant-[A-Za-z0-9-]{20,}|AIza[0-9A-Za-z_-]{35}|ghp_[0-9A-Za-z]{36}|xox[baprs]-[0-9A-Za-z-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----' \
    -- ':!*.example' ':!*.lock' ':!package-lock.json' 2>/dev/null) || true
  if [ -n "$hits" ]; then
    printf "%s\n" "$hits"
    return 1
  fi
  return 0
}

# ── 2. .env files that escaped .gitignore ─────────────────────────────
check_tracked_env() {
  local tracked
  tracked=$(git ls-files | grep -E '(^|/)\.env($|\.)' | grep -v '\.env\.example$') || true
  if [ -n "$tracked" ]; then
    printf "tracked env files (should not be in git):\n%s\n" "$tracked"
    return 1
  fi
  return 0
}

# ── 3. Vulnerable dependencies ────────────────────────────────────────
check_deps() {
  if [ -f package.json ] && command -v npm >/dev/null 2>&1; then
    npm audit --audit-level=high
    return $?
  fi
  return 0
}

# ── 4. Client-side key exposure (best-effort, framework-aware) ────────
# Flags hardcoded secret-shaped values in client code. For Next.js it also
# warns when a *secret* (not URL/ID) is read through a NEXT_PUBLIC_ var,
# which ships the value to the browser bundle.
check_client_exposure() {
  local dirs=""
  for d in src app components pages lib public; do [ -d "$d" ] && dirs="$dirs $d"; done
  [ -z "$dirs" ] && return 0
  local hits
  hits=$(git grep -nIE \
    'sk-[A-Za-z0-9]{20,}|sk-ant-|AKIA[0-9A-Z]{16}|process\.env\.NEXT_PUBLIC_[A-Z_]*(SECRET|KEY|TOKEN|PASSWORD)' \
    -- $dirs 2>/dev/null \
    | grep -vE '_PUBLIC_(KEY|TOKEN)?$' ) || true
  if [ -n "$hits" ]; then
    printf "possible client-exposed secrets:\n%s\n" "$hits"
    return 1
  fi
  return 0
}

echo "═══════════════════════════════════════════"
echo "  Security Scan — Pre-Launch Sweep"
echo "═══════════════════════════════════════════"
echo ""

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Not a git repo — run from the project root after 'git init'."
  exit 2
fi

run_check "Secret scan"            check_secrets
run_check "Tracked .env files"     check_tracked_env
run_check "Client-side exposure"   check_client_exposure
if [ -f package.json ]; then
  run_check "Dependency audit (high+)" check_deps
else
  skip "Dependency audit" "no package.json"
fi

echo "═══════════════════════════════════════════"
if [ "$FAIL" -gt 0 ]; then
  printf "${RED}  %d passed, %d failed, %d skipped${NC}\n" "$PASS" "$FAIL" "$SKIP"
  echo "  Review findings above. See SECURITY.md for the full launch gate."
  exit 1
fi
printf "${GREEN}  %d passed, %d skipped — automated checks clean${NC}\n" "$PASS" "$SKIP"
echo "  Now run the judgment-call items in SECURITY.md before launch."
echo "═══════════════════════════════════════════"
