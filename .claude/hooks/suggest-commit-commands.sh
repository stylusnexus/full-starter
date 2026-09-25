#!/usr/bin/env bash
# PostToolUse hook: nudge toward the commit-commands skill after a manual
# git commit/push, instead of hand-typing the same workflow every time.
#
# Configure in .claude/settings.json:
#   "PostToolUse": [{
#     "matcher": "Bash",
#     "hooks": [{ "type": "command", "command": "bash .claude/hooks/suggest-commit-commands.sh" }]
#   }]

set -e

TOOL_OUTPUT=$(cat)

if echo "$TOOL_OUTPUT" | grep -qE 'git (commit|push)'; then
    echo ""
    echo "Tip: the commit-commands skill (see README.md's Skills section —"
    echo "/plugin install commit-commands@claude-code-plugins) automates"
    echo "commit message generation, push, and PR creation in one step."
    echo ""
fi

exit 0
