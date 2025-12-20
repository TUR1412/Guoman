import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';

const CACHE_KEY = STORAGE_KEYS.searchCache;
const TTL = 1000 * 60 * 60 * 24;

const readCache = () => {
  const raw = safeLocalStorageGet(CACHE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const getCachedSearch = (query) => {
  if (!query) return null;
  const cache = readCache();
  const entry = cache[query];
  if (!entry) return null;
  if (Date.now() - entry.at > TTL) return null;
  return Array.isArray(entry.ids) ? entry.ids : null;
};

export const setCachedSearch = (query, ids) => {
  if (!query) return;
  const cache = readCache();
  cache[query] = { ids, at: Date.now() };
  scheduleStorageWrite(CACHE_KEY, JSON.stringify(cache));
};

export const clearSearchCache = () => {
  scheduleStorageWrite(CACHE_KEY, JSON.stringify({}));
};
