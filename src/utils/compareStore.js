import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';
import { safeJsonParse } from './json';

const STORAGE_KEY = STORAGE_KEYS.compareList;
const MAX_COMPARE = 2;

const normalizeId = (value) => {
  const id = Number(value);
  if (!Number.isFinite(id)) return null;
  if (id <= 0) return null;
  return id;
};

const readList = () => {
  const raw = hasPendingStorageWrite(STORAGE_KEY)
    ? getPendingStorageWriteValue(STORAGE_KEY)
    : safeLocalStorageGet(STORAGE_KEY);

  const parsed = safeJsonParse(raw, []);
  if (!Array.isArray(parsed)) return [];

  const normalized = parsed.map(normalizeId).filter(Boolean);
  return Array.from(new Set(normalized)).slice(0, MAX_COMPARE);
};

const writeList = (list) => {
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify((list || []).slice(0, MAX_COMPARE)));
};

export const getCompareList = () => readList();

export const setCompareList = (next) => {
  const normalized = Array.isArray(next) ? next.map(normalizeId).filter(Boolean) : [];
  writeList(Array.from(new Set(normalized)).slice(0, MAX_COMPARE));
};

export const toggleCompare = (animeId) => {
  const id = normalizeId(animeId);
  if (!id) return { list: readList(), changed: false };

  const current = readList();
  if (current.includes(id)) {
    const next = current.filter((item) => item !== id);
    writeList(next);
    return { list: next, changed: true, action: 'remove' };
  }

  const next = [...current, id].slice(-MAX_COMPARE);
  writeList(next);
  return { list: next, changed: true, action: 'add' };
};

export const clearCompareList = () => {
  writeList([]);
};

export const COMPARE_STORAGE_KEY = STORAGE_KEY;
