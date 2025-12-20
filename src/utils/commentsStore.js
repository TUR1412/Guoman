import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';

const STORAGE_KEY = STORAGE_KEYS.comments;

const readStore = () => {
  const raw = safeLocalStorageGet(STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeStore = (payload) => {
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify(payload));
};

export const getCommentsForAnime = (animeId) => {
  const store = readStore();
  return Array.isArray(store[animeId]) ? store[animeId] : [];
};

export const addComment = ({ animeId, user, comment, rating }) => {
  if (!animeId || !comment) return null;
  const store = readStore();
  const list = Array.isArray(store[animeId]) ? store[animeId] : [];
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    user: user || '访客',
    comment,
    rating: Number(rating) || 0,
    createdAt: Date.now(),
  };
  store[animeId] = [entry, ...list].slice(0, 50);
  writeStore(store);
  return entry;
};

export const clearComments = (animeId) => {
  const store = readStore();
  if (animeId) {
    delete store[animeId];
  } else {
    Object.keys(store).forEach((key) => delete store[key]);
  }
  writeStore(store);
};

export const COMMENTS_STORAGE_KEY = STORAGE_KEY;
