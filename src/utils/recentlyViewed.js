import { safeLocalStorageGet, safeLocalStorageSet } from './storage';

const STORAGE_KEY = 'guoman.recent.v1';
const MAX_ITEMS = 12;

const normalizeId = (value) => {
  const id = Number(value);
  if (!Number.isFinite(id)) return null;
  if (!Number.isInteger(id)) return null;
  if (id <= 0) return null;
  return id;
};

const readIds = () => {
  if (typeof window === 'undefined') return [];

  const raw = safeLocalStorageGet(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeId).filter(Boolean);
  } catch {
    return [];
  }
};

export const getRecentlyViewed = () => readIds();

export const recordRecentlyViewed = (id, { maxItems = MAX_ITEMS } = {}) => {
  const normalized = normalizeId(id);
  if (normalized === null) return readIds();

  const current = readIds();
  const next = [normalized, ...current.filter((item) => item !== normalized)].slice(0, maxItems);

  safeLocalStorageSet(STORAGE_KEY, JSON.stringify(next));
  return next;
};

export const clearRecentlyViewed = () => {
  safeLocalStorageSet(STORAGE_KEY, JSON.stringify([]));
};

export const RECENTLY_VIEWED_STORAGE_KEY = STORAGE_KEY;
