import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');
const configPath = path.join(__dirname, 'bundle-budget.config.json');

const readJson = async (filePath) => {
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
};

const readManifest = async () => {
  const viteManifestPath = path.join(distDir, '.vite', 'manifest.json');
  const legacyManifestPath = path.join(distDir, 'manifest.json');

  try {
    return await readJson(viteManifestPath);
  } catch {
    return await readJson(legacyManifestPath);
  }
};

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const formatBytes = (bytes) => {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let next = value;
  while (next >= 1024 && unitIndex < units.length - 1) {
    next /= 1024;
    unitIndex += 1;
  }
  return `${next.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
};

const wildcardToRegExp = (pattern) => {
  const escaped = String(pattern)
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`);
};

const getCompressedSizes = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  return {
    bytes: buffer.byteLength,
    gzipBytes: gzipSync(buffer).byteLength,
    brotliBytes: brotliCompressSync(buffer).byteLength,
  };
};

const collectEntryKeys = (manifest, entryKey, { includeDynamic = false } = {}) => {
  const visited = new Set();
  const stack = [entryKey];

  while (stack.length) {
    const key = stack.pop();
    if (!key) continue;
    if (visited.has(key)) continue;
    visited.add(key);

    const node = manifest[key];
    const imports = node?.imports || [];
    const dynamicImports = includeDynamic ? node?.dynamicImports || [] : [];
    dynamicImports.forEach((next) => stack.push(next));
    imports.forEach((next) => stack.push(next));
  }

  return visited;
};

const pickEntryKey = (manifest, preferredKey) => {
  if (preferredKey && manifest[preferredKey]) return preferredKey;
  const entry = Object.entries(manifest).find(([, value]) => Boolean(value?.isEntry));
  return entry?.[0] || null;
};

const applyChunkBudgets = (rules, fileStats) => {
  const compiled = (Array.isArray(rules) ? rules : []).map((rule) => ({
    ...rule,
    matcher: wildcardToRegExp(rule.match),
  }));

  const failures = [];
  const checked = [];

  Object.entries(fileStats).forEach(([file, stat]) => {
    const rule = compiled.find((item) => item.matcher.test(file));
    if (!rule) return;
    checked.push({ file, rule: rule.match, gzipBytes: stat.gzipBytes, max: rule.gzipBytes });

    if (Number.isFinite(rule.gzipBytes) && stat.gzipBytes > rule.gzipBytes) {
      failures.push({
        file,
        budget: rule.match,
        metric: 'gzipBytes',
        actual: stat.gzipBytes,
        max: rule.gzipBytes,
      });
    }
  });

  return { failures, checked };
};

const main = async () => {
  const config = await readJson(configPath);
  const manifest = await readManifest();

  const entryKey = pickEntryKey(manifest, config.entryKey);
  if (!entryKey) {
    throw new Error('Bundle budget: unable to determine Vite entry key.');
  }

  if (!(await fileExists(distDir))) {
    throw new Error('Bundle budget: dist/ not found. Run build first.');
  }

  const initialKeys = collectEntryKeys(manifest, entryKey, { includeDynamic: false });
  const allKeys = collectEntryKeys(manifest, entryKey, { includeDynamic: true });

  const collectFiles = (keys) => {
    const cssFiles = new Set();
    const jsFiles = new Set();
    const allFiles = new Set();

    keys.forEach((key) => {
      const node = manifest[key];
      const file = node?.file;
      if (file) allFiles.add(file);
      if (file && /\.js$/i.test(file)) jsFiles.add(file);
      (node?.css || []).forEach((css) => cssFiles.add(css));
      (node?.assets || []).forEach((asset) => allFiles.add(asset));
    });

    cssFiles.forEach((file) => allFiles.add(file));

    return { cssFiles, jsFiles, allFiles };
  };

  const initialFiles = collectFiles(initialKeys);
  const allFiles = collectFiles(allKeys);

  const fileStats = {};
  for (const file of allFiles.allFiles) {
    const filePath = path.join(distDir, file);
    if (!(await fileExists(filePath))) continue;
    fileStats[file] = await getCompressedSizes(filePath);
  }

  const sum = (files, selector) =>
    Array.from(files).reduce((acc, file) => acc + (fileStats[file]?.[selector] || 0), 0);

  const initialJsGzip = sum(initialFiles.jsFiles, 'gzipBytes');
  const initialCssGzip = sum(initialFiles.cssFiles, 'gzipBytes');
  const initialTotalGzip = initialJsGzip + initialCssGzip;

  const failures = [];
  const budgets = config?.budgets || {};
  const initialBudget = budgets.initial || {};

  if (Number.isFinite(initialBudget.jsGzipBytes) && initialJsGzip > initialBudget.jsGzipBytes) {
    failures.push({
      metric: 'initial.js.gzipBytes',
      actual: initialJsGzip,
      max: initialBudget.jsGzipBytes,
    });
  }
  if (Number.isFinite(initialBudget.cssGzipBytes) && initialCssGzip > initialBudget.cssGzipBytes) {
    failures.push({
      metric: 'initial.css.gzipBytes',
      actual: initialCssGzip,
      max: initialBudget.cssGzipBytes,
    });
  }
  if (
    Number.isFinite(initialBudget.totalGzipBytes) &&
    initialTotalGzip > initialBudget.totalGzipBytes
  ) {
    failures.push({
      metric: 'initial.total.gzipBytes',
      actual: initialTotalGzip,
      max: initialBudget.totalGzipBytes,
    });
  }

  const chunkCheck = applyChunkBudgets(budgets.chunks, fileStats);
  failures.push(...chunkCheck.failures);

  process.stdout.write(
    [
      '[bundle-budget] entry:',
      entryKey,
      `initial js(gzip): ${formatBytes(initialJsGzip)}`,
      `css(gzip): ${formatBytes(initialCssGzip)}`,
      `total(gzip): ${formatBytes(initialTotalGzip)}`,
      '',
    ].join(' '),
  );
  process.stdout.write('\n');

  if (failures.length === 0) {
    process.stdout.write('[bundle-budget] ✅ within budgets\n');
    return;
  }

  process.stdout.write('[bundle-budget] ❌ budget exceeded:\n');
  failures.forEach((item) => {
    const label = item.file ? `${item.file} (${item.budget})` : item.metric;
    process.stdout.write(`  - ${label}: ${formatBytes(item.actual)} > ${formatBytes(item.max)}\n`);
  });

  process.exitCode = 1;
};

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
