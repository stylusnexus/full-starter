/**
 * Experiment-as-Test — Quality Regression Detection
 *
 * Usage:
 *   npx tsx scripts/experiment-baseline.ts              # Run and compare to baseline
 *   npx tsx scripts/experiment-baseline.ts --save       # Save current run as new baseline
 *   npx tsx scripts/experiment-baseline.ts --threshold 0.15  # Custom degradation threshold
 */

import * as fs from 'fs';
import * as path from 'path';

interface ExperimentMetrics {
  structureValidity: number;
  averageQuality: number;
  successRate: number;
  avgResponseMs: number;
  timestamp: string;
}

interface ExperimentBaseline {
  metrics: ExperimentMetrics;
  sampleSize: number;
  savedAt: string;
}

const BASELINE_PATH = path.join(__dirname, '../e2e/baselines/experiment-baseline.json');
const DEFAULT_THRESHOLD = 0.10;
const SAMPLE_SIZE = 5;

async function runSingleExperiment(): Promise<{
  valid: boolean;
  quality: number;
  responseMs: number;
  success: boolean;
}> {
  const start = Date.now();

  // TODO: Replace with your actual API call or feature test
  await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200));

  const responseMs = Date.now() - start;

  return {
    valid: Math.random() > 0.05,
    quality: 0.8 + Math.random() * 0.2,
    responseMs,
    success: Math.random() > 0.02,
  };
}

async function runExperiment(sampleSize: number): Promise<ExperimentMetrics> {
  console.log(`Running ${sampleSize} experiment iterations...`);

  const results = [];
  for (let i = 0; i < sampleSize; i++) {
    const result = await runSingleExperiment();
    results.push(result);
    process.stdout.write(`  Run ${i + 1}/${sampleSize}: quality=${result.quality.toFixed(2)} valid=${result.valid} ${result.responseMs}ms\n`);
  }

  return {
    structureValidity: results.filter((r) => r.valid).length / results.length,
    averageQuality: results.reduce((sum, r) => sum + r.quality, 0) / results.length,
    successRate: results.filter((r) => r.success).length / results.length,
    avgResponseMs: results.reduce((sum, r) => sum + r.responseMs, 0) / results.length,
    timestamp: new Date().toISOString(),
  };
}

function loadBaseline(): ExperimentBaseline | null {
  if (!fs.existsSync(BASELINE_PATH)) return null;
  return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf-8'));
}

function saveBaseline(metrics: ExperimentMetrics, sampleSize: number): void {
  const baseline: ExperimentBaseline = {
    metrics,
    sampleSize,
    savedAt: new Date().toISOString(),
  };
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2));
  console.log(`\nBaseline saved to ${BASELINE_PATH}`);
}

function compareToBaseline(
  current: ExperimentMetrics,
  baseline: ExperimentBaseline,
  threshold: number,
): { passed: boolean; report: string } {
  const checks: Array<{ metric: string; baseline: number; current: number; degradation: number; passed: boolean }> = [];

  for (const key of ['structureValidity', 'averageQuality', 'successRate'] as const) {
    const b = baseline.metrics[key];
    const c = current[key];
    const degradation = b > 0 ? (b - c) / b : 0;
    checks.push({ metric: key, baseline: b, current: c, degradation, passed: degradation <= threshold });
  }

  const bMs = baseline.metrics.avgResponseMs;
  const cMs = current.avgResponseMs;
  const msDegradation = bMs > 0 ? (cMs - bMs) / bMs : 0;
  checks.push({ metric: 'avgResponseMs', baseline: bMs, current: cMs, degradation: msDegradation, passed: msDegradation <= threshold * 2 });

  const allPassed = checks.every((c) => c.passed);

  let report = '\n═══ Experiment Results vs Baseline ═══\n';
  report += `Baseline from: ${baseline.savedAt} (${baseline.sampleSize} samples)\n`;
  report += `Threshold: ${(threshold * 100).toFixed(0)}% degradation\n\n`;

  for (const check of checks) {
    const status = check.passed ? '✓' : '✗';
    const sign = check.degradation > 0 ? '+' : '';
    report += `  ${status} ${check.metric}: ${check.current.toFixed(3)} (baseline: ${check.baseline.toFixed(3)}, ${sign}${(check.degradation * 100).toFixed(1)}%)\n`;
  }

  report += `\n${allPassed ? '✓ All metrics within threshold' : '✗ REGRESSION DETECTED — metrics degraded beyond threshold'}\n`;

  return { passed: allPassed, report };
}

async function main() {
  const args = process.argv.slice(2);
  const shouldSave = args.includes('--save');
  const thresholdArg = args.find((_, i) => args[i - 1] === '--threshold');
  const threshold = thresholdArg ? parseFloat(thresholdArg) : DEFAULT_THRESHOLD;

  const metrics = await runExperiment(SAMPLE_SIZE);

  if (shouldSave) {
    saveBaseline(metrics, SAMPLE_SIZE);
    return;
  }

  const baseline = loadBaseline();
  if (!baseline) {
    console.log('\nNo baseline found. Run with --save to create one:');
    console.log('  npx tsx scripts/experiment-baseline.ts --save');
    console.log('\nCurrent metrics:', JSON.stringify(metrics, null, 2));
    return;
  }

  const { passed, report } = compareToBaseline(metrics, baseline, threshold);
  console.log(report);

  if (!passed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Experiment failed:', err);
  process.exit(1);
});
