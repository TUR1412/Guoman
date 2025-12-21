import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';

const STORAGE_KEY = STORAGE_KEYS.recentlyViewed;
const MAX_ITEMS = 12;

const normalizeId = (value) => {
  const id = Number(value);
  if (!Number.isFinite(id)) return null;
  if (!Number.isInteger(id)) return null;
  if (id <= 0) return null;
  return id;
};

let cachedIds = null;
let cachedRaw = null;

const readIds = () => {
  if (typeof window === 'undefined') return [];
  const raw = hasPendingStorageWrite(STORAGE_KEY)
    ? getPendingStorageWriteValue(STORAGE_KEY)
    : safeLocalStorageGet(STORAGE_KEY);
  if (!raw) {
    if (cachedIds && cachedRaw !== null && hasPendingStorageWrite(STORAGE_KEY)) {
      return cachedIds;
    }
    cachedIds = [];
    cachedRaw = null;
    return cachedIds;
  }

  if (cachedIds && cachedRaw === raw) return cachedIds;

  try {
    const parsed = JSON.parse(raw);
    cachedIds = Array.isArray(parsed) ? parsed.map(normalizeId).filter(Boolean) : [];
    cachedRaw = raw;
    return cachedIds;
  } catch {
    cachedIds = [];
    cachedRaw = null;
    return cachedIds;
  }
};

export const getRecentlyViewed = () => readIds();

export const recordRecentlyViewed = (id, { maxItems = MAX_ITEMS } = {}) => {
  const normalized = normalizeId(id);
  if (normalized === null) return readIds();

  const current = readIds();
  const next = [normalized, ...current.filter((item) => item !== normalized)].slice(0, maxItems);

  cachedIds = next;
  cachedRaw = JSON.stringify(next);
  scheduleStorageWrite(STORAGE_KEY, cachedRaw);
  return next;
};

export const clearRecentlyViewed = () => {
  cachedIds = [];
  cachedRaw = JSON.stringify([]);
  scheduleStorageWrite(STORAGE_KEY, cachedRaw);
};

export const RECENTLY_VIEWED_STORAGE_KEY = STORAGE_KEY;
