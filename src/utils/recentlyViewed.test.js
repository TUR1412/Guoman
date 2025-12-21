import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearRecentlyViewed,
  getRecentlyViewed,
  RECENTLY_VIEWED_STORAGE_KEY,
  recordRecentlyViewed,
} from './recentlyViewed';
import { flushStorageQueue, hasPendingStorageWrite, scheduleStorageWrite } from './storageQueue';

describe('recentlyViewed utils', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('records and de-duplicates ids in most-recent order', () => {
    recordRecentlyViewed(3);
    recordRecentlyViewed(5);
    recordRecentlyViewed(3);
    flushStorageQueue();

    expect(getRecentlyViewed()).toEqual([3, 5]);
  });

  it('supports read-after-write before storage flush', () => {
    recordRecentlyViewed(7);
    expect(getRecentlyViewed()).toEqual([7]);
    flushStorageQueue();
    expect(getRecentlyViewed()).toEqual([7]);
  });

  it('returns cached list when pending write removes key', () => {
    recordRecentlyViewed(11);
    expect(getRecentlyViewed()).toEqual([11]);

    scheduleStorageWrite(RECENTLY_VIEWED_STORAGE_KEY, null);
    expect(hasPendingStorageWrite(RECENTLY_VIEWED_STORAGE_KEY)).toBe(true);
    expect(getRecentlyViewed()).toEqual([11]);
  });

  it('ignores invalid ids', () => {
    recordRecentlyViewed('bad');
    flushStorageQueue();
    expect(getRecentlyViewed()).toEqual([]);
  });

  it('respects maxItems option', () => {
    recordRecentlyViewed(1, { maxItems: 2 });
    recordRecentlyViewed(2, { maxItems: 2 });
    recordRecentlyViewed(3, { maxItems: 2 });
    flushStorageQueue();
    expect(getRecentlyViewed()).toEqual([3, 2]);
  });

  it('tolerates invalid stored payload', () => {
    window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, '{bad');
    expect(getRecentlyViewed()).toEqual([]);
  });

  it('caches parsed storage payload for repeated reads', () => {
    window.localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify([2, 1]));
    expect(getRecentlyViewed()).toEqual([2, 1]);
    // second call should hit cachedRaw branch
    expect(getRecentlyViewed()).toEqual([2, 1]);
  });

  it('returns empty list without window', () => {
    vi.stubGlobal('window', undefined);
    expect(getRecentlyViewed()).toEqual([]);
    vi.unstubAllGlobals();
  });

  it('clears recently viewed list', () => {
    recordRecentlyViewed(1);
    clearRecentlyViewed();
    flushStorageQueue();
    expect(getRecentlyViewed()).toEqual([]);
  });
});
