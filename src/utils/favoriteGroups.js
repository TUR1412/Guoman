import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';

const STORAGE_KEY = STORAGE_KEYS.favoriteGroups;

const readGroups = () => {
  const raw = hasPendingStorageWrite(STORAGE_KEY)
    ? getPendingStorageWriteValue(STORAGE_KEY)
    : safeLocalStorageGet(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGroups = (groups) => {
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify(groups));
};

export const getFavoriteGroups = () => readGroups();

export const createFavoriteGroup = (name) => {
  if (!name) return null;
  const groups = readGroups();
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    name,
    itemIds: [],
    createdAt: Date.now(),
  };
  writeGroups([entry, ...groups]);
  return entry;
};

export const renameFavoriteGroup = (groupId, name) => {
  const groups = readGroups().map((group) => (group.id === groupId ? { ...group, name } : group));
  writeGroups(groups);
};

export const deleteFavoriteGroup = (groupId) => {
  const groups = readGroups().filter((group) => group.id !== groupId);
  writeGroups(groups);
};

export const assignFavoriteToGroup = (groupId, animeId) => {
  if (!groupId || !animeId) return;
  const groups = readGroups().map((group) => {
    if (group.id !== groupId) return group;
    const next = new Set([...(group.itemIds || []), animeId]);
    return { ...group, itemIds: Array.from(next) };
  });
  writeGroups(groups);
};

export const removeFavoriteFromGroup = (groupId, animeId) => {
  const groups = readGroups().map((group) => {
    if (group.id !== groupId) return group;
    const next = (group.itemIds || []).filter((id) => id !== animeId);
    return { ...group, itemIds: next };
  });
  writeGroups(groups);
};

export const clearFavoriteGroups = () => {
  writeGroups([]);
};

export const FAVORITE_GROUPS_STORAGE_KEY = STORAGE_KEY;
