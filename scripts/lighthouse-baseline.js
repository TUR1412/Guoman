import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const reportDir = path.join(repoRoot, 'reports');

const baseline = {
  generatedAt: new Date().toISOString(),
  url: 'https://tur1412.github.io/Guoman/',
  metrics: {
    performance: null,
    accessibility: null,
    bestPractices: null,
    seo: null,
  },
  note: '请使用 Lighthouse CLI 更新 metrics',
};

const main = async () => {
  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(
    path.join(reportDir, 'lighthouse-baseline.json'),
    JSON.stringify(baseline, null, 2),
  );
  process.stdout.write('Lighthouse baseline placeholder generated in /reports\n');
};

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
