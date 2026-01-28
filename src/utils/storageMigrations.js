import { STORAGE_KEYS } from './dataKeys';
import { safeJsonParse } from './json';
import { readStorageRaw, writeStorageRaw } from './storagePort';
import {
  ensureStorageSchemaBaseline,
  hasAppliedStorageMigration,
  markStorageMigrationApplied,
  setStorageSchemaVersion,
} from './storageSchemaRegistry';

export const STORAGE_MIGRATION_NORMALIZE_VERSION_FIELD =
  '2026-01-28:storage:normalize-version-field';

const normalizeObjectVersionField = (storageKey) => {
  const raw = readStorageRaw(storageKey);
  if (!raw || typeof raw !== 'string') return { changed: false };

  const parsed = safeJsonParse(raw, null);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { changed: false };

  const legacy = Number(parsed.version);
  const existingSchema = Number(parsed.schemaVersion);

  const next = { ...parsed };
  let changed = false;

  if (!Number.isFinite(existingSchema) || existingSchema <= 0) {
    const schemaVersion = Number.isFinite(legacy) && legacy > 0 ? legacy : 1;
    next.schemaVersion = schemaVersion;
    changed = true;
  }

  if ('version' in next) {
    delete next.version;
    changed = true;
  }

  if (!changed) return { changed: false, schemaVersion: next.schemaVersion };

  writeStorageRaw(storageKey, JSON.stringify(next));
  return { changed: true, schemaVersion: next.schemaVersion };
};

export const runStorageMigrations = () => {
  if (typeof window === 'undefined') return { ok: false, applied: [], changedKeys: [] };

  ensureStorageSchemaBaseline();

  const applied = [];
  const changedKeys = [];

  if (!hasAppliedStorageMigration(STORAGE_MIGRATION_NORMALIZE_VERSION_FIELD)) {
    const targets = [
      STORAGE_KEYS.following,
      STORAGE_KEYS.watchProgress,
      STORAGE_KEYS.proMembership,
    ];

    targets.forEach((key) => {
      if (!key) return;
      const result = normalizeObjectVersionField(key);
      if (result.changed) {
        changedKeys.push(key);
      }
      if (Number.isFinite(result.schemaVersion) && result.schemaVersion > 0) {
        setStorageSchemaVersion(key, result.schemaVersion);
      }
    });

    markStorageMigrationApplied(STORAGE_MIGRATION_NORMALIZE_VERSION_FIELD);
    applied.push(STORAGE_MIGRATION_NORMALIZE_VERSION_FIELD);
  }

  return { ok: true, applied, changedKeys };
};
