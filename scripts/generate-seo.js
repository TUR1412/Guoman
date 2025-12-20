import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildRobotsTxt,
  buildSitemapXml,
  formatDate,
  getDefaultSitemapRoutes,
  normalizeHomepage,
} from './seo.js';
const CATEGORY_SLUGS = ['action', 'fantasy', 'ancient', 'scifi', 'comedy'];
const TAGS = ['热血', '古风', '玄幻', '科幻', '奇幻', '仙侠', '武侠', '悬疑', '推理', '冒险', '搞笑'];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const publicDir = path.join(repoRoot, 'public');

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf-8'));

const getStableLastmod = () => {
  const sourceDateEpoch = process.env.SOURCE_DATE_EPOCH;
  if (typeof sourceDateEpoch === 'string' && /^\d+$/.test(sourceDateEpoch)) {
    const epochMs = Number(sourceDateEpoch) * 1000;
    if (Number.isFinite(epochMs)) return formatDate(new Date(epochMs));
  }

  try {
    const iso = String(
      execFileSync('git', ['log', '-1', '--format=%cI'], {
        cwd: repoRoot,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }),
    ).trim();

    if (iso) return iso.slice(0, 10);
  } catch {}

  return formatDate(new Date());
};

const main = async () => {
  const pkg = await readJson(path.join(repoRoot, 'package.json'));
  const homepage = normalizeHomepage(pkg.homepage);
  if (!homepage) {
    throw new Error('package.json 缺少有效的 homepage（需要 http/https URL）');
  }

  const lastmod = getStableLastmod();
  const animeIds = Array.from({ length: 12 }, (_, idx) => idx + 1);
  const tags = TAGS;
  const routes = getDefaultSitemapRoutes({
    animeIds,
    tags,
    categorySlugs: CATEGORY_SLUGS,
  });

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(path.join(publicDir, 'robots.txt'), buildRobotsTxt(homepage), 'utf-8');
  await fs.writeFile(
    path.join(publicDir, 'sitemap.xml'),
    buildSitemapXml({ homepage, lastmod, routes }),
    'utf-8',
  );

  process.stdout.write(`Generated robots.txt + sitemap.xml for: ${homepage}\n`);
};

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
  process.exitCode = 1;
});
