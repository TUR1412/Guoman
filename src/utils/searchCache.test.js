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

  it('returns null for empty query', () => {
    expect(getCachedSearch('')).toBeNull();
  });

  it('returns null when cache is expired', () => {
    const ttlMs = 1000 * 60 * 60 * 24;
    window.localStorage.setItem(
      'guoman.search.cache.v1',
      JSON.stringify({ q: { ids: [1], at: Date.now() - ttlMs - 1 } }),
    );
    expect(getCachedSearch('q')).toBeNull();
  });

  it('returns null when stored ids are not an array', () => {
    window.localStorage.setItem(
      'guoman.search.cache.v1',
      JSON.stringify({ q: { ids: 'x', at: 0 } }),
    );
    expect(getCachedSearch('q')).toBeNull();
  });

  it('tolerates invalid cache payloads', () => {
    window.localStorage.setItem('guoman.search.cache.v1', '{bad');
    expect(getCachedSearch('q')).toBeNull();
  });

  it('treats non-object cache payload as empty', () => {
    window.localStorage.setItem('guoman.search.cache.v1', JSON.stringify(123));
    expect(getCachedSearch('q')).toBeNull();
  });
});
