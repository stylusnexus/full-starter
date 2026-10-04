# Testing Strategy

## When This Guidance Applies

Loaded automatically when editing test files or modifying tested modules.

## Testing Pyramid

- **Many unit tests** (fast, isolated, no external dependencies)
- **Some integration tests** (real database, real API calls)
- **Few E2E tests** (slow, full stack, critical paths only)

## When to Write Which

| Type | Use For | Examples |
|------|---------|----------|
| Unit | Pure functions, utilities, transformations | Validators, formatters, calculators |
| Integration | API routes, database queries, service interactions | Auth flow, CRUD operations |
| E2E | Critical user journeys only | Login, checkout, core feature |

## The terminus test

**Any value threaded through two or more hops needs a test at its final destination proving it arrived.**

Hops look like `UI → state → route → service → DB`, or `config → orchestrator → downstream call`. Write the test at the *terminus* — query the database, assert on what the downstream call actually received — not at any point in between.

This exists because of a bug class that survives ordinary review. Every intermediate hop is *locally correct*: each function does receive the value and does pass it on. But somewhere a destructure omits it, a DTO mapping leaves it out, or an object spread overwrites it. Nothing throws. No hop's review catches it, because no hop is individually wrong. The value simply never arrives, and the feature looks shipped.

A test at hop three proves nothing about hop five. Only the terminus counts.

## Green CI is not proof

A passing check tells you the checks that ran passed. It doesn't tell you the right checks ran.

- **Run the script CI runs.** Use the exact `npm run` script from the workflow, not a looser local command. A bare test runner often pulls in suites that need infrastructure you don't have, or skips the excludes CI applies, so its result tells you nothing about CI.
- **Confirm a non-zero test count.** A test file placed where no `include` pattern reaches it never runs, and it looks exactly like a passing test. When you add tests in a new directory, run them and check the count went up.
- **Read the summary counts before hunting a failure.** "0 failed" with a red build means an unhandled error outside any test (a teardown race, for example), not a broken assertion. Re-run once to separate flake from regression. An identical second failure is not a flake.
- **A mock that supplies the value under test proves nothing.** If the mock returns the exact thing the test asserts, the test can't fail. For values that come from outside the process (a driver's return, an HTTP status, a row count), pin the behavior against the real dependency and confirm the test fails with the fix reverted.

## Patterns

- Mock external services, not your own code
- Use factories for test data, not static fixtures
- Each test should be independent — no shared mutable state
- Name tests by behavior: "returns error when input is empty" not "test1"
- Run the full suite before committing to critical paths

## Common Mistakes

- Testing implementation details instead of behavior
- Mocking too much (tests pass but production breaks)
- Not testing error paths and edge cases
- Slow tests that nobody runs locally
- Asserting a threaded value mid-journey instead of at its terminus
