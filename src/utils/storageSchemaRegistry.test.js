import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from './dataKeys';
import { flushStorageQueue } from './storageQueue';
import {
  ensureStorageSchemaBaseline,
  getStorageSchemaRegistry,
  hasAppliedStorageMigration,
  markStorageMigrationApplied,
} from './storageSchemaRegistry';

describe('storageSchemaRegistry', () => {
  beforeEach(() => {
    flushStorageQueue();
    window.localStorage.clear();
    flushStorageQueue();
  });

  it('bootstraps baseline schemas for known keys', () => {
    expect(window.localStorage.getItem(STORAGE_KEYS.schemaRegistry)).toBeNull();

    ensureStorageSchemaBaseline();
    flushStorageQueue();

    const registry = getStorageSchemaRegistry();
    expect(registry.schemaVersion).toBe(1);
    expect(Object.keys(registry.stores).length).toBeGreaterThan(10);
    expect(registry.stores[STORAGE_KEYS.favorites]).toEqual(
      expect.objectContaining({ schemaVersion: 1 }),
    );
    expect(registry.stores[STORAGE_KEYS.theme]).toEqual(
      expect.objectContaining({ schemaVersion: 1 }),
    );
  });

  it('records applied migrations', () => {
    ensureStorageSchemaBaseline();
    flushStorageQueue();

    expect(hasAppliedStorageMigration('x')).toBe(false);
    markStorageMigrationApplied('x');
    flushStorageQueue();
    expect(hasAppliedStorageMigration('x')).toBe(true);
  });
});
