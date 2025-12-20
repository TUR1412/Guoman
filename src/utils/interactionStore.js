import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';

const readList = (key) => {
  const raw = safeLocalStorageGet(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const recordInteraction = (key, payload, limit = 50) => {
  if (!key) return null;
  const list = readList(key);
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    payload,
    at: Date.now(),
  };
  scheduleStorageWrite(key, JSON.stringify([entry, ...list].slice(0, limit)));
  return entry;
};

export const getInteractions = (key) => readList(key);
