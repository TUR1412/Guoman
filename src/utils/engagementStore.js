import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';

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

const writeList = (key, list) => {
  scheduleStorageWrite(key, JSON.stringify(list));
};

export const recordPlay = ({ animeId, title, platform }) => {
  if (!animeId) return null;
  const list = readList(STORAGE_KEYS.playHistory);
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    animeId,
    title,
    platform: platform || '',
    createdAt: Date.now(),
  };
  writeList(STORAGE_KEYS.playHistory, [entry, ...list].slice(0, 50));
  return entry;
};

export const recordDownload = ({ animeId, title }) => {
  if (!animeId) return null;
  const list = readList(STORAGE_KEYS.downloadHistory);
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    animeId,
    title,
    createdAt: Date.now(),
  };
  writeList(STORAGE_KEYS.downloadHistory, [entry, ...list].slice(0, 50));
  return entry;
};

export const getPlayHistory = () => readList(STORAGE_KEYS.playHistory);
export const getDownloadHistory = () => readList(STORAGE_KEYS.downloadHistory);

export const clearEngagementHistory = () => {
  writeList(STORAGE_KEYS.playHistory, []);
  writeList(STORAGE_KEYS.downloadHistory, []);
};
