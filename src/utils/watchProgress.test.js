import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearWatchProgress,
  getContinueWatchingList,
  getWatchProgress,
  subscribeWatchProgress,
  updateWatchProgress,
} from './watchProgress';
import { flushStorageQueue } from './storageQueue';

describe('watchProgress utils', () => {
  beforeEach(() => {
    flushStorageQueue();
    window.localStorage.clear();
    flushStorageQueue();
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

  it('returns null for invalid ids', () => {
    expect(getWatchProgress('bad')).toBeNull();
  });

  it('supports read-after-write before storage flush', () => {
    updateWatchProgress({ animeId: 9, episode: 2, progress: 10 });
    // 不 flush：依赖 hasPendingStorageWrite + 内存缓存
    expect(getWatchProgress(9)).toEqual(expect.objectContaining({ episode: 2, progress: 10 }));
  });

  it('clears all entries when animeId is omitted', () => {
    updateWatchProgress({ animeId: 1, episode: 2, progress: 10 });
    updateWatchProgress({ animeId: 2, episode: 2, progress: 10 });
    flushStorageQueue();

    clearWatchProgress();
    flushStorageQueue();
    expect(getContinueWatchingList({ limit: 10 })).toEqual([]);
  });

  it('subscribes to progress updates and storage events', () => {
    const callback = vi.fn();
    const unsubscribe = subscribeWatchProgress(callback);

    updateWatchProgress({ animeId: 4, episode: 1, progress: 50 });
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ animeId: 4 }));

    const storageEvent = new Event('storage');
    Object.defineProperty(storageEvent, 'key', { value: 'guoman.watchProgress.v1' });
    window.dispatchEvent(storageEvent);
    expect(callback).toHaveBeenCalledWith({ source: 'storage' });

    unsubscribe();
    callback.mockClear();
    updateWatchProgress({ animeId: 4, episode: 2, progress: 60 });
    expect(callback).not.toHaveBeenCalled();
  });

  it('reads from persisted storage payload and caches parsed result', () => {
    window.localStorage.setItem(
      'guoman.watchProgress.v1',
      JSON.stringify({ items: { 1: { episode: 2, progress: 10, updatedAt: 1 } } }),
    );

    expect(getWatchProgress(1)).toEqual(expect.objectContaining({ episode: 2, progress: 10 }));
    expect(getContinueWatchingList({ limit: 10 })[0]).toEqual(
      expect.objectContaining({ id: 1, episode: 2, progress: 10 }),
    );

    // cache hit (same raw string should reuse cachedPayload)
    expect(getWatchProgress(1)).toEqual(expect.objectContaining({ episode: 2, progress: 10 }));
  });

  it('tolerates invalid or unexpected stored payloads', () => {
    window.localStorage.setItem('guoman.watchProgress.v1', '{bad');
    expect(getContinueWatchingList({ limit: 10 })).toEqual([]);

    window.localStorage.setItem('guoman.watchProgress.v1', JSON.stringify(true));
    expect(getContinueWatchingList({ limit: 10 })).toEqual([]);
  });

  it('handles partial item payloads and filters incomplete entries', () => {
    window.localStorage.setItem(
      'guoman.watchProgress.v1',
      JSON.stringify({
        items: {
          1: {}, // episode/progress missing -> defaults -> filtered out
          2: { episode: 2 }, // should be included
        },
      }),
    );

    const list = getContinueWatchingList({ limit: 10 });
    expect(list.some((x) => x.id === 1)).toBe(false);
    expect(list.some((x) => x.id === 2)).toBe(true);
  });

  it('subscribeWatchProgress handles missing detail and ignores unrelated storage events', () => {
    const callback = vi.fn();
    const unsubscribe = subscribeWatchProgress(callback);

    window.dispatchEvent(new CustomEvent('guoman:watch-progress'));
    expect(callback).toHaveBeenCalledWith(null);

    const storageEvent = new Event('storage');
    Object.defineProperty(storageEvent, 'key', { value: 'other.key' });
    window.dispatchEvent(storageEvent);
    expect(callback).not.toHaveBeenCalledWith({ source: 'storage' });

    unsubscribe();
  });

  it('updateWatchProgress is safe without window (notify is guarded)', () => {
    const originalWindow = globalThis.window;
    globalThis.window = undefined;

    expect(() => updateWatchProgress({ animeId: 1, episode: 1, progress: 10 })).not.toThrow();

    globalThis.window = originalWindow;
    flushStorageQueue();
  });
});
