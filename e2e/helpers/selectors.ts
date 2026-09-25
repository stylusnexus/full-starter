/**
 * Shared selector constants for E2E tests.
 * Centralizes data-testid values and common locator patterns.
 *
 * Convention: {component}-{element}[-{variant}]
 * Add your app's selectors below as sections, grouped by feature area.
 */

// ---------- Common UI ----------
export const SONNER_TOAST = '[data-sonner-toast]';
export const DIALOG = '[role="dialog"]';
export const LOADING_SPINNER = '[class*="animate-spin"], [role="status"]';
