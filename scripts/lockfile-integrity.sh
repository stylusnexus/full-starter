#!/usr/bin/env bash
#
# lockfile-integrity.sh — supply-chain sanity check for package-lock.json.
#
# npm only. Reads package-lock.json's "packages" format directly — if this
# fork uses pnpm, yarn, or bun, this script is a no-op (no lockfile it
# recognizes) and should be adapted or removed rather than trusted as-is.
#
# Report-only. Runs before any real dependency tree exists, so forks inherit
# it from day one instead of bolting it on after the first incident.
#
#   - a small illustrative blocklist of packages with a documented history of
#     supply-chain compromise (NOT a live threat feed — see the note below)
#   - dependencies that run install-time lifecycle scripts (preinstall,
#     install, postinstall) — the actual mechanism every npm supply-chain
#     compromise on this list used to run code on install
#   - npm audit at high+ severity
#
# For a maintained, updated-daily threat-intel feed instead of this static
# illustrative list, install the `hardening` pack from the agent-plugins
# marketplace and run its `exposure-scan` skill (checks npm, Go, PyPI,
# RubyGems, and MCP servers against real threat-intelligence catalogs).
#
# Mirrors scripts/security-scan.sh — same colored run_check pattern.
#
# Usage:  ./scripts/lockfile-integrity.sh
# CI:     see .github/workflows/lockfile-integrity.yml (manual trigger only)
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

# ── 1. Known-compromised package blocklist (illustrative, not exhaustive) ──
# Each entry below was a real supply-chain incident at some point. This is a
# static example list to show the pattern, not a substitute for a real feed —
# keep it current yourself, or use the hardening pack's exposure-scan skill.
BLOCKLIST=(
  "event-stream"       # 2018 — malicious flatmap-stream dependency added
  "eslint-scope"       # 2018 — npm account compromise, credential-stealing payload
  "ua-parser-js"       # 2021 — npm account compromise, cryptominer + password stealer
  "node-ipc"           # 2022 — protestware, destructive payload for RU/BY IPs
)

check_blocklist() {
  [ -f package-lock.json ] || return 0
  local hits=()
  for pkg in "${BLOCKLIST[@]}"; do
    if grep -q "\"node_modules/${pkg}\"" package-lock.json 2>/dev/null; then
      hits+=("$pkg")
    fi
  done
  if [ "${#hits[@]}" -gt 0 ]; then
    printf "blocklisted packages present in lockfile: %s\n" "${hits[*]}"
    return 1
  fi
  return 0
}

# ── 2. Install-time lifecycle scripts ───────────────────────────────────
# Flags dependencies that run code on install — not inherently malicious,
# but every incident above used exactly this mechanism. Review the list.
check_install_scripts() {
  [ -f package-lock.json ] || return 0
  command -v node >/dev/null 2>&1 || { skip "Install-script scan" "node not found"; return 0; }
  node -e '
    const lock = require("./package-lock.json");
    const pkgs = lock.packages || {};
    const flagged = Object.entries(pkgs)
      .filter(([path, p]) => path && p.hasInstallScript)
      .map(([path]) => path.replace(/^node_modules\//, ""));
    if (flagged.length) {
      console.log("packages with install-time scripts:\n" + flagged.join("\n"));
      process.exit(1);
    }
  '
}

# ── 3. Dependency audit ─────────────────────────────────────────────────
check_audit() {
  if [ -f package.json ] && command -v npm >/dev/null 2>&1; then
    npm audit --audit-level=high
    return $?
  fi
  return 0
}

echo "═══════════════════════════════════════════"
echo "  Lockfile Integrity — Supply-Chain Sweep"
echo "═══════════════════════════════════════════"
echo ""

if [ ! -f package-lock.json ]; then
  echo "No package-lock.json yet — nothing to check."
  exit 0
fi

run_check "Blocklist scan"           check_blocklist
run_check "Install-script scan"      check_install_scripts
if [ -f package.json ]; then
  run_check "Dependency audit (high+)" check_audit
else
  skip "Dependency audit" "no package.json"
fi

echo "═══════════════════════════════════════════"
if [ "$FAIL" -gt 0 ]; then
  printf "${RED}  %d passed, %d failed, %d skipped${NC}\n" "$PASS" "$FAIL" "$SKIP"
  echo "  A flagged package isn't necessarily malicious — verify it by hand."
  exit 1
fi
printf "${GREEN}  %d passed, %d skipped — clean${NC}\n" "$PASS" "$SKIP"
echo "═══════════════════════════════════════════"
