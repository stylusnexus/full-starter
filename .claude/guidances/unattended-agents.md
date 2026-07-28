# Unattended Agents

## When This Guidance Applies

Any time an agent runs without you watching each step: scheduled routines (`/schedule`),
recurring loops (`/loop`), background workflows that mutate files, or anything triggered
by an external event (a cron, a webhook, a new GitHub issue or PR). It does **not** apply
to a normal attended session where you read each turn before approving it.

## Why This Matters

An attended session has a safety net you rarely notice: you. When a plan drifts or a
command looks wrong, you stop it. An unattended agent has no such net — it acts on the
instruction it was given, against whatever access it was given, with no one reading the
turn before the damage lands.

The failure mode is a single sentence: **automation becomes dangerous when the
instruction is broad and the access is wide.** A narrow job against narrow access fails
small. A broad job against broad access fails at the size of everything it could touch.
You shrink the blast radius up front, because there's no one there to shrink it later.

## The Checklist

Before you let an agent run unattended, it should have all seven:

- [ ] **A narrow job.** One task with a clear boundary ("review new PRs and post a risk
      note"), not an open mandate ("keep the repo healthy"). If you can't state where the
      job ends in one sentence, it's too broad to leave alone.
- [ ] **Clear success rules.** The agent must be able to tell *done* from *not done*
      without you. Define what a finished, correct run looks like, and what it should do
      when it can't get there (stop and report — never improvise wider).
- [ ] **Limited repository access.** Scope it to the repos and branches the job needs.
      A PR-triage routine reads PRs; it does not need push to `main`.
- [ ] **Limited credentials.** Read-only tokens and least-privilege keys by default.
      Don't hand an unattended agent production credentials so it can avoid asking.
- [ ] **Safe stopping points.** The work should break into steps where stopping leaves a
      clean state — a draft PR, an uncommitted diff, a report — not a half-applied
      migration or a partial deploy.
- [ ] **A report of every action.** It logs what it did, every run. An unattended agent
      you can't audit after the fact is one you can't trust before it.
- [ ] **Human approval before high-risk changes.** Anything irreversible or outward-facing
      — a merge to a shared branch, a production migration, a deploy, an external
      send — stops and waits for a human. The routine prepares the change; a person ships it.

## Mapping It to the Harness

- **`/schedule`** (cloud routines, cron-driven): give it the *narrowest* prompt that does
  the job, point it at one repo/branch, and make the deliverable a draft or report a human
  reviews — not a merged change.
- **`/loop`**: cap what each iteration may touch, and prefer a deliverable that accumulates
  for review (findings, a report) over one that mutates shared state each pass.
- **Workflows / background agents that write files**: isolate them (a worktree) so a bad
  run is contained to a throwaway checkout, and keep the merge step human.

These compose with the workspace defaults, which apply doubly when no one is watching:
never `--no-verify`, never `push --force` to a shared branch, and never run a migration,
`UPDATE`, or `DELETE` against production without confirming a recent backup first.

## References

- *Claude Code (NO PAYWALL)*, "Routines are where the work continues without your laptop"
  — the seven-point Routine spec this checklist is built on.
