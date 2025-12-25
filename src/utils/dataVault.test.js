import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearAllData,
  clearFeatureData,
  exportAllData,
  exportFeatureData,
  getFeatureSummaries,
  importAllData,
  importFeatureData,
} from './dataVault';
import { STORAGE_KEYS } from './dataKeys';
import { flushStorageQueue } from './storageQueue';

describe('dataVault', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('summarizes features with counts and bytes', () => {
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([1, 2]));
    const list = getFeatureSummaries();

    const favorites = list.find((item) => item.key === 'favorites');
    expect(favorites).toEqual(
      expect.objectContaining({
        key: 'favorites',
        count: 2,
        bytes: expect.any(Number),
      }),
    );
    expect(favorites.bytes).toBeGreaterThan(0);
  });

  it('summarizes boolean-ish features (user/theme/shortcuts/tagCategory/syncProfile)', () => {
    window.localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify({ name: 'x' }));
    window.localStorage.setItem(STORAGE_KEYS.theme, 'dark');
    window.localStorage.setItem(STORAGE_KEYS.visualSettings, JSON.stringify({ schemaVersion: 1 }));
    window.localStorage.setItem(STORAGE_KEYS.shortcuts, '1');
    window.localStorage.setItem(STORAGE_KEYS.tagSort, 'hot');
    window.localStorage.setItem(STORAGE_KEYS.categorySort, 'new');
    window.localStorage.setItem(STORAGE_KEYS.syncProfile, JSON.stringify({ updatedAt: 1 }));

    const list = getFeatureSummaries();
    expect(list.find((x) => x.key === 'userProfile').count).toBe(1);
    expect(list.find((x) => x.key === 'theme').count).toBe(1);
    expect(list.find((x) => x.key === 'visualSettings').count).toBe(1);
    expect(list.find((x) => x.key === 'shortcuts').count).toBe(1);
    expect(list.find((x) => x.key === 'tagCategory').count).toBe(2);
    expect(list.find((x) => x.key === 'sync').count).toBe(1);
  });

  it('exports feature payload', () => {
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([1, 2]));
    const raw = exportFeatureData('favorites');
    const parsed = JSON.parse(raw);
    expect(parsed.feature).toBe('favorites');
    expect(parsed.payload[STORAGE_KEYS.favorites]).toBe(JSON.stringify([1, 2]));
  });

  it('imports feature payload with replace', () => {
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([1]));
    const incoming = JSON.stringify({
      schemaVersion: 1,
      feature: 'favorites',
      payload: { [STORAGE_KEYS.favorites]: JSON.stringify([2, 3]) },
    });
    importFeatureData('favorites', incoming, { mode: 'replace' });
    flushStorageQueue();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.favorites))).toEqual([2, 3]);
  });

  it('imports feature payload with merge (arrays, objects, primitives)', () => {
    // Arrays: favorites
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([1]));
    const favoritesIncoming = JSON.stringify({
      schemaVersion: 1,
      feature: 'favorites',
      payload: { [STORAGE_KEYS.favorites]: JSON.stringify([2, 1]) },
    });
    const favoritesSummary = importFeatureData('favorites', favoritesIncoming, { mode: 'merge' });
    flushStorageQueue();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.favorites))).toEqual([1, 2]);
    expect(favoritesSummary.after[STORAGE_KEYS.favorites]).toEqual([1, 2]);

    // Objects: userProfile
    window.localStorage.setItem(
      STORAGE_KEYS.userProfile,
      JSON.stringify({ name: 'a', prefs: { x: 1 } }),
    );
    const profileIncoming = JSON.stringify({
      schemaVersion: 1,
      feature: 'userProfile',
      payload: { [STORAGE_KEYS.userProfile]: JSON.stringify({ prefs: { y: 2 } }) },
    });
    importFeatureData('userProfile', profileIncoming, { mode: 'merge' });
    flushStorageQueue();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.userProfile))).toEqual({
      name: 'a',
      prefs: { x: 1, y: 2 },
    });

    // Objects with array fields: mergeObjects should delegate to mergeArrays
    window.localStorage.setItem(
      STORAGE_KEYS.userProfile,
      JSON.stringify({ name: 'a', tags: ['x'], prefs: { x: 1 } }),
    );
    const profileIncomingWithArray = JSON.stringify({
      schemaVersion: 1,
      feature: 'userProfile',
      payload: { [STORAGE_KEYS.userProfile]: JSON.stringify({ tags: ['y', 'x'] }) },
    });
    importFeatureData('userProfile', profileIncomingWithArray, { mode: 'merge' });
    flushStorageQueue();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.userProfile))).toEqual({
      name: 'a',
      tags: ['x', 'y'],
      prefs: { x: 1 },
    });

    // Primitives: rankings sort
    window.localStorage.setItem(STORAGE_KEYS.rankingsSort, 'score');
    const rankingsIncoming = JSON.stringify({
      schemaVersion: 1,
      feature: 'rankings',
      payload: { [STORAGE_KEYS.rankingsSort]: 'popularity' },
    });
    importFeatureData('rankings', rankingsIncoming, { mode: 'merge' });
    flushStorageQueue();
    expect(window.localStorage.getItem(STORAGE_KEYS.rankingsSort)).toBe('popularity');
  });

  it('throws for unknown feature and invalid payload', () => {
    expect(() => exportFeatureData('unknown')).toThrow(/未知的数据模块/);
    expect(() => importFeatureData('favorites', 'not-json')).toThrow(/导入数据格式错误/);
    expect(() => importFeatureData('unknown', JSON.stringify({ payload: {} }))).toThrow(
      /未知的数据模块/,
    );
    expect(() => clearFeatureData('unknown')).toThrow(/未知的数据模块/);
  });

  it('clears feature data', () => {
    window.localStorage.setItem(STORAGE_KEYS.searchHistory, JSON.stringify(['a', 'b']));
    clearFeatureData('searchHistory');
    flushStorageQueue();
    expect(window.localStorage.getItem(STORAGE_KEYS.searchHistory)).toBeNull();
  });

  it('exports and imports all data', () => {
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([1]));
    window.localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify({ name: 'x' }));

    const raw = exportAllData();
    const parsed = JSON.parse(raw);
    expect(parsed.feature).toBe('all');
    expect(parsed.payload[STORAGE_KEYS.favorites]).toBe(JSON.stringify([1]));

    const incoming = JSON.stringify({
      schemaVersion: 1,
      feature: 'all',
      payload: {
        [STORAGE_KEYS.favorites]: JSON.stringify([2]),
        [STORAGE_KEYS.userProfile]: JSON.stringify({ name: 'y' }),
      },
    });
    importAllData(incoming, { mode: 'merge' });
    flushStorageQueue();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.favorites))).toEqual([1, 2]);
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.userProfile))).toEqual({
      name: 'y',
    });
  });

  it('importAllData supports replace mode', () => {
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([1]));
    const incoming = JSON.stringify({
      schemaVersion: 1,
      feature: 'all',
      payload: { [STORAGE_KEYS.favorites]: JSON.stringify([2]) },
    });
    importAllData(incoming, { mode: 'replace' });
    flushStorageQueue();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.favorites))).toEqual([2]);
  });

  it('importAllData replace mode removes keys when payload is null', () => {
    window.localStorage.setItem(STORAGE_KEYS.rankingsSort, 'score');
    const incoming = JSON.stringify({
      schemaVersion: 1,
      feature: 'all',
      payload: { [STORAGE_KEYS.rankingsSort]: null },
    });
    importAllData(incoming, { mode: 'replace' });
    flushStorageQueue();
    expect(window.localStorage.getItem(STORAGE_KEYS.rankingsSort)).toBeNull();
  });

  it('importAllData writes primitive values and preserves current when incoming is null', () => {
    window.localStorage.setItem(STORAGE_KEYS.rankingsSort, 'score');
    const incoming = JSON.stringify({
      schemaVersion: 1,
      feature: 'all',
      payload: { [STORAGE_KEYS.rankingsSort]: 'popularity' },
    });
    importAllData(incoming, { mode: 'merge' });
    flushStorageQueue();
    expect(window.localStorage.getItem(STORAGE_KEYS.rankingsSort)).toBe('popularity');

    const incomingNull = JSON.stringify({
      schemaVersion: 1,
      feature: 'all',
      payload: { [STORAGE_KEYS.rankingsSort]: null },
    });
    importAllData(incomingNull, { mode: 'merge' });
    flushStorageQueue();
    expect(window.localStorage.getItem(STORAGE_KEYS.rankingsSort)).toBe('popularity');
  });

  it('mergeObjects handles non-object inputs', () => {
    window.localStorage.setItem(STORAGE_KEYS.userProfile, 'raw');
    const incoming = JSON.stringify({
      schemaVersion: 1,
      feature: 'userProfile',
      payload: { [STORAGE_KEYS.userProfile]: JSON.stringify({ prefs: { x: 1 } }) },
    });
    importFeatureData('userProfile', incoming, { mode: 'merge' });
    flushStorageQueue();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.userProfile))).toEqual({
      prefs: { x: 1 },
    });

    window.localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify({ prefs: { x: 1 } }));
    const incoming2 = JSON.stringify({
      schemaVersion: 1,
      feature: 'userProfile',
      payload: { [STORAGE_KEYS.userProfile]: 'raw' },
    });
    importFeatureData('userProfile', incoming2, { mode: 'merge' });
    flushStorageQueue();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.userProfile))).toEqual({
      prefs: { x: 1 },
    });
  });

  it('estimateBytes tolerates TextEncoder failures', () => {
    const original = globalThis.TextEncoder;
    globalThis.TextEncoder = class {
      encode() {
        throw new Error('boom');
      }
    };

    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([1, 2, 3]));
    const res = getFeatureSummaries().find((item) => item.key === 'favorites');
    expect(res.bytes).toBeGreaterThan(0);

    globalThis.TextEncoder = original;
  });

  it('clearAllData clears known keys', () => {
    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([1]));
    window.localStorage.setItem(STORAGE_KEYS.newsHistory, JSON.stringify([{ id: 'a' }]));
    const res = clearAllData();
    expect(res.clearedKeys).toBeGreaterThan(0);
    flushStorageQueue();
    expect(window.localStorage.getItem(STORAGE_KEYS.favorites)).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEYS.newsHistory)).toBeNull();
  });
});
