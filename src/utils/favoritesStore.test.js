import { describe, expect, it } from 'vitest';
import {
  clearFavorites,
  exportFavoritesBackup,
  FAVORITES_STORAGE_KEY,
  FAVORITES_UPDATED_KEY,
  getFavoriteIds,
  getFavoritesState,
  getFavoritesUpdatedAt,
  importFavoritesBackup,
  isFavorite,
  subscribeFavorites,
  toggleFavorite,
} from './favoritesStore';
import { flushStorageQueue } from './storageQueue';

describe('favoritesStore', () => {
  it('toggles favorites and exposes stable reads', () => {
    window.localStorage.clear();
    flushStorageQueue();

    expect(isFavorite(101)).toBe(false);
    expect(getFavoriteIds().size).toBe(0);

    const added = toggleFavorite(101);
    expect(added).toEqual(expect.objectContaining({ ok: true, action: 'added', id: 101 }));
    expect(isFavorite(101)).toBe(true);

    const updatedAt = getFavoritesUpdatedAt();
    expect(typeof updatedAt).toBe('number');

    const state = getFavoritesState();
    expect(state.favoriteIds.has(101)).toBe(true);
    expect(state.updatedAt).toBe(updatedAt);

    const removed = toggleFavorite(101);
    expect(removed).toEqual(expect.objectContaining({ ok: true, action: 'removed', id: 101 }));
    expect(isFavorite(101)).toBe(false);
    expect(getFavoriteIds().size).toBe(0);
  });

  it('notifies subscribers and supports unsubscribe', () => {
    window.localStorage.clear();
    flushStorageQueue();
    clearFavorites();

    let hits = 0;
    const unsubscribe = subscribeFavorites(() => {
      hits += 1;
    });

    toggleFavorite(1);
    expect(hits).toBeGreaterThan(0);

    const before = hits;
    unsubscribe();

    toggleFavorite(2);
    expect(hits).toBe(before);
  });

  it('exports and imports favorites backups', () => {
    window.localStorage.clear();
    flushStorageQueue();
    clearFavorites();

    toggleFavorite(9);
    toggleFavorite(3);

    const json = exportFavoritesBackup();
    expect(typeof json).toBe('string');
    expect(json).toMatch(/favoriteIds/);

    clearFavorites();
    expect(getFavoriteIds().size).toBe(0);

    const summary = importFavoritesBackup(json, { mode: 'replace' });
    expect(summary).toEqual(
      expect.objectContaining({
        mode: 'replace',
        after: 2,
      }),
    );
    expect(getFavoriteIds().has(3)).toBe(true);
    expect(getFavoriteIds().has(9)).toBe(true);
  });

  it('tolerates invalid storage payloads and ids', () => {
    window.localStorage.clear();
    flushStorageQueue();

    window.localStorage.setItem(FAVORITES_STORAGE_KEY, '{bad');
    window.localStorage.setItem(FAVORITES_UPDATED_KEY, 'not-a-number');

    expect(getFavoriteIds()).toEqual(new Set());
    expect(getFavoritesUpdatedAt()).toBeNull();
    expect(isFavorite(1)).toBe(false);
    expect(toggleFavorite('bad')).toEqual({ ok: false, action: 'noop', id: null });
    expect(toggleFavorite(-1)).toEqual({ ok: false, action: 'noop', id: null });

    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify({ ids: [1, 2, 3] }));
    expect(getFavoriteIds()).toEqual(new Set());
  });

  it('handles clear when already empty and supports merge imports', () => {
    window.localStorage.clear();
    flushStorageQueue();

    expect(clearFavorites()).toEqual({ ok: true, cleared: 0 });

    toggleFavorite(1);
    toggleFavorite(2);
    const json = exportFavoritesBackup();

    const summaryMerge = importFavoritesBackup(json, { mode: 'merge' });
    expect(summaryMerge.mode).toBe('merge');
    expect(getFavoriteIds().has(1)).toBe(true);
    expect(getFavoriteIds().has(2)).toBe(true);

    const legacyArray = JSON.stringify([3, 2, 999]);
    const summaryLegacy = importFavoritesBackup(legacyArray, { mode: 'merge' });
    expect(summaryLegacy.after).toBeGreaterThanOrEqual(3);
    expect(getFavoriteIds().has(3)).toBe(true);
  });

  it('reacts to guoman:storage events for favorites keys only', () => {
    window.localStorage.clear();
    flushStorageQueue();
    clearFavorites();

    let hits = 0;
    const unsubscribe = subscribeFavorites(() => {
      hits += 1;
    });

    window.dispatchEvent(
      new CustomEvent('guoman:storage', { detail: { key: 'some.other.key', value: 'x' } }),
    );
    expect(hits).toBe(0);

    window.dispatchEvent(
      new CustomEvent('guoman:storage', { detail: { key: FAVORITES_STORAGE_KEY, value: '[]' } }),
    );
    expect(hits).toBe(1);

    unsubscribe();
  });
});
