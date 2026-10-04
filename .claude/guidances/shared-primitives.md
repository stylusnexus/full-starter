# Shared Primitives

## When This Guidance Applies

You just fixed a bug, or you're about to, and the same kind of bug could live somewhere else in the codebase. Common triggers: a missed cleanup on an early return, a cache keyed wrong, an input sanitized in one route but not its siblings, a value dropped by one of several near-identical handlers.

## The Rule

**Prefer a wrapper to a fix.** A fix applied where the bug was reported protects one surface. A shared primitive protects every surface that uses it, and a sibling has to visibly opt out to skip it.

A wrapper can't be applied to only one surface. A fix can, and repeatedly is.

## How to Decide

1. Name the sibling surfaces. Grep for every other place that does the same job.
2. If there's more than one, ask whether a shared function, wrapper, or type can make the correct behavior the default.
3. If a wrapper isn't possible, say so in the PR: name each sibling and state whether it needs the same change. "No sibling exists" is a valid answer. It takes five seconds to write down.

## Signs You Needed One

- The same bug gets reported on a second screen, route, or generator
- A review comment says "did you check the other handlers?"
- A fix touches one of N near-identical files and leaves the rest
- You patched the symptom in the caller because the shared code was awkward to change

## Common Mistakes

- Fixing only where the report came from, then closing the issue
- Building a wrapper nobody is required to use (it needs a lint rule, a type, or a test that fails when a surface skips it)
- Weakening a shared function to make one caller pass, which changes every other caller
- Counting call sites by memory instead of by grep
