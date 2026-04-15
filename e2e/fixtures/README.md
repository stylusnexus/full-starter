# Test Fixtures

Deterministic mock data for E2E tests. Tests use these instead of calling real AI APIs.

## AI Response Fixtures

Files in `ai-responses/` are served by `e2e/mocks/ai-generation-mock.ts` via Playwright route interception.

### Creating a new fixture

1. Make a real API call and capture the response
2. Save the JSON to `ai-responses/<descriptive-name>.json`
3. Remove any sensitive data (API keys, user IDs, timestamps)
4. Verify the structure matches what your UI expects

### Naming convention

- `<feature>-generation.json` — success response
- `<feature>-error.json` — error response
- `<feature>-empty.json` — empty/edge case response

### Maintenance

Fixtures can drift when your API response format changes. If tests break after an API change:
1. Check if the fixture structure still matches the API contract
2. Re-capture if needed
3. Update assertions in tests that reference specific fixture fields
