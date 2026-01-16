import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';
import { safeJsonParse } from './json';

const STORAGE_KEY = STORAGE_KEYS.pinnedTags;
const MAX_TAGS = 18;

const normalizeTag = (value) =>
  String(value || '')
    .trim()
    .slice(0, 24);

const readPinnedTags = () => {
  const raw = hasPendingStorageWrite(STORAGE_KEY)
    ? getPendingStorageWriteValue(STORAGE_KEY)
    : safeLocalStorageGet(STORAGE_KEY);
  const parsed = safeJsonParse(raw, []);
  if (!Array.isArray(parsed)) return [];
  return Array.from(new Set(parsed.map(normalizeTag).filter(Boolean))).slice(0, MAX_TAGS);
};

const writePinnedTags = (tags) => {
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify((tags || []).slice(0, MAX_TAGS)));
};

export const getPinnedTags = () => readPinnedTags();

export const togglePinnedTag = (tag) => {
  const normalized = normalizeTag(tag);
  if (!normalized) return { tags: readPinnedTags(), changed: false };

  const current = readPinnedTags();
  if (current.includes(normalized)) {
    const next = current.filter((item) => item !== normalized);
    writePinnedTags(next);
    return { tags: next, changed: true, pinned: false };
  }

  const next = [normalized, ...current].slice(0, MAX_TAGS);
  writePinnedTags(next);
  return { tags: next, changed: true, pinned: true };
};

export const clearPinnedTags = () => {
  writePinnedTags([]);
};

export const PINNED_TAGS_STORAGE_KEY = STORAGE_KEY;
