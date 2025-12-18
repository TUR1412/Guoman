import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..');
const publicDir = path.join(repoRoot, 'public');

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf-8'));

const normalizeHomepage = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  const trimmed = value.trim().replace(/\/+$/, '');

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  return url.toString().replace(/\/+$/, '');
};

const formatDate = (date) => date.toISOString().slice(0, 10);

const buildRobotsTxt = (homepage) => {
  const sitemap = `${homepage}/sitemap.xml`;
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
};

const buildSitemapXml = ({ homepage, lastmod, routes }) => {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  routes.forEach((route) => {
    const loc = `${homepage}${route.path}`;
    lines.push('  <url>');
    lines.push(`    <loc>${loc}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push(`    <changefreq>${route.changefreq}</changefreq>`);
    lines.push(`    <priority>${route.priority}</priority>`);
    lines.push('  </url>');
  });

  lines.push('</urlset>');
  lines.push('');
  return lines.join('\n');
};

const main = async () => {
  const pkg = await readJson(path.join(repoRoot, 'package.json'));
  const homepage = normalizeHomepage(pkg.homepage);
  if (!homepage) {
    throw new Error('package.json 缺少有效的 homepage（需要 http/https URL）');
  }

  const lastmod = formatDate(new Date());

  const routes = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/#/', changefreq: 'weekly', priority: '0.9' },
    { path: '/#/recommendations', changefreq: 'weekly', priority: '0.8' },
    { path: '/#/rankings', changefreq: 'weekly', priority: '0.8' },
    { path: '/#/news', changefreq: 'weekly', priority: '0.7' },
    { path: '/#/favorites', changefreq: 'weekly', priority: '0.7' },
    { path: '/#/search', changefreq: 'weekly', priority: '0.6' },
    { path: '/#/about', changefreq: 'monthly', priority: '0.6' },

    { path: '/#/help', changefreq: 'monthly', priority: '0.4' },
    { path: '/#/faq', changefreq: 'monthly', priority: '0.4' },
    { path: '/#/contact', changefreq: 'monthly', priority: '0.4' },
    { path: '/#/feedback', changefreq: 'monthly', priority: '0.4' },
    { path: '/#/app', changefreq: 'monthly', priority: '0.4' },

    { path: '/#/terms', changefreq: 'yearly', priority: '0.3' },
    { path: '/#/privacy', changefreq: 'yearly', priority: '0.3' },
    { path: '/#/cookies', changefreq: 'yearly', priority: '0.2' },
    { path: '/#/accessibility', changefreq: 'yearly', priority: '0.2' },
  ];

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

