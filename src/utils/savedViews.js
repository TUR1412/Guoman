import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';
import { safeJsonParse } from './json';

const STORAGE_KEY = STORAGE_KEYS.savedViews;
const MAX_VIEWS = 24;
const MAX_NAME_LENGTH = 40;

const normalizeName = (value) =>
  String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, MAX_NAME_LENGTH);

const normalizeScope = (value) => {
  const scope = String(value || '').trim();
  if (!scope) return 'generic';
  return scope;
};

const normalizePayload = (payload) => {
  if (!payload || typeof payload !== 'object') return {};
  return payload;
};

const readViews = () => {
  const raw = hasPendingStorageWrite(STORAGE_KEY)
    ? getPendingStorageWriteValue(STORAGE_KEY)
    : safeLocalStorageGet(STORAGE_KEY);

  const parsed = safeJsonParse(raw, []);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const id = String(entry.id || '').trim();
      const name = normalizeName(entry.name);
      if (!id || !name) return null;

      const createdAt = Number.isFinite(Number(entry.createdAt))
        ? Number(entry.createdAt)
        : Date.now();
      const updatedAt = Number.isFinite(Number(entry.updatedAt))
        ? Number(entry.updatedAt)
        : createdAt;
      return {
        id,
        schemaVersion: 1,
        scope: normalizeScope(entry.scope),
        name,
        payload: normalizePayload(entry.payload),
        createdAt,
        updatedAt,
      };
    })
    .filter(Boolean);
};

const writeViews = (views) => {
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify((views || []).slice(0, MAX_VIEWS)));
};

export const getSavedViews = ({ scope } = {}) => {
  const list = readViews();
  if (!scope) return list;
  const target = String(scope || '').trim();
  return list.filter((entry) => entry.scope === target);
};

export const createSavedView = ({ name, scope, payload }) => {
  const normalizedName = normalizeName(name);
  if (!normalizedName) return null;

  const list = readViews();
  const now = Date.now();
  const entry = {
    id: `${now}-${Math.random().toString(16).slice(2, 6)}`,
    schemaVersion: 1,
    scope: normalizeScope(scope),
    name: normalizedName,
    payload: normalizePayload(payload),
    createdAt: now,
    updatedAt: now,
  };

  writeViews([entry, ...list].slice(0, MAX_VIEWS));
  return entry;
};

export const deleteSavedView = (id) => {
  const target = String(id || '').trim();
  if (!target) return;
  writeViews(readViews().filter((entry) => entry.id !== target));
};

export const renameSavedView = (id, nextName) => {
  const target = String(id || '').trim();
  const normalizedName = normalizeName(nextName);
  if (!target || !normalizedName) return;

  const now = Date.now();
  const next = readViews().map((entry) =>
    entry.id === target ? { ...entry, name: normalizedName, updatedAt: now } : entry,
  );
  writeViews(next);
};

export const clearSavedViews = () => {
  writeViews([]);
};

export const SAVED_VIEWS_STORAGE_KEY = STORAGE_KEY;
