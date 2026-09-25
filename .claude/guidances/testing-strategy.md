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
