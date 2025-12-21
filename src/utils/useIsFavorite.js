import { useSyncExternalStore } from 'react';
import {
  getFavoriteIds,
  getFavoritesUpdatedAt,
  isFavorite,
  subscribeFavorites,
} from './favoritesStore';

export const useIsFavorite = (animeId) => {
  const getSnapshot = () => isFavorite(animeId);
  return useSyncExternalStore(subscribeFavorites, getSnapshot, getSnapshot);
};

export const useFavoriteIds = () =>
  useSyncExternalStore(subscribeFavorites, getFavoriteIds, getFavoriteIds);

export const useFavoritesUpdatedAt = () =>
  useSyncExternalStore(subscribeFavorites, getFavoritesUpdatedAt, getFavoritesUpdatedAt);
