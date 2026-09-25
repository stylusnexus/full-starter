#!/usr/bin/env bash
# PreToolUse hook: reminds you to ground migration work in the live database
# instead of specs/types/memory, before authoring or applying one.
#
# Fires on: Edit/Write under a migrations directory, or Bash running a
# migration-apply / type-generation command. Adjust MIGRATION_DIR_PATTERN and
# MIGRATION_CMD_PATTERN for your database tooling (Supabase, Prisma, Drizzle,
# Django, Rails, raw SQL migrations, etc.).
#
# Pairs with the db-truth skill in the agent-plugins marketplace
# (/plugin install ship-pipeline@stylus-nexus) — Part A grounds a migration
# in the live schema before you write it, Part B verifies it actually landed
# (a ledger or exit code is not proof) after you apply it.
#
# Non-blocking: additionalContext only, never denies.
#
# Configure in .claude/settings.json:
#   "PreToolUse": [{
#     "matcher": "Edit|Write|Bash",
#     "hooks": [{ "type": "command", "command": "bash .claude/hooks/db-truth-reminder.sh" }]
#   }]

MIGRATION_DIR_PATTERN='migrations?/'
MIGRATION_CMD_PATTERN='(db push|migrate (up|deploy|apply)|prisma migrate|generate types|gen types)'

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null)

FIRE=0

if [[ "$TOOL_NAME" == "Edit" || "$TOOL_NAME" == "Write" ]]; then
  echo "$FILE_PATH" | grep -qE "$MIGRATION_DIR_PATTERN" && FIRE=1
fi

if [[ "$TOOL_NAME" == "Bash" ]]; then
  echo "$COMMAND" | grep -qE "$MIGRATION_CMD_PATTERN" && FIRE=1
fi

[[ "$FIRE" -ne 1 ]] && exit 0

cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","additionalContext":"Reminder: ground migration work in the LIVE database, not specs/types/memory.\n\nBefore authoring: inspect the actual live schema for every table you're referencing (M2M vs scalar, existing constraints, RLS/permissions) rather than assuming from a types file.\nAfter applying: verify the migration actually landed by checking the database directly — a successful exit code or ledger entry is not proof by itself.\n\nThe db-truth skill in the agent-plugins marketplace (/plugin install ship-pipeline@stylus-nexus) automates both halves of this. If you already did this for the current change, ignore and proceed."}}
EOF
