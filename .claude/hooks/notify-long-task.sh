#!/usr/bin/env bash
# PostToolUse hook: desktop notification when a long-running command finishes.
# Fires after Bash commands. Detects build/test/lint completion and reports
# pass/fail so you don't have to keep the terminal in view.
#
# Configure in .claude/settings.json:
#   "PostToolUse": [{
#     "matcher": "Bash",
#     "hooks": [{ "type": "command", "command": "bash .claude/hooks/notify-long-task.sh" }]
#   }]

set -e

TOOL_OUTPUT=$(cat)
NOTIFY_SCRIPT="$(dirname "$0")/notify.sh"

notify() {
    if [ -x "$NOTIFY_SCRIPT" ]; then
        "$NOTIFY_SCRIPT" "$1" "$2" "$3" "$4"
    fi
}

# Builds
if echo "$TOOL_OUTPUT" | grep -qE "npm run build"; then
    if echo "$TOOL_OUTPUT" | grep -qiE "(error|failed)"; then
        notify "Claude Code" "Build failed" "Basso" "claude-build"
    elif echo "$TOOL_OUTPUT" | grep -qiE "(success|compiled successfully)"; then
        notify "Claude Code" "Build completed" "Hero" "claude-build"
    fi
    exit 0
fi

# Tests
if echo "$TOOL_OUTPUT" | grep -qE "(npm test|npm run test|vitest|playwright)"; then
    if echo "$TOOL_OUTPUT" | grep -qiE "(failed|failing|✗)"; then
        notify "Claude Code" "Tests failed" "Sosumi" "claude-test"
    elif echo "$TOOL_OUTPUT" | grep -qiE "(pass|passed|✓|✔)"; then
        notify "Claude Code" "Tests passed" "Purr" "claude-test"
    fi
    exit 0
fi

# Linting
if echo "$TOOL_OUTPUT" | grep -qE "npm run lint"; then
    if echo "$TOOL_OUTPUT" | grep -qiE "error|warning"; then
        notify "Claude Code" "Linting issues found" "Funk" "claude-lint"
    else
        notify "Claude Code" "Linting passed" "Purr" "claude-lint"
    fi
    exit 0
fi

exit 0
