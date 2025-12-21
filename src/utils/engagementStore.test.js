import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearEngagementHistory,
  getDownloadHistory,
  getPlayHistory,
  recordDownload,
  recordPlay,
} from './engagementStore';
import { STORAGE_KEYS } from './dataKeys';
import { flushStorageQueue } from './storageQueue';

describe('engagementStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    flushStorageQueue();
  });

  it('recordPlay / recordDownload validate required fields', () => {
    expect(recordPlay({ animeId: '' })).toBeNull();
    expect(recordDownload({ animeId: '' })).toBeNull();
  });

  it('records play and download history', () => {
    recordPlay({ animeId: '1', title: 'A', platform: 'B站' });
    recordDownload({ animeId: '2', title: 'B' });
    flushStorageQueue();

    expect(getPlayHistory().length).toBe(1);
    expect(getPlayHistory()[0]).toEqual(expect.objectContaining({ animeId: '1', title: 'A' }));
    expect(getDownloadHistory().length).toBe(1);
    expect(getDownloadHistory()[0]).toEqual(expect.objectContaining({ animeId: '2', title: 'B' }));
  });

  it('tolerates invalid storage payload', () => {
    window.localStorage.setItem(STORAGE_KEYS.playHistory, '{bad');
    expect(getPlayHistory()).toEqual([]);
  });

  it('clearEngagementHistory clears both lists', () => {
    recordPlay({ animeId: '1', title: 'A' });
    recordDownload({ animeId: '2', title: 'B' });
    flushStorageQueue();

    clearEngagementHistory();
    flushStorageQueue();
    expect(getPlayHistory()).toEqual([]);
    expect(getDownloadHistory()).toEqual([]);
  });
});
