import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearWatchProgress,
  getContinueWatchingList,
  getWatchProgress,
  updateWatchProgress,
} from './watchProgress';
import { flushStorageQueue } from './storageQueue';

describe('watchProgress utils', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('stores and reads progress entries', () => {
    updateWatchProgress({ animeId: 1, episode: 3, progress: 40 });
    flushStorageQueue();
    const entry = getWatchProgress(1);
    expect(entry?.episode).toBe(3);
    expect(entry?.progress).toBe(40);
  });

  it('clamps invalid values', () => {
    updateWatchProgress({ animeId: 2, episode: -10, progress: 999 });
    flushStorageQueue();
    const entry = getWatchProgress(2);
    expect(entry?.episode).toBe(1);
    expect(entry?.progress).toBe(100);
  });

  it('builds continue-watching list ordered by updated time', () => {
    updateWatchProgress({ animeId: 1, episode: 1, progress: 20 });
    updateWatchProgress({ animeId: 3, episode: 2, progress: 10 });
    flushStorageQueue();
    const list = getContinueWatchingList({ limit: 2 });
    expect(list[0].id).toBe(3);
    expect(list[1].id).toBe(1);
  });

  it('clears progress entries', () => {
    updateWatchProgress({ animeId: 5, episode: 4, progress: 70 });
    clearWatchProgress(5);
    flushStorageQueue();
    expect(getWatchProgress(5)).toBeNull();
  });
});
