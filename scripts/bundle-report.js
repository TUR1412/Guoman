import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');
const reportDir = path.join(repoRoot, 'reports');

const readManifest = async () => {
  const manifestPath = path.join(distDir, 'manifest.json');
  const raw = await fs.readFile(manifestPath, 'utf-8');
  return JSON.parse(raw);
};

const buildReport = (manifest) => {
  const entries = Object.entries(manifest).map(([key, value]) => ({
    key,
    file: value.file,
    size: value.file ? value.file.length : 0,
    css: value.css || [],
    assets: value.assets || [],
    imports: value.imports || [],
  }));

  return entries;
};

const renderHtml = (entries) => `
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bundle Report</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; }
      h1 { margin-bottom: 12px; }
      table { width: 100%; border-collapse: collapse; font-size: 14px; }
      th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background: #f5f5f5; }
      code { background: #f3f3f3; padding: 2px 4px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>Bundle Report</h1>
    <p>基于 Vite manifest.json 生成的静态概览。</p>
    <table>
      <thead>
        <tr>
          <th>入口</th>
          <th>输出文件</th>
          <th>依赖</th>
          <th>CSS</th>
          <th>资源</th>
        </tr>
      </thead>
      <tbody>
        ${entries
          .map(
            (entry) => `
          <tr>
            <td><code>${entry.key}</code></td>
            <td>${entry.file || ''}</td>
            <td>${entry.imports.length}</td>
            <td>${entry.css.length}</td>
            <td>${entry.assets.length}</td>
          </tr>`,
          )
          .join('')}
      </tbody>
    </table>
  </body>
</html>
`;

const main = async () => {
  const manifest = await readManifest();
  const entries = buildReport(manifest);

  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(path.join(reportDir, 'bundle-report.json'), JSON.stringify(entries, null, 2));
  await fs.writeFile(path.join(reportDir, 'bundle-report.html'), renderHtml(entries));

  process.stdout.write('Bundle report generated in /reports\n');
};

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
