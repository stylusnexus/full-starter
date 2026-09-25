#!/usr/bin/env bash
# Stop hook: prune old subagent logs so they don't slow down session startup.
# Keeps the last 50 files, or anything modified within the last 30 days,
# whichever keeps more.
#
# Configure in .claude/settings.json:
#   "Stop": [{ "hooks": [{ "type": "command", "command": "bash .claude/hooks/cleanup-logs.sh" }] }]

LOG_DIR=".claude/subagent-logs"
MAX_DAYS=30
MAX_FILES=50

[ -d "$LOG_DIR" ] || exit 0

BEFORE_COUNT=$(find "$LOG_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
[ "$BEFORE_COUNT" -lt 20 ] && exit 0

# Delete anything older than MAX_DAYS first.
find "$LOG_DIR" -type f -mtime +$MAX_DAYS -delete 2>/dev/null

# If still over the cap, keep only the MAX_FILES most recent.
AFTER_COUNT=$(find "$LOG_DIR" -type f 2>/dev/null | wc -l | tr -d ' ')
if [ "$AFTER_COUNT" -gt "$MAX_FILES" ]; then
    find "$LOG_DIR" -type f -printf '%T@ %p\n' 2>/dev/null | \
        sort -rn | \
        tail -n +$((MAX_FILES + 1)) | \
        cut -d' ' -f2- | \
        xargs rm -f 2>/dev/null
    AFTER_COUNT=$MAX_FILES
fi

DELETED=$((BEFORE_COUNT - AFTER_COUNT))
if [ "$DELETED" -gt 0 ]; then
    echo "Cleaned up $DELETED old subagent logs (kept $AFTER_COUNT most recent)."
fi

exit 0
