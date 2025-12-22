import { useCallback, useSyncExternalStore } from 'react';
import {
  getFavoriteIds,
  getFavoritesUpdatedAt,
  isFavorite,
  subscribeFavoriteById,
  subscribeFavorites,
} from './favoritesStore';

export const useIsFavorite = (animeId) => {
  const getSnapshot = useCallback(() => isFavorite(animeId), [animeId]);
  const subscribe = useCallback((cb) => subscribeFavoriteById(animeId, cb), [animeId]);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

export const useFavoriteIds = () =>
  useSyncExternalStore(subscribeFavorites, getFavoriteIds, getFavoriteIds);

export const useFavoritesUpdatedAt = () =>
  useSyncExternalStore(subscribeFavorites, getFavoritesUpdatedAt, getFavoritesUpdatedAt);
