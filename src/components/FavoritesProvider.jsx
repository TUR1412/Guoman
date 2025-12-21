import { useMemo, useSyncExternalStore } from 'react';
import {
  clearFavorites,
  exportFavoritesBackup,
  getFavoritesState,
  importFavoritesBackup,
  isFavorite,
  subscribeFavorites,
  toggleFavorite,
} from '../utils/favoritesStore';

const serverFallback = { favoriteIds: new Set(), updatedAt: null };

export function FavoritesProvider({ children }) {
  return children;
}

export function useFavorites() {
  const state = useSyncExternalStore(subscribeFavorites, getFavoritesState, () => serverFallback);

  return useMemo(
    () => ({
      favoriteIds: state.favoriteIds,
      updatedAt: state.updatedAt,
      isFavorite,
      toggleFavorite,
      clearFavorites,
      exportFavoritesBackup,
      importFavoritesBackup,
    }),
    [state],
  );
}

export { FAVORITES_STORAGE_KEY, FAVORITES_UPDATED_KEY } from '../utils/favoritesStore';
