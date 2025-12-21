import { useSyncExternalStore } from 'react';
import { getFollowingEntries, isFollowing, subscribeFollowing } from './followingStore';

export const useIsFollowing = (animeId) =>
  useSyncExternalStore(
    subscribeFollowing,
    () => isFollowing(animeId),
    () => false,
  );

export const useFollowingEntries = () =>
  useSyncExternalStore(
    subscribeFollowing,
    () => getFollowingEntries(),
    () => [],
  );
