import { beforeEach, describe, expect, it } from 'vitest';
import { clearSearchCache, getCachedSearch, setCachedSearch } from './searchCache';
import { flushStorageQueue } from './storageQueue';

describe('searchCache', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('stores and returns cached ids', () => {
    setCachedSearch('test', [1, 2, 3]);
    flushStorageQueue();
    expect(getCachedSearch('test')).toEqual([1, 2, 3]);
  });

  it('clears cache', () => {
    setCachedSearch('test', [1]);
    flushStorageQueue();
    clearSearchCache();
    flushStorageQueue();
    expect(getCachedSearch('test')).toBeNull();
  });
});
