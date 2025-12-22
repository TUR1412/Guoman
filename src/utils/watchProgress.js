import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
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
let cachedRaw = null;
let boundWindowListeners = false;
const subscribers = new Set();
let windowCleanup = null;

const getMonotonicNow = () => {
  const now = Date.now();
  lastUpdatedAt = Math.max(now, lastUpdatedAt + 1);
  return lastUpdatedAt;
};

const readStorage = () => {
  const raw = hasPendingStorageWrite(STORAGE_KEY)
    ? getPendingStorageWriteValue(STORAGE_KEY)
    : safeLocalStorageGet(STORAGE_KEY);
  if (!raw) {
    if (cachedPayload && cachedRaw !== null && hasPendingStorageWrite(STORAGE_KEY)) {
      return cachedPayload;
    }
    cachedPayload = { version: 1, items: {} };
    cachedRaw = null;
    return cachedPayload;
  }

  try {
    if (cachedPayload && cachedRaw === raw) return cachedPayload;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      cachedPayload = { version: 1, items: {} };
      cachedRaw = null;
      return cachedPayload;
    }
    cachedPayload = {
      version: 1,
      items: parsed.items && typeof parsed.items === 'object' ? parsed.items : {},
    };
    cachedRaw = raw;
    return cachedPayload;
  } catch {
    cachedPayload = { version: 1, items: {} };
    cachedRaw = null;
    return cachedPayload;
  }
};

const writeStorage = (payload) => {
  cachedPayload = payload;
  cachedRaw = JSON.stringify(payload);
  scheduleStorageWrite(STORAGE_KEY, cachedRaw);
};

const notify = (detail) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail }));
};

const emitToSubscribers = (payload) => {
  subscribers.forEach((callback) => {
    try {
      callback(payload);
    } catch {}
  });
};

const ensureWindowListeners = () => {
  if (boundWindowListeners || typeof window === 'undefined') return;
  boundWindowListeners = true;

  const onEvent = (event) => {
    emitToSubscribers(event?.detail ?? null);
  };

  const onStorage = (event) => {
    const key = event?.detail?.key ?? event?.key;
    if (key !== STORAGE_KEY) return;
    emitToSubscribers({ source: 'storage' });
  };

  window.addEventListener(EVENT_KEY, onEvent);
  window.addEventListener('storage', onStorage);
  window.addEventListener('guoman:storage', onStorage);

  windowCleanup = () => {
    window.removeEventListener(EVENT_KEY, onEvent);
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('guoman:storage', onStorage);
  };
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
  trackEvent('watchProgress.update', {
    id,
    episode: normalizedEpisode,
    progress: normalizedProgress,
  });
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
  if (typeof callback !== 'function') return () => {};
  ensureWindowListeners();
  subscribers.add(callback);

  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0) {
      windowCleanup?.();
      boundWindowListeners = false;
      windowCleanup = null;
    }
  };
};

export const WATCH_PROGRESS_STORAGE_KEY = STORAGE_KEY;
