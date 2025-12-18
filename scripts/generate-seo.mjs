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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const publicDir = path.join(repoRoot, 'public');

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf-8'));

const main = async () => {
  const pkg = await readJson(path.join(repoRoot, 'package.json'));
  const homepage = normalizeHomepage(pkg.homepage);
  if (!homepage) {
    throw new Error('package.json 缺少有效的 homepage（需要 http/https URL）');
  }

  const lastmod = formatDate(new Date());
  const routes = getDefaultSitemapRoutes();

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
