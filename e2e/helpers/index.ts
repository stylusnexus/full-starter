/**
 * Shared E2E test helpers.
 *
 * Usage:
 *   import { captureConsoleErrors, setViewport, waitForToast } from './helpers';
 */

export { captureConsoleErrors, assertNoConsoleErrors } from './console-errors';
export { waitForToast, takeScreenshot, assertUrl } from './test-utils';
export { setViewport, VIEWPORTS } from './viewport';
export type { ViewportName } from './viewport';
export { buildFailureReport, buildIssueBody } from './issue-reporter';
export type { TestFailure } from './issue-reporter';
export * from './selectors';
