#!/usr/bin/env bash
# Pre-commit hook: block secrets from being committed.
# Scans only STAGED changes, so it stays fast on every commit.
#
# Install:  cp .claude/hooks/pre-commit-secrets.sh .git/hooks/pre-commit
#   (or chain it after pre-commit-verify.sh if you want both)
#
# Bypass (not recommended):  git commit --no-verify

if command -v gitleaks >/dev/null 2>&1; then
  # `gitleaks git --staged` scans the staged diff. (`protect` is deprecated and was
  # observed to scan commit history instead of the staged changes.)
  if ! gitleaks git --staged --no-banner --redact --exit-code 1; then
    echo ""
    echo "🔒 Secret detected in staged changes — commit blocked."
    echo "   Remove it, move it to .env (gitignored), and re-stage."
    echo "   False positive? Add a gitleaks allowlist entry or commit with --no-verify."
    exit 1
  fi
  exit 0
fi

# Fallback when gitleaks isn't installed: grep the staged diff for high-signal keys.
staged=$(git diff --cached -U0 | grep '^+' | grep -vE '^\+\+\+' || true)
if printf '%s' "$staged" | grep -qE \
  'AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|sk-ant-[A-Za-z0-9-]{20,}|AIza[0-9A-Za-z_-]{35}|ghp_[0-9A-Za-z]{36}|xox[baprs]-[0-9A-Za-z-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----'; then
  echo "🔒 Possible secret in staged changes — commit blocked (grep fallback)."
  echo "   Install gitleaks for accurate scanning: https://github.com/gitleaks/gitleaks"
  echo "   Bypass (not recommended): git commit --no-verify"
  exit 1
fi
exit 0
