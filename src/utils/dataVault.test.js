import { beforeEach, describe, expect, it } from 'vitest';
import { exportFeatureData, importFeatureData } from './dataVault';
import { STORAGE_KEYS } from './dataKeys';
import { flushStorageQueue } from './storageQueue';

describe('dataVault', () => {
  beforeEach(() => {
    window.localStorage.clear();
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
});
