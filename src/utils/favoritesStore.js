import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';
import { trackEvent } from './analytics';
import { parseFavoritesBackup, serializeFavoritesBackup } from './favoritesBackup';

const IDS_KEY = STORAGE_KEYS.favorites;
const UPDATED_KEY = STORAGE_KEYS.favoritesUpdatedAt;
const EVENT_KEY = 'guoman:favorites';

const normalizeId = (value) => {
  const id = Number(value);
  if (!Number.isFinite(id)) return null;
  if (!Number.isInteger(id)) return null;
  if (id <= 0) return null;
  return id;
};

const serializeIds = (set) => JSON.stringify(Array.from(set).sort((a, b) => a - b));

let cachedIds = null;
let cachedIdsRaw = undefined;
let cachedUpdatedAt = null;
let cachedUpdatedRaw = undefined;
let cachedState = null;
let cachedStateKey = undefined;
let windowBound = false;
const listeners = new Set();

const readRaw = (key) => {
  if (typeof window === 'undefined') return null;
  return hasPendingStorageWrite(key) ? getPendingStorageWriteValue(key) : safeLocalStorageGet(key);
};

const readIds = () => {
  const raw = readRaw(IDS_KEY);

  if (!raw) {
    if (cachedIds && cachedIdsRaw === null) return cachedIds;
    cachedIds = new Set();
    cachedIdsRaw = null;
    return cachedIds;
  }

  if (cachedIds && cachedIdsRaw === raw) return cachedIds;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      cachedIds = new Set();
      cachedIdsRaw = null;
      return cachedIds;
    }

    const next = new Set(parsed.map(normalizeId).filter(Boolean));
    cachedIds = next;
    cachedIdsRaw = raw;
    return cachedIds;
  } catch {
    cachedIds = new Set();
    cachedIdsRaw = null;
    return cachedIds;
  }
};

const readUpdatedAt = () => {
  const raw = readRaw(UPDATED_KEY);

  if (!raw) {
    if (cachedUpdatedRaw === null) return cachedUpdatedAt;
    cachedUpdatedAt = null;
    cachedUpdatedRaw = null;
    return cachedUpdatedAt;
  }

  if (cachedUpdatedRaw === raw) return cachedUpdatedAt;

  const parsed = Number.parseInt(raw, 10);
  cachedUpdatedAt = Number.isFinite(parsed) ? parsed : null;
  cachedUpdatedRaw = raw;
  return cachedUpdatedAt;
};

const getStateKey = () => `${cachedIdsRaw ?? '∅'}|${cachedUpdatedRaw ?? '∅'}`;

const clearCache = () => {
  cachedIds = null;
  cachedIdsRaw = undefined;
  cachedUpdatedAt = null;
  cachedUpdatedRaw = undefined;
  cachedState = null;
  cachedStateKey = undefined;
};

const emit = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {}
  });

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(EVENT_KEY));
    } catch {}
  }
};

const ensureWindowListeners = () => {
  if (windowBound || typeof window === 'undefined') return;
  windowBound = true;

  const onStorage = (event) => {
    if (!event) return;
    const key = event?.detail?.key ?? event?.key;
    if (key !== IDS_KEY && key !== UPDATED_KEY) return;
    clearCache();
    emit();
  };

  window.addEventListener('storage', onStorage);
  window.addEventListener('guoman:storage', onStorage);
};

export const subscribeFavorites = (listener) => {
  ensureWindowListeners();
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getFavoriteIds = () => readIds();

export const getFavoritesUpdatedAt = () => readUpdatedAt();

export const getFavoritesState = () => {
  const ids = readIds();
  const updatedAt = readUpdatedAt();
  const key = getStateKey();

  if (cachedState && cachedStateKey === key) return cachedState;
  cachedState = { favoriteIds: ids, updatedAt };
  cachedStateKey = key;
  return cachedState;
};

export const isFavorite = (animeId) => {
  const id = normalizeId(animeId);
  if (id === null) return false;
  return readIds().has(id);
};

const writeFavorites = ({ nextIds, now = Date.now() } = {}) => {
  const serialized = serializeIds(nextIds);
  const updatedRaw = String(now);

  cachedIds = nextIds;
  cachedIdsRaw = serialized;
  cachedUpdatedAt = now;
  cachedUpdatedRaw = updatedRaw;
  cachedState = null;
  cachedStateKey = undefined;

  scheduleStorageWrite(IDS_KEY, serialized);
  scheduleStorageWrite(UPDATED_KEY, updatedRaw);
  emit();

  return { serialized, updatedAt: now };
};

export const toggleFavorite = (animeId) => {
  const id = normalizeId(animeId);
  if (id === null) return { ok: false, action: 'noop', id: null };

  const current = readIds();
  const next = new Set(current);
  const exists = next.has(id);

  if (exists) {
    next.delete(id);
  } else {
    next.add(id);
  }

  writeFavorites({ nextIds: next });

  if (exists) {
    trackEvent('favorites.remove', { id });
    return { ok: true, action: 'removed', id };
  }

  trackEvent('favorites.add', { id });
  return { ok: true, action: 'added', id };
};

export const clearFavorites = () => {
  const current = readIds();
  if (current.size === 0) return { ok: true, cleared: 0 };
  const cleared = current.size;
  writeFavorites({ nextIds: new Set() });
  trackEvent('favorites.clear', { cleared });
  return { ok: true, cleared };
};

export const exportFavoritesBackup = () => serializeFavoritesBackup(readIds());

export const importFavoritesBackup = (jsonText, { mode = 'merge' } = {}) => {
  const parsed = parseFavoritesBackup(jsonText);
  const incoming = Array.isArray(parsed.favoriteIds) ? parsed.favoriteIds : [];
  const normalizedMode = mode === 'replace' ? 'replace' : 'merge';

  const current = readIds();
  const before = current.size;
  const next = normalizedMode === 'replace' ? new Set() : new Set(Array.from(current.values()));
  incoming.forEach((id) => {
    const normalized = normalizeId(id);
    if (normalized !== null) next.add(normalized);
  });

  writeFavorites({ nextIds: next });
  trackEvent('favorites.import', { mode: normalizedMode, imported: incoming.length });

  return {
    before,
    after: next.size,
    imported: incoming.length,
    added: Math.max(0, next.size - before),
    mode: normalizedMode,
    schemaVersion: parsed.schemaVersion ?? null,
    exportedAt: parsed.exportedAt ?? null,
  };
};

export const FAVORITES_STORAGE_KEY = IDS_KEY;
export const FAVORITES_UPDATED_KEY = UPDATED_KEY;
export const FAVORITES_EVENT_KEY = EVENT_KEY;
