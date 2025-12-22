import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');
const reportDir = path.join(repoRoot, 'reports');

const readManifest = async () => {
  const viteManifestPath = path.join(distDir, '.vite', 'manifest.json');
  const legacyManifestPath = path.join(distDir, 'manifest.json');

  let raw = null;
  try {
    raw = await fs.readFile(viteManifestPath, 'utf-8');
  } catch {
    raw = await fs.readFile(legacyManifestPath, 'utf-8');
  }
  return JSON.parse(raw);
};

const formatBytes = (bytes) => {
  const value = Number(bytes) || 0;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(2)} kB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
};

const isTextLike = (filePath) =>
  /\.(js|mjs|cjs|css|html|json|svg|txt|map)$/i.test(String(filePath || ''));

const getFileSize = async (filePath) => {
  if (!filePath) return 0;
  try {
    const stat = await fs.stat(filePath);
    return stat.size || 0;
  } catch {
    return 0;
  }
};

const getCompressedSizes = async (filePath) => {
  if (!filePath) return { gzipBytes: 0, brotliBytes: 0 };
  if (!isTextLike(filePath)) return { gzipBytes: 0, brotliBytes: 0 };

  try {
    const buffer = await fs.readFile(filePath);
    return {
      gzipBytes: gzipSync(buffer).byteLength,
      brotliBytes: brotliCompressSync(buffer).byteLength,
    };
  } catch {
    return { gzipBytes: 0, brotliBytes: 0 };
  }
};

const buildReport = async (manifest) => {
  const entries = await Promise.all(
    Object.entries(manifest).map(async ([key, value]) => {
      const file = value.file || null;
      const filePath = file ? path.join(distDir, file) : null;
      const bytes = await getFileSize(filePath);
      const { gzipBytes, brotliBytes } = await getCompressedSizes(filePath);

      return {
        key,
        file,
        bytes,
        gzipBytes,
        brotliBytes,
        css: value.css || [],
        assets: value.assets || [],
        imports: value.imports || [],
      };
    }),
  );

  return entries.sort((a, b) => (b.bytes || 0) - (a.bytes || 0));
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
      td.num { text-align: right; white-space: nowrap; }
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
          <th>体积</th>
          <th>gzip</th>
          <th>brotli</th>
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
            <td class="num">${formatBytes(entry.bytes)}</td>
            <td class="num">${entry.gzipBytes ? formatBytes(entry.gzipBytes) : '-'}</td>
            <td class="num">${entry.brotliBytes ? formatBytes(entry.brotliBytes) : '-'}</td>
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
  const entries = await buildReport(manifest);

  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(path.join(reportDir, 'bundle-report.json'), JSON.stringify(entries, null, 2));
  await fs.writeFile(path.join(reportDir, 'bundle-report.html'), renderHtml(entries));

  process.stdout.write('Bundle report generated in /reports\n');
};

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
