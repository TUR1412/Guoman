import { describe, expect, it } from 'vitest';
import { buildRobotsTxt, buildSitemapXml, formatDate, normalizeHomepage } from './seo';

describe('seo helpers', () => {
  it('normalizeHomepage trims and removes trailing slash', () => {
    expect(normalizeHomepage('https://example.com/site/')).toBe('https://example.com/site');
    expect(normalizeHomepage(' https://example.com ')).toBe('https://example.com');
  });

  it('normalizeHomepage rejects invalid values', () => {
    expect(normalizeHomepage('')).toBeNull();
    expect(normalizeHomepage('not-a-url')).toBeNull();
    expect(normalizeHomepage('ftp://example.com')).toBeNull();
  });

  it('formatDate returns yyyy-mm-dd', () => {
    expect(formatDate(new Date('2025-12-18T12:34:56Z'))).toBe('2025-12-18');
  });

  it('buildRobotsTxt points to sitemap.xml', () => {
    const robots = buildRobotsTxt('https://example.com/site');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Sitemap: https://example.com/site/sitemap.xml');
  });

  it('buildSitemapXml builds loc from homepage + path', () => {
    const xml = buildSitemapXml({
      homepage: 'https://example.com/site',
      lastmod: '2025-12-18',
      routes: [{ path: '/#/', changefreq: 'weekly', priority: '0.9' }],
    });

    expect(xml).toContain('<loc>https://example.com/site/#/</loc>');
    expect(xml).toContain('<lastmod>2025-12-18</lastmod>');
  });
});

