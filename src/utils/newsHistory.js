import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';

const STORAGE_KEY = STORAGE_KEYS.newsHistory;

const readStore = () => {
  const raw = safeLocalStorageGet(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const recordNewsRead = ({ id, title }) => {
  if (!id) return null;
  const list = readStore();
  const entry = {
    id,
    title: title || '',
    readAt: Date.now(),
  };
  const next = [entry, ...list.filter((item) => item.id !== id)].slice(0, 50);
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify(next));
  return entry;
};

export const getNewsHistory = () => readStore();

export const clearNewsHistory = () => {
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify([]));
};
