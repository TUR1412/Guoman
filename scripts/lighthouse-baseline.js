import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const reportDir = path.join(repoRoot, 'reports');

const LIGHTHOUSE_VERSION = '12.8.2';
const DEFAULT_URL = 'https://tur1412.github.io/Guoman/';
const DEFAULT_PRESET = 'desktop';

const toPercent = (score) =>
  typeof score === 'number' && Number.isFinite(score) ? Math.round(score * 100) : null;

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const parseArgs = (argv) => {
  const options = {
    url: DEFAULT_URL,
    preset: DEFAULT_PRESET,
    mode: 'remote',
    host: '127.0.0.1',
    port: 4173,
    html: true,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg) continue;

    if (arg === '--url' && argv[index + 1]) {
      options.url = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg.startsWith('--url=')) {
      options.url = arg.slice('--url='.length);
      continue;
    }

    if (arg === '--preset' && argv[index + 1]) {
      options.preset = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg.startsWith('--preset=')) {
      options.preset = arg.slice('--preset='.length);
      continue;
    }

    if (arg === '--local') {
      options.mode = 'local';
      continue;
    }
    if (arg === '--remote') {
      options.mode = 'remote';
      continue;
    }

    if (arg === '--host' && argv[index + 1]) {
      options.host = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg.startsWith('--host=')) {
      options.host = arg.slice('--host='.length);
      continue;
    }

    if (arg === '--port' && argv[index + 1]) {
      options.port = Number(argv[index + 1]) || options.port;
      index += 1;
      continue;
    }
    if (arg.startsWith('--port=')) {
      options.port = Number(arg.slice('--port='.length)) || options.port;
      continue;
    }

    if (arg === '--no-html') {
      options.html = false;
      continue;
    }
  }

  return options;
};

const resolveChromePath = async () => {
  const envPath = process.env.LIGHTHOUSE_CHROME_PATH;
  if (envPath && (await fileExists(envPath))) return envPath;

  const chromeCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];

  for (const candidate of chromeCandidates) {
    if (await fileExists(candidate)) return candidate;
  }

  if (process.platform !== 'win32') return null;

  const edgeCandidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];

  for (const candidate of edgeCandidates) {
    if (await fileExists(candidate)) return candidate;
  }

  return null;
};

const runProcess = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || repoRoot,
      env: options.env || process.env,
      stdio: options.stdio || 'inherit',
      windowsHide: true,
    });

    child.on('error', (error) => reject(error));
    child.on('close', (code) => {
      if (code === 0) resolve({ code });
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });

const waitForUrl = async (url, { timeoutMs = 30000 } = {}) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt <= timeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'follow' });
      if (response.ok) return true;
    } catch {
      // ignore and retry
    }

    await delay(300);
  }

  return false;
};

const getNpxCommand = () => (process.platform === 'win32' ? 'npx.cmd' : 'npx');

const runLighthouse = async ({ url, preset, chromePath, output, outputPath }) => {
  const npx = getNpxCommand();
  const args = [
    '-y',
    `lighthouse@${LIGHTHOUSE_VERSION}`,
    url,
    '--preset',
    preset,
    '--only-categories',
    'performance,accessibility,best-practices,seo',
    '--output',
    output,
    '--output-path',
    outputPath,
    '--quiet',
    '--chrome-flags',
    '--headless --disable-gpu --no-sandbox',
  ];

  if (chromePath) {
    args.push('--chrome-path', chromePath);
  }

  await runProcess(npx, args, { cwd: repoRoot, stdio: 'inherit' });
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));

  await fs.mkdir(reportDir, { recursive: true });

  const chromePath = await resolveChromePath();

  let targetUrl = options.url;
  let previewProcess = null;

  if (options.mode === 'local') {
    process.stdout.write('[lighthouse] local mode: building...\n');
    await runProcess('npm', ['run', 'build'], { cwd: repoRoot, stdio: 'inherit' });

    process.stdout.write('[lighthouse] local mode: starting preview server...\n');
    previewProcess = spawn(
      'npm',
      [
        'run',
        'preview',
        '--',
        '--host',
        options.host,
        '--port',
        String(options.port),
        '--strictPort',
      ],
      { cwd: repoRoot, env: process.env, stdio: 'inherit', windowsHide: true },
    );

    targetUrl = `http://${options.host}:${options.port}/Guoman/`;
    const ready = await waitForUrl(targetUrl, { timeoutMs: 45000 });
    if (!ready) {
      try {
        previewProcess.kill();
      } catch {}
      throw new Error(`[lighthouse] preview server not reachable: ${targetUrl}`);
    }
  } else if (!chromePath && process.platform === 'win32') {
    process.stdout.write(
      [
        '[lighthouse] ⚠️ 未检测到可用浏览器路径。',
        '建议安装 Chrome，或设置环境变量 LIGHTHOUSE_CHROME_PATH 指向 Edge/Chrome 可执行文件。',
        '示例（Windows PowerShell）：',
        '  $env:LIGHTHOUSE_CHROME_PATH="C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"',
        '',
      ].join('\n'),
    );
  }

  const reportJsonPath = path.join(reportDir, 'lighthouse-report.json');
  const reportHtmlPath = path.join(reportDir, 'lighthouse-report.html');
  const baselinePath = path.join(reportDir, 'lighthouse-baseline.json');

  try {
    process.stdout.write(`[lighthouse] running (json) → ${targetUrl}\n`);
    await runLighthouse({
      url: targetUrl,
      preset: options.preset,
      chromePath,
      output: 'json',
      outputPath: reportJsonPath,
    });

    if (options.html) {
      process.stdout.write(`[lighthouse] running (html) → ${targetUrl}\n`);
      await runLighthouse({
        url: targetUrl,
        preset: options.preset,
        chromePath,
        output: 'html',
        outputPath: reportHtmlPath,
      });
    }

    const lhrRaw = await fs.readFile(reportJsonPath, 'utf-8');
    const lhr = JSON.parse(lhrRaw);

    const baseline = {
      generatedAt: new Date().toISOString(),
      url: targetUrl,
      preset: options.preset,
      mode: options.mode,
      metrics: {
        performance: toPercent(lhr?.categories?.performance?.score),
        accessibility: toPercent(lhr?.categories?.accessibility?.score),
        bestPractices: toPercent(lhr?.categories?.['best-practices']?.score),
        seo: toPercent(lhr?.categories?.seo?.score),
      },
      meta: {
        lighthouseVersion: lhr?.lighthouseVersion || null,
        fetchTime: lhr?.fetchTime || null,
        userAgent: lhr?.userAgent || null,
      },
      artifacts: {
        reportJson: path.relative(repoRoot, reportJsonPath),
        reportHtml: options.html ? path.relative(repoRoot, reportHtmlPath) : null,
      },
    };

    await fs.writeFile(baselinePath, JSON.stringify(baseline, null, 2));

    process.stdout.write('[lighthouse] ✅ baseline generated:\n');
    process.stdout.write(`- ${path.relative(repoRoot, baselinePath)}\n`);
    process.stdout.write(`- ${path.relative(repoRoot, reportJsonPath)}\n`);
    if (options.html) process.stdout.write(`- ${path.relative(repoRoot, reportHtmlPath)}\n`);
  } finally {
    if (previewProcess) {
      try {
        previewProcess.kill();
      } catch {}
    }
  }
};

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
