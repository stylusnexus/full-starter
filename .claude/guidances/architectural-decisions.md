# Architectural Decision Records

## When This Guidance Applies

Read before, or right after, a choice that's expensive to reverse: framework or
runtime choice, data model shape, auth strategy, deploy target, a dependency that
becomes load-bearing, or dropping/replacing one of those. Not for routine
implementation choices — if reverting it next week would just mean editing a few
files, it doesn't need a record.

## Why Bother

The code shows *what* was built. It doesn't show what else was considered, or why
the obvious alternative was rejected. Six months later, someone (often you)
re-litigates a settled question because the reasoning lived only in a Slack thread
or a closed PR. A short record kills that.

## Where They Live

`docs/adr/000N-short-title.md`, numbered sequentially, never renumbered or deleted.
A superseded decision gets a new ADR that says so — the old one stays, marked
`superseded`, as the record of what was true at the time.

## Template

```markdown
---
status: proposed | accepted | superseded
date: YYYY-MM-DD
supersedes: 000N   # only if applicable
---

# 000N: Short, specific title

## Context
What forced this decision? What constraint, incident, or requirement made the
status quo untenable or the choice non-obvious?

## Decision
What we're doing, stated plainly. Not a summary of the discussion — the outcome.

## Alternatives Considered
What else was on the table and why it lost. This is the part that actually saves
someone from re-opening a closed question.

## Consequences
What this makes easier. What this makes harder. What it forecloses.
```

## Common Gotchas

- Writing the ADR after the fact from memory loses the alternatives — capture them
  while they're still live, even in rough form, and clean up the wording later.
- A record with no rejected alternative isn't a decision record, it's a changelog
  entry — if nothing else was seriously considered, a commit message is enough.
- Don't retrofit ADRs for decisions nobody is going to question. The cost is the
  writing time and the maintenance of "is this still accurate"; spend it where the
  reversal cost is real.
