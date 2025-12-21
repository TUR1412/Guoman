import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { safeLocalStorageGet } from '../utils/storage';
import { scheduleStorageWrite } from '../utils/storageQueue';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { parseFavoritesBackup, serializeFavoritesBackup } from '../utils/favoritesBackup';
import { trackEvent } from '../utils/analytics';

const STORAGE_KEY = STORAGE_KEYS.favorites;
const UPDATED_KEY = STORAGE_KEYS.favoritesUpdatedAt;

const normalizeId = (value) => {
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
};

const readFromStorage = () => {
  if (typeof window === 'undefined') return new Set();

  try {
    const raw = safeLocalStorageGet(STORAGE_KEY);
    if (!raw) return new Set();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();

    const ids = parsed.map(normalizeId).filter((id) => id !== null);

    return new Set(ids);
  } catch {
    return new Set();
  }
};

const readUpdatedAt = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = safeLocalStorageGet(UPDATED_KEY);
    const parsed = raw ? Number.parseInt(raw, 10) : null;
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const writeToStorage = (favoriteIds) => {
  if (typeof window === 'undefined') return;

  try {
    const now = Date.now();
    scheduleStorageWrite(STORAGE_KEY, JSON.stringify(Array.from(favoriteIds)));
    scheduleStorageWrite(UPDATED_KEY, String(now));
    return now;
  } catch {}

  return null;
};

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(() => readFromStorage());
  const [updatedAt, setUpdatedAt] = useState(() => readUpdatedAt());

  useEffect(() => {
    const syncFromStorage = () => {
      setFavoriteIds(readFromStorage());
      setUpdatedAt(readUpdatedAt());
    };

    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY && e.key !== UPDATED_KEY) return;
      syncFromStorage();
    };

    const onInternalStorage = (event) => {
      const key = event?.detail?.key;
      if (key !== STORAGE_KEY && key !== UPDATED_KEY) return;
      syncFromStorage();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('guoman:storage', onInternalStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('guoman:storage', onInternalStorage);
    };
  }, []);

  const isFavorite = useCallback(
    (id) => {
      const normalized = normalizeId(id);
      if (normalized === null) return false;
      return favoriteIds.has(normalized);
    },
    [favoriteIds],
  );

  const toggleFavorite = useCallback((id) => {
    const normalized = normalizeId(id);
    if (normalized === null) return;

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(normalized)) {
        next.delete(normalized);
        trackEvent('favorites.remove', { id: normalized });
      } else {
        next.add(normalized);
        trackEvent('favorites.add', { id: normalized });
      }

      const nextUpdatedAt = writeToStorage(next);
      setUpdatedAt(nextUpdatedAt ?? readUpdatedAt());
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavoriteIds(() => {
      const next = new Set();
      const nextUpdatedAt = writeToStorage(next);
      setUpdatedAt(nextUpdatedAt ?? readUpdatedAt());
      trackEvent('favorites.clear');
      return next;
    });
  }, []);

  const exportFavoritesBackup = useCallback(
    () => serializeFavoritesBackup(favoriteIds),
    [favoriteIds],
  );

  const importFavoritesBackup = useCallback(
    (jsonText, { mode = 'merge' } = {}) => {
      const parsed = parseFavoritesBackup(jsonText);
      const incomingIds = Array.isArray(parsed.favoriteIds) ? parsed.favoriteIds : [];
      const normalizedMode = mode === 'replace' ? 'replace' : 'merge';

      const before = favoriteIds.size;
      const next = normalizedMode === 'replace' ? new Set() : new Set(favoriteIds);
      incomingIds.forEach((id) => next.add(id));

      writeToStorage(next);
      setFavoriteIds(next);
      setUpdatedAt(readUpdatedAt());

      return {
        before,
        after: next.size,
        imported: incomingIds.length,
        added: next.size - before,
        mode: normalizedMode,
        schemaVersion: parsed.schemaVersion ?? null,
        exportedAt: parsed.exportedAt ?? null,
      };
    },
    [favoriteIds],
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      exportFavoritesBackup,
      importFavoritesBackup,
      updatedAt,
    }),
    [
      favoriteIds,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      exportFavoritesBackup,
      importFavoritesBackup,
      updatedAt,
    ],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites 必须在 <FavoritesProvider> 内使用');
  }
  return ctx;
}

export const FAVORITES_STORAGE_KEY = STORAGE_KEY;
export const FAVORITES_UPDATED_KEY = UPDATED_KEY;
