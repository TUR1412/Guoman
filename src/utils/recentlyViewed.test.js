import { beforeEach, describe, expect, it } from 'vitest';
import { clearRecentlyViewed, getRecentlyViewed, recordRecentlyViewed } from './recentlyViewed';
import { flushStorageQueue } from './storageQueue';

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

  it('ignores invalid ids', () => {
    recordRecentlyViewed('bad');
    flushStorageQueue();
    expect(getRecentlyViewed()).toEqual([]);
  });

  it('clears recently viewed list', () => {
    recordRecentlyViewed(1);
    clearRecentlyViewed();
    flushStorageQueue();
    expect(getRecentlyViewed()).toEqual([]);
  });
});
