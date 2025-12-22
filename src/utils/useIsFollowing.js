import { useCallback, useSyncExternalStore } from 'react';
import {
  getFollowingEntries,
  isFollowing,
  subscribeFollowing,
  subscribeFollowingById,
} from './followingStore';

export const useIsFollowing = (animeId) =>
  useSyncExternalStore(
    useCallback((cb) => subscribeFollowingById(animeId, cb), [animeId]),
    useCallback(() => isFollowing(animeId), [animeId]),
    () => false,
  );

export const useFollowingEntries = () =>
  useSyncExternalStore(
    subscribeFollowing,
    () => getFollowingEntries(),
    () => [],
  );
