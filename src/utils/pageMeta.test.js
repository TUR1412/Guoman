import React from 'react';
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const loadUsePageMeta = async () => {
  vi.resetModules();
  const mod = await import('./pageMeta');
  return mod.usePageMeta;
};

afterEach(() => {
  document.head.innerHTML = '';
  document.title = '';
  vi.restoreAllMocks();
});

describe('pageMeta', () => {
  it('updates document title and description', async () => {
    const usePageMeta = await loadUsePageMeta();
    document.title = '国漫世界';

    const meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', '默认描述');
    document.head.appendChild(meta);

    function MetaTester({ title, description }) {
      usePageMeta({ title, description });
      return null;
    }

    render(React.createElement(MetaTester, { title: '搜索', description: '搜索页描述' }));

    expect(document.title).toBe('搜索 · 国漫世界');
    expect(meta.getAttribute('content')).toBe('搜索页描述');
  });

  it('creates og/twitter meta tags and structured data', async () => {
    const usePageMeta = await loadUsePageMeta();
    document.title = '国漫世界';

    render(
      React.createElement(() => {
        usePageMeta({
          title: '详情',
          description: '描述',
          image: 'https://example.com/a.png',
          type: 'article',
          structuredData: { '@context': 'https://schema.org', '@type': 'Thing', name: 'X' },
        });
        return null;
      }),
    );

    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toContain(
      '详情 ·',
    );
    expect(document.querySelector('meta[property="og:description"]')?.getAttribute('content')).toBe(
      '描述',
    );
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      'article',
    );
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://example.com/a.png',
    );
    expect(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(
      'https://example.com/a.png',
    );

    const script = document.getElementById('guoman-structured-data');
    expect(script).toBeTruthy();
    expect(script.textContent).toContain('"@type": "WebSite"');
    expect(script.textContent).toContain('"@type": "Thing"');
  });

  it('skips optional meta when description/image are empty', async () => {
    const usePageMeta = await loadUsePageMeta();
    document.title = '国漫世界';

    render(
      React.createElement(() => {
        usePageMeta({ title: '空态', description: '', image: '' });
        return null;
      }),
    );

    // no description meta tag exists -> should not be created by description branch
    expect(document.querySelector('meta[name="description"]')).toBeNull();
    // og:image should not be created when image is falsy
    expect(document.querySelector('meta[property="og:image"]')).toBeNull();
    // structured data still exists (base)
    expect(document.getElementById('guoman-structured-data')).toBeTruthy();
  });

  it('uses defaults from existing twitter:image + og:type when props are omitted', async () => {
    const usePageMeta = await loadUsePageMeta();
    document.title = '国漫世界';

    const description = document.createElement('meta');
    description.setAttribute('name', 'description');
    description.setAttribute('content', '默认描述');
    document.head.appendChild(description);

    const twitterImage = document.createElement('meta');
    twitterImage.setAttribute('name', 'twitter:image');
    twitterImage.setAttribute('content', 'https://example.com/t.png');
    document.head.appendChild(twitterImage);

    const ogType = document.createElement('meta');
    ogType.setAttribute('property', 'og:type');
    ogType.setAttribute('content', 'article');
    document.head.appendChild(ogType);

    render(
      React.createElement(() => {
        usePageMeta({ title: '默认透传' });
        return null;
      }),
    );

    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe(
      'article',
    );
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://example.com/t.png',
    );
    expect(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(
      'https://example.com/t.png',
    );
  });

  it('does not overwrite description meta when nextDescription is empty', async () => {
    const usePageMeta = await loadUsePageMeta();
    document.title = '国漫世界';

    const meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', 'keep');
    document.head.appendChild(meta);

    render(
      React.createElement(() => {
        usePageMeta({ title: 'T', description: '' });
        return null;
      }),
    );

    expect(meta.getAttribute('content')).toBe('keep');
  });

  it('uses defaults from og:image and tolerates missing description content', async () => {
    const usePageMeta = await loadUsePageMeta();
    document.title = '国漫世界';

    const meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);

    const ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.setAttribute('content', 'https://example.com/o.png');
    document.head.appendChild(ogImage);

    render(
      React.createElement(() => {
        usePageMeta({ title: 'OG 默认图' });
        return null;
      }),
    );

    // should create twitter:image from defaults.image
    expect(document.querySelector('meta[name="twitter:image"]')?.getAttribute('content')).toBe(
      'https://example.com/o.png',
    );
    // missing description content should remain untouched when nextDescription is empty
    expect(meta.getAttribute('content')).toBeNull();
  });

  it('uses base title when title prop is missing (and falls back when document.title is empty)', async () => {
    const usePageMeta = await loadUsePageMeta();
    document.title = '';

    render(
      React.createElement(() => {
        usePageMeta();
        return null;
      }),
    );

    expect(document.title).toBe('国漫世界');
  });

  it('accepts structuredData array and filters falsy entries', async () => {
    const usePageMeta = await loadUsePageMeta();
    document.title = '国漫世界';

    render(
      React.createElement(() => {
        usePageMeta({
          title: '数组',
          description: 'd',
          structuredData: [null, { '@context': 'https://schema.org', '@type': 'Thing', name: 'Y' }],
        });
        return null;
      }),
    );

    const script = document.getElementById('guoman-structured-data');
    expect(script.textContent).toContain('"@type": "Thing"');
    expect(script.textContent).toContain('"name": "Y"');
  });

  it('reuses cached defaults and updates existing meta/script nodes', async () => {
    vi.resetModules();
    const { usePageMeta } = await import('./pageMeta');
    document.title = '国漫世界';

    function Wrapper({ title, description, image }) {
      usePageMeta({ title, description, image });
      return null;
    }

    const view = render(
      React.createElement(Wrapper, {
        title: 'A',
        description: 'd1',
        image: 'https://example.com/1.png',
      }),
    );

    const script1 = document.getElementById('guoman-structured-data');
    const ogTitle1 = document.querySelector('meta[property="og:title"]');
    expect(script1).toBeTruthy();
    expect(ogTitle1).toBeTruthy();

    // change title externally; cachedDefaults should keep base title stable
    document.title = '外部改写';
    view.rerender(
      React.createElement(Wrapper, {
        title: 'B',
        description: 'd2',
        image: 'https://example.com/2.png',
      }),
    );

    const script2 = document.getElementById('guoman-structured-data');
    const ogTitle2 = document.querySelector('meta[property="og:title"]');
    expect(script2).toBe(script1);
    expect(ogTitle2).toBe(ogTitle1);
    expect(document.title).toContain('B · 国漫世界');
  });
});
