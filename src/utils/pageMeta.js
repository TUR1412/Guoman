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
  cachedDefaults = {
    title: document.title || FALLBACK_TITLE,
    description: meta?.getAttribute('content') || '',
  };
  return cachedDefaults;
};

export const usePageMeta = ({ title, description } = {}) => {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const defaults = getDefaultMeta();
    const baseTitle = defaults.title || FALLBACK_TITLE;
    const nextTitle = title ? `${title} · ${baseTitle}` : baseTitle;

    document.title = nextTitle;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      const nextDescription = description || defaults.description;
      if (nextDescription) {
        meta.setAttribute('content', nextDescription);
      }
    }
  }, [title, description]);
};
