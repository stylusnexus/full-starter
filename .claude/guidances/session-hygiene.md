# Session Hygiene

## When This Guidance Applies

Long sessions, sessions where you're hitting plan limits faster than expected, or any time you're noticing context bloat (Claude re-reading the same files, conversation getting sluggish).

## Why This Matters

Anthropic's prompt cache is the single biggest cost lever in Claude Code. Every cached prefix hit costs 0.1× the input price; a cache miss costs 1× plus a 1.25× write. On long sessions with steady tool use, a well-protected cache stays warm indefinitely. A blown cache means you're paying full price for every read.

## Cache Protection Rules

The cached prefix invalidates whenever it changes. Two changes blow it:

1. **Tools changing mid-session.** Adding or removing an MCP server, plugin, or tool forces a full re-read of the system prompt. Don't add MCPs mid-session if you can help it. Connect them at session start.
2. **Model changing mid-session.** Switching models (`/model opus` → `/model sonnet` and back) blows the cache for the same reason. Pick the session model at start.

### What to Do

- **Lock tools at session start.** Decide what you need before starting; resist adding mid-session.
- **Lock the model at session start.** If the work is mixed (planning plus mechanical edits), use the parent model for planning and delegate mechanical work to subagents (which run in their own context with their own model).
- **Watch the cache hit rate.** Healthy is ~90% on the 5-minute default cache TTL. If you're seeing under 80%, something is invalidating your prefix.

## The Five Session Moves

When context is getting heavy, these are your options. Listed from "least carries forward" to "most":

| Move | What carries forward | When to use |
|------|----------------------|-------------|
| **Fresh session** (`/clear`) | Just your next prompt | Switching to unrelated work. New session = fresh prefix. |
| **Compact** (`/compact`) | Lossy summary | Long task wrapping up. Run at 50% or after every task; don't wait for the auto-trigger. |
| **Subagent** (Agent tool) | Just the task brief plus the agent's result | Bulk-mechanical or scoped research that doesn't need the parent's reasoning. |
| **Rewind** (`/rewind` or Esc-Esc) | Conversation up to the chosen turn, with the bad turn cut | A turn went sideways. Cheaper than re-prompting around the bad context. |
| **Continue** | Everything | Default. Use when context is still useful. |

### The Underused Move: Subagents

Anything that's bulk-mechanical, scoped research, or parallelizable should run in a subagent. The parent context stays clean and you parallelize across cheaper models.

Pick the cheapest agent that can do the subtask well:

- **Haiku**: bulk mechanical work, no judgment (file renames, CSV parsing, log scans).
- **Sonnet**: scoped research, code or file exploration, in-scope synthesis.
- **Opus**: rare. Usually keep judgment in the parent.

If a subagent realizes the task needs more reasoning than its tier provides, it should return to the parent rather than burning tokens trying.

## The /effort Dial

Effort is per-prompt, not per-session. Default to `medium` for most prompts and raise it only on the prompt that needs the headroom.

| Setting | When to use |
|---------|-------------|
| `/effort low` | Quick fixes, mechanical tasks, simple lookups. |
| `/effort medium` | Most prompts. Huge token savings versus default. |
| `/effort high` | Demanding reasoning. |
| `/effort xhigh` | Default for agentic coding on Opus 4.7. |
| `/effort max` | Diminishing returns; rarely worth the ~2× cost over xhigh. |

Per Anthropic's published evaluation, `medium` and `xhigh` are the two settings that pay for themselves; `low` and `max` are situational.

## Watch the Number

If you can't see your cache hit rate, you can't fix it. Two community tools worth knowing:

- **`phuryn/claude-usage`**: long-term breakdown by session, day, week, all-time. Use it to find where the spend went.
- **`Gronsten/claude-usage-monitor`**: current 5-hour window plus active session tokens with color thresholds. Use it to know how close you are to your cap right now.

## Settings This Starter Ships With

`.claude/settings.json` ships with two opinionated defaults:

```json
{
  "env": {
    "CLAUDE_CODE_DISABLE_1M_CONTEXT": "1",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "80"
  }
}
```

- `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` falls back from Opus 4.7's 1M default to 200K. 200K is enough for almost any task and is far cheaper.
- `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=80` pins the auto-compact threshold at 80% so the trick of "compact before you hit the auto-trigger" actually works (the default trigger fires later than it should).

Override either if your work genuinely benefits from the 1M window or a different compact threshold.

## References

- Anthropic, "Building Claude Code: Prompt Caching Is Everything" (Thariq).
- Anthropic April 23 postmortem on Max plan limit issues (the writeup that prompted these defaults).
- Paweł Huryn, "Claude Code's Limits Are Generous. The Problem Is Your Setup." (The Product Compass, April 2026) — distilled the four root causes (cache misses, context bloat, wrong model/effort, wrong input format) this guidance addresses.
