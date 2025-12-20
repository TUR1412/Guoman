import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';
import { trackEvent } from './analytics';

const STORAGE_KEY = STORAGE_KEYS.watchProgress;
const EVENT_KEY = 'guoman:watch-progress';

const toNumber = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

let lastUpdatedAt = 0;
let cachedPayload = null;

const getMonotonicNow = () => {
  const now = Date.now();
  lastUpdatedAt = Math.max(now, lastUpdatedAt + 1);
  return lastUpdatedAt;
};

const readStorage = () => {
  if (cachedPayload) return cachedPayload;

  const raw = safeLocalStorageGet(STORAGE_KEY);
  if (!raw) {
    cachedPayload = { version: 1, items: {} };
    return cachedPayload;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      cachedPayload = { version: 1, items: {} };
      return cachedPayload;
    }
    cachedPayload = {
      version: 1,
      items: parsed.items && typeof parsed.items === 'object' ? parsed.items : {},
    };
    return cachedPayload;
  } catch {
    cachedPayload = { version: 1, items: {} };
    return cachedPayload;
  }
};

const writeStorage = (payload) => {
  cachedPayload = payload;
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify(payload));
};

const notify = (detail) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail }));
};

export const getWatchProgress = (animeId) => {
  const id = toNumber(animeId);
  if (!id) return null;
  const { items } = readStorage();
  return items[String(id)] || null;
};

export const getContinueWatchingList = ({ limit = 8 } = {}) => {
  const { items } = readStorage();
  return Object.entries(items)
    .map(([id, value]) => ({
      id: Number.parseInt(id, 10),
      episode: value?.episode ?? 1,
      progress: value?.progress ?? 0,
      updatedAt: value?.updatedAt ?? 0,
    }))
    .filter((item) => item.id && (item.progress > 0 || item.episode > 1))
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, limit);
};

export const updateWatchProgress = ({ animeId, episode, progress }) => {
  const id = toNumber(animeId);
  if (!id) return null;

  const normalizedEpisode = clamp(toNumber(episode) ?? 1, 1, 9999);
  const normalizedProgress = clamp(Number(progress ?? 0), 0, 100);

  const payload = readStorage();
  payload.items[String(id)] = {
    episode: normalizedEpisode,
    progress: normalizedProgress,
    updatedAt: getMonotonicNow(),
  };
  writeStorage(payload);
  notify({ animeId: id });
  trackEvent('watchProgress.update', { id, episode: normalizedEpisode, progress: normalizedProgress });
  return payload.items[String(id)];
};

export const clearWatchProgress = (animeId) => {
  const id = toNumber(animeId);
  const payload = readStorage();
  if (id) {
    delete payload.items[String(id)];
  } else {
    payload.items = {};
  }
  writeStorage(payload);
  notify({ animeId: id || null });
  trackEvent('watchProgress.clear', { id: id || null });
};

export const subscribeWatchProgress = (callback) => {
  if (typeof window === 'undefined') return () => {};
  const handler = (event) => callback?.(event?.detail ?? null);
  const onStorage = (event) => {
    if (event?.key === STORAGE_KEY) {
      callback?.({ source: 'storage' });
    }
  };

  window.addEventListener(EVENT_KEY, handler);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(EVENT_KEY, handler);
    window.removeEventListener('storage', onStorage);
  };
};

export const WATCH_PROGRESS_STORAGE_KEY = STORAGE_KEY;
