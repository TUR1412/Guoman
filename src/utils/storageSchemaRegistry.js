import { STORAGE_KEYS } from './dataKeys';
import { safeJsonParse } from './json';
import { readStorageRaw, writeStorageRaw } from './storagePort';

const STORAGE_KEY = STORAGE_KEYS.schemaRegistry;

export const STORAGE_SCHEMA_REGISTRY_SCHEMA_VERSION = 1;

const DEFAULT_REGISTRY = Object.freeze({
  schemaVersion: STORAGE_SCHEMA_REGISTRY_SCHEMA_VERSION,
  updatedAt: 0,
  stores: {},
  appliedMigrations: [],
});

const toFiniteNumber = (value, fallback) => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  return num;
};

const normalizeAppliedMigrations = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, 200);
};

const normalizeRegistry = (raw) => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ...DEFAULT_REGISTRY };
  }

  const storesRaw =
    raw.stores && typeof raw.stores === 'object' && !Array.isArray(raw.stores) ? raw.stores : {};

  const stores = {};
  Object.entries(storesRaw).forEach(([key, entry]) => {
    if (!key) return;
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return;
    const schemaVersion = toFiniteNumber(entry.schemaVersion, null);
    if (!Number.isFinite(schemaVersion) || schemaVersion <= 0) return;
    stores[key] = {
      schemaVersion,
      updatedAt: toFiniteNumber(entry.updatedAt, 0),
    };
  });

  return {
    schemaVersion: STORAGE_SCHEMA_REGISTRY_SCHEMA_VERSION,
    updatedAt: toFiniteNumber(raw.updatedAt, 0),
    stores,
    appliedMigrations: normalizeAppliedMigrations(raw.appliedMigrations),
  };
};

const inferSchemaVersionFromStorageKey = (key) => {
  const raw = String(key || '').trim();
  if (!raw) return 1;
  const match = raw.match(/\.v(\d+)$/i);
  if (!match) return 1;
  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const writeRegistry = (next) => {
  writeStorageRaw(STORAGE_KEY, JSON.stringify(next));
};

export const getStorageSchemaRegistry = () => {
  if (typeof window === 'undefined') return { ...DEFAULT_REGISTRY };
  const parsed = safeJsonParse(readStorageRaw(STORAGE_KEY), null);
  return normalizeRegistry(parsed);
};

export const ensureStorageSchemaBaseline = () => {
  if (typeof window === 'undefined') return getStorageSchemaRegistry();

  const registry = getStorageSchemaRegistry();
  const nextStores = { ...registry.stores };
  let changed = false;

  Object.values(STORAGE_KEYS).forEach((key) => {
    if (!key) return;
    const existing = nextStores[key];
    if (existing && Number.isFinite(existing.schemaVersion) && existing.schemaVersion > 0) return;

    nextStores[key] = {
      schemaVersion: inferSchemaVersionFromStorageKey(key),
      updatedAt: Date.now(),
    };
    changed = true;
  });

  if (!changed) return registry;

  const next = {
    ...registry,
    schemaVersion: STORAGE_SCHEMA_REGISTRY_SCHEMA_VERSION,
    updatedAt: Date.now(),
    stores: nextStores,
  };
  writeRegistry(next);
  return next;
};

export const hasAppliedStorageMigration = (migrationId) => {
  const id = String(migrationId || '').trim();
  if (!id) return false;
  return getStorageSchemaRegistry().appliedMigrations.includes(id);
};

export const markStorageMigrationApplied = (migrationId) => {
  if (typeof window === 'undefined') return getStorageSchemaRegistry();

  const id = String(migrationId || '').trim();
  if (!id) return getStorageSchemaRegistry();

  const registry = getStorageSchemaRegistry();
  if (registry.appliedMigrations.includes(id)) return registry;

  const next = {
    ...registry,
    updatedAt: Date.now(),
    appliedMigrations: [...registry.appliedMigrations, id].slice(0, 200),
  };
  writeRegistry(next);
  return next;
};

export const setStorageSchemaVersion = (storageKey, schemaVersion) => {
  if (typeof window === 'undefined') return getStorageSchemaRegistry();

  const key = String(storageKey || '').trim();
  const nextSchema = toFiniteNumber(schemaVersion, null);
  if (!key) return getStorageSchemaRegistry();
  if (!Number.isFinite(nextSchema) || nextSchema <= 0) return getStorageSchemaRegistry();

  const registry = getStorageSchemaRegistry();
  const current = registry.stores[key];
  if (current?.schemaVersion === nextSchema) return registry;

  const next = {
    ...registry,
    updatedAt: Date.now(),
    stores: {
      ...registry.stores,
      [key]: { schemaVersion: nextSchema, updatedAt: Date.now() },
    },
  };
  writeRegistry(next);
  return next;
};

export const STORAGE_SCHEMA_REGISTRY_KEY = STORAGE_KEY;
