export const normalizeHomepage = (value) => {
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

export const formatDate = (date) => date.toISOString().slice(0, 10);

export const buildRobotsTxt = (homepage) => {
  const sitemap = `${homepage}/sitemap.xml`;
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`;
};

export const getDefaultSitemapRoutes = ({ animeIds = [], tags = [], categorySlugs = [] } = {}) => [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/#/', changefreq: 'weekly', priority: '0.9' },
  { path: '/#/recommendations', changefreq: 'weekly', priority: '0.8' },
  { path: '/#/rankings', changefreq: 'weekly', priority: '0.8' },
  { path: '/#/news', changefreq: 'weekly', priority: '0.7' },
  { path: '/#/favorites', changefreq: 'weekly', priority: '0.7' },
  { path: '/#/following', changefreq: 'weekly', priority: '0.65' },
  { path: '/#/pro', changefreq: 'monthly', priority: '0.55' },
  { path: '/#/insights', changefreq: 'monthly', priority: '0.55' },
  { path: '/#/posters', changefreq: 'monthly', priority: '0.55' },
  { path: '/#/achievements', changefreq: 'monthly', priority: '0.55' },
  { path: '/#/search', changefreq: 'weekly', priority: '0.6' },
  { path: '/#/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/#/profile', changefreq: 'monthly', priority: '0.5' },

  { path: '/#/help', changefreq: 'monthly', priority: '0.4' },
  { path: '/#/faq', changefreq: 'monthly', priority: '0.4' },
  { path: '/#/contact', changefreq: 'monthly', priority: '0.4' },
  { path: '/#/feedback', changefreq: 'monthly', priority: '0.4' },
  { path: '/#/app', changefreq: 'monthly', priority: '0.4' },

  { path: '/#/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/#/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/#/cookies', changefreq: 'yearly', priority: '0.2' },
  { path: '/#/accessibility', changefreq: 'yearly', priority: '0.2' },
  ...animeIds.map((id) => ({
    path: `/#/anime/${id}`,
    changefreq: 'monthly',
    priority: '0.5',
  })),
  ...tags.map((tag) => ({
    path: `/#/tag/${encodeURIComponent(tag)}`,
    changefreq: 'monthly',
    priority: '0.4',
  })),
  ...categorySlugs.map((slug) => ({
    path: `/#/category/${slug}`,
    changefreq: 'monthly',
    priority: '0.4',
  })),
];

export const buildSitemapXml = ({ homepage, lastmod, routes }) => {
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
