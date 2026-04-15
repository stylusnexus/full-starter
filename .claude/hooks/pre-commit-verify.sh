#!/usr/bin/env bash
# Pre-commit hook that runs the verify loop.
# Install: cp .claude/hooks/pre-commit-verify.sh .git/hooks/pre-commit

echo "Running pre-commit verification..."
./scripts/verify.sh

if [ $? -ne 0 ]; then
  echo ""
  echo "Pre-commit checks failed. Fix the issues above before committing."
  echo "To bypass (not recommended): git commit --no-verify"
  exit 1
fi
