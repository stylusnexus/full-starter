#!/usr/bin/env bash
#
# check-docs-sync.sh — fail when the numbers and lists in README.md and
# docs/index.html no longer match the repo.
#
# Checks the hook, agent, and guidance counts and that every guidance is
# named in both files. A number passes if it appears anywhere in the file, so
# it catches a missing or changed count, not every stale mention. Run it after adding or removing a hook, agent, or
# guidance (CONTRIBUTING.md, step 4). Not part of verify.sh, so forks
# don't inherit it by default.
#
# Usage:  ./scripts/check-docs-sync.sh
set -uo pipefail
cd "$(dirname "$0")/.."

FAIL=0
fail() { printf '✗ %s\n' "$1"; FAIL=$((FAIL + 1)); }

# need <file> <extended-regex> <what we expected to find>
need() {
  grep -q -i -E -- "$2" "$1" || fail "$1: expected \"$3\""
}

count() { ls "$@" 2>/dev/null | wc -l | tr -d ' '; }

HOOKS=$(count .claude/hooks/*.sh)
AGENTS=$(count .claude/agents/*.md)
GUIDES=$(count .claude/guidances/*.md)

for f in README.md docs/index.html; do
  need "$f" "(^|[^0-9])$HOOKS hooks" "$HOOKS hooks"
  need "$f" "(^|[^0-9])$AGENTS agents" "$AGENTS agents"
  for g in .claude/guidances/*.md; do
    name=$(basename "$g" .md | tr '-' ' ')
    need "$f" "$name" "guidance \"$name\""
  done
done
need README.md "(^|[^0-9])$GUIDES domain knowledge docs" "$GUIDES domain knowledge docs"

# A file-count claim goes stale on every commit. Don't make one.
if grep -n -E "[0-9]+ files" README.md docs/index.html; then
  fail "remove the file-count claim above (it goes stale)"
fi

if [ "$FAIL" -gt 0 ]; then
  printf '\n%d mismatch(es). Update README.md and docs/index.html to match the repo.\n' "$FAIL"
  exit 1
fi
echo "✓ README.md and docs/index.html match the repo ($HOOKS hooks, $AGENTS agents, $GUIDES guidances)"
