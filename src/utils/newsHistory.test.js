import { beforeEach, describe, expect, it } from 'vitest';

import { clearNewsHistory, getNewsHistory, recordNewsRead } from './newsHistory';
import { STORAGE_KEYS } from './dataKeys';
import { flushStorageQueue } from './storageQueue';

describe('newsHistory', () => {
  beforeEach(() => {
    window.localStorage.clear();
    flushStorageQueue();
  });

  it('recordNewsRead validates id', () => {
    expect(recordNewsRead({ id: '' })).toBeNull();
  });

  it('tolerates invalid storage payload', () => {
    window.localStorage.setItem(STORAGE_KEYS.newsHistory, '{bad');
    expect(getNewsHistory()).toEqual([]);
  });

  it('treats non-array payload as empty', () => {
    window.localStorage.setItem(STORAGE_KEYS.newsHistory, JSON.stringify({}));
    expect(getNewsHistory()).toEqual([]);
  });

  it('records and de-dupes history', () => {
    recordNewsRead({ id: 'a', title: 'A' });
    flushStorageQueue();
    recordNewsRead({ id: 'b', title: 'B' });
    flushStorageQueue();
    recordNewsRead({ id: 'a', title: 'A2' });
    flushStorageQueue();

    const list = getNewsHistory();
    expect(list.length).toBe(2);
    expect(list[0].id).toBe('a');
  });

  it('clearNewsHistory clears storage', () => {
    recordNewsRead({ id: 'a', title: 'A' });
    flushStorageQueue();
    clearNewsHistory();
    flushStorageQueue();
    expect(getNewsHistory()).toEqual([]);
  });
});
