import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage';
import { parseFavoritesBackup, serializeFavoritesBackup } from '../utils/favoritesBackup';

const STORAGE_KEY = 'guoman.favorites.v1';

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

const writeToStorage = (favoriteIds) => {
  if (typeof window === 'undefined') return;

  try {
    safeLocalStorageSet(STORAGE_KEY, JSON.stringify(Array.from(favoriteIds)));
  } catch {}
};

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState(() => readFromStorage());

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      setFavoriteIds(readFromStorage());
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
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
      } else {
        next.add(normalized);
      }

      writeToStorage(next);
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavoriteIds(() => {
      const next = new Set();
      writeToStorage(next);
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
    }),
    [
      favoriteIds,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      exportFavoritesBackup,
      importFavoritesBackup,
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
