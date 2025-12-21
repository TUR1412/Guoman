import { useSyncExternalStore } from 'react';
import { getProMembership, isProEnabled, subscribeProMembership } from './proMembership';

const serverFallback = { version: 1, enabled: false, plan: 'free', startedAt: null, updatedAt: 0 };

export const useProMembership = () =>
  useSyncExternalStore(subscribeProMembership, getProMembership, () => serverFallback);

export const useIsProEnabled = () =>
  useSyncExternalStore(
    subscribeProMembership,
    () => isProEnabled(),
    () => false,
  );
