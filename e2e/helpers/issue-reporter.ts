export interface TestFailure {
  specFile: string;
  testTitle: string;
  route: string;
  action: string;
  expected: string;
  actual: string;
  screenshotPath: string | null;
  timestamp: string;
}

export function buildFailureReport(failure: TestFailure): string {
  return [
    `## Test Failure: ${failure.testTitle}`,
    ``,
    `**Spec**: \`${failure.specFile}\``,
    `**Route**: ${failure.route}`,
    `**Time**: ${failure.timestamp}`,
    ``,
    `### What happened`,
    `- **Action**: ${failure.action}`,
    `- **Expected**: ${failure.expected}`,
    `- **Actual**: ${failure.actual}`,
    ``,
    failure.screenshotPath
      ? `### Screenshot\n\`${failure.screenshotPath}\``
      : `_No screenshot available_`,
    ``,
    `### Reproduction`,
    '```bash',
    `npx playwright test "${failure.specFile}" --grep "${failure.testTitle}" --headed`,
    '```',
  ].join('\n');
}

export function buildIssueBody(failures: TestFailure[]): string {
  const header = [
    `## Automated Test Failures`,
    ``,
    `**Run**: ${new Date().toISOString()}`,
    `**Failures**: ${failures.length}`,
    ``,
    `---`,
    ``,
  ].join('\n');

  return header + failures.map(buildFailureReport).join('\n\n---\n\n');
}
