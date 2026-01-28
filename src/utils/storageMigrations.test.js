import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from './dataKeys';
import { flushStorageQueue } from './storageQueue';
import {
  STORAGE_MIGRATION_NORMALIZE_VERSION_FIELD,
  runStorageMigrations,
} from './storageMigrations';

describe('storageMigrations', () => {
  beforeEach(() => {
    flushStorageQueue();
    window.localStorage.clear();
    flushStorageQueue();
  });

  it('normalizes legacy `version` fields to `schemaVersion`', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.following,
      JSON.stringify({ version: 1, meta: { lastWriteAt: 1 }, items: {} }),
    );
    window.localStorage.setItem(
      STORAGE_KEYS.watchProgress,
      JSON.stringify({ version: 1, items: { 1: { episode: 2, progress: 10, updatedAt: 1 } } }),
    );
    window.localStorage.setItem(
      STORAGE_KEYS.proMembership,
      JSON.stringify({ version: 1, enabled: true, plan: 'supporter', startedAt: 1, updatedAt: 2 }),
    );

    const res = runStorageMigrations();
    expect(res.ok).toBe(true);
    expect(res.applied).toContain(STORAGE_MIGRATION_NORMALIZE_VERSION_FIELD);

    flushStorageQueue();

    const following = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.following));
    expect(following).toEqual(
      expect.objectContaining({
        schemaVersion: 1,
      }),
    );
    expect(following.version).toBeUndefined();

    const watchProgress = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.watchProgress));
    expect(watchProgress).toEqual(expect.objectContaining({ schemaVersion: 1 }));
    expect(watchProgress.version).toBeUndefined();

    const pro = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.proMembership));
    expect(pro).toEqual(expect.objectContaining({ schemaVersion: 1 }));
    expect(pro.version).toBeUndefined();

    const registry = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.schemaRegistry));
    expect(registry.appliedMigrations).toContain(STORAGE_MIGRATION_NORMALIZE_VERSION_FIELD);
  });
});
