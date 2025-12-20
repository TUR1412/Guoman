import { useEffect } from 'react';

const FALLBACK_TITLE = '国漫世界';

let cachedDefaults = null;

const getDefaultMeta = () => {
  if (cachedDefaults) return cachedDefaults;
  if (typeof document === 'undefined') {
    cachedDefaults = { title: FALLBACK_TITLE, description: '' };
    return cachedDefaults;
  }

  const meta = document.querySelector('meta[name="description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const ogType = document.querySelector('meta[property="og:type"]');
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  cachedDefaults = {
    title: document.title || FALLBACK_TITLE,
    description: meta?.getAttribute('content') || '',
    image: ogImage?.getAttribute('content') || twitterImage?.getAttribute('content') || '',
    type: ogType?.getAttribute('content') || 'website',
  };
  return cachedDefaults;
};

const upsertMeta = ({ attr = 'name', key, value }) => {
  if (!value || typeof document === 'undefined') return;
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
};

const updateStructuredData = (entries) => {
  if (typeof document === 'undefined') return;
  const id = 'guoman-structured-data';
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(entries, null, 2);
};

export const usePageMeta = ({ title, description, image, type, structuredData } = {}) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const defaults = getDefaultMeta();
    const baseTitle = defaults.title || FALLBACK_TITLE;
    const nextTitle = title ? `${title} · ${baseTitle}` : baseTitle;
    const nextDescription = description || defaults.description;
    const nextImage = image || defaults.image;
    const nextType = type || defaults.type || 'website';

    document.title = nextTitle;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      if (nextDescription) {
        meta.setAttribute('content', nextDescription);
      }
    }

    upsertMeta({ attr: 'property', key: 'og:title', value: nextTitle });
    upsertMeta({ attr: 'property', key: 'og:description', value: nextDescription });
    upsertMeta({ attr: 'property', key: 'og:type', value: nextType });
    upsertMeta({ attr: 'property', key: 'og:url', value: window.location.href });
    if (nextImage) {
      upsertMeta({ attr: 'property', key: 'og:image', value: nextImage });
      upsertMeta({ attr: 'name', key: 'twitter:image', value: nextImage });
    }

    upsertMeta({ attr: 'name', key: 'twitter:title', value: nextTitle });
    upsertMeta({ attr: 'name', key: 'twitter:description', value: nextDescription });

    const baseStructured = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: baseTitle,
        url: window.location.origin,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${window.location.origin}/#/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: baseTitle,
        url: window.location.origin,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: nextTitle,
        description: nextDescription,
        url: window.location.href,
      },
    ];

    if (structuredData) {
      const extra = Array.isArray(structuredData) ? structuredData : [structuredData];
      updateStructuredData([...baseStructured, ...extra.filter(Boolean)]);
    } else {
      updateStructuredData(baseStructured);
    }
  }, [title, description, image, type, structuredData]);
};
