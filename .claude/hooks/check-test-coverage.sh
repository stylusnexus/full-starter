#!/usr/bin/env bash
# PostToolUse hook: Check if modified source files have corresponding tests.
#
# Fires after Edit or Write operations on source files.
# Warns (does not block) if a modified file has no corresponding test.
#
# Configure in .claude/settings.json:
#   "PostToolUse": [{
#     "matcher": "Edit|Write",
#     "hooks": [{ "type": "command", "command": "bash .claude/hooks/check-test-coverage.sh" }]
#   }]

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.file // ""')

# Only check source files, not tests/configs/docs
[[ -z "$FILE_PATH" ]] && exit 0
[[ "$FILE_PATH" == *.spec.* ]] && exit 0
[[ "$FILE_PATH" == *.test.* ]] && exit 0
[[ "$FILE_PATH" == *.md ]] && exit 0
[[ "$FILE_PATH" == *.json ]] && exit 0
[[ "$FILE_PATH" == *.yml ]] && exit 0
[[ "$FILE_PATH" == *.yaml ]] && exit 0
[[ "$FILE_PATH" == *.css ]] && exit 0
[[ "$FILE_PATH" == *.sh ]] && exit 0

# Extract the filename without extension
BASENAME=$(basename "$FILE_PATH")
NAME_NO_EXT="${BASENAME%.*}"

# Look for a corresponding test file
TEST_EXISTS=false
for pattern in "**/${NAME_NO_EXT}.spec.*" "**/${NAME_NO_EXT}.test.*" "**/test-${NAME_NO_EXT}.*"; do
  if compgen -G "$pattern" > /dev/null 2>&1; then
    TEST_EXISTS=true
    break
  fi
done

# Also check if the file is covered by an E2E test (mentioned in a spec file)
if [ "$TEST_EXISTS" = false ]; then
  if grep -rl "$NAME_NO_EXT" e2e/suite/ 2>/dev/null | grep -q ".spec."; then
    TEST_EXISTS=true
  fi
done

if [ "$TEST_EXISTS" = false ]; then
  echo "Note: $BASENAME was modified but has no corresponding test file. Consider adding tests."
fi

# Always exit 0 — this is advisory, not blocking
exit 0
