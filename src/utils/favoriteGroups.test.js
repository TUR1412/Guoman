import { beforeEach, describe, expect, it } from 'vitest';

import {
  assignFavoriteToGroup,
  clearFavoriteGroups,
  createFavoriteGroup,
  deleteFavoriteGroup,
  FAVORITE_GROUPS_STORAGE_KEY,
  getFavoriteGroups,
  removeFavoriteFromGroup,
  renameFavoriteGroup,
} from './favoriteGroups';
import { flushStorageQueue } from './storageQueue';

describe('favoriteGroups', () => {
  beforeEach(() => {
    window.localStorage.clear();
    flushStorageQueue();
  });

  it('tolerates invalid storage payload', () => {
    window.localStorage.setItem(FAVORITE_GROUPS_STORAGE_KEY, '{bad');
    expect(getFavoriteGroups()).toEqual([]);
  });

  it('treats non-array payload as empty', () => {
    window.localStorage.setItem(FAVORITE_GROUPS_STORAGE_KEY, JSON.stringify({}));
    expect(getFavoriteGroups()).toEqual([]);
  });

  it('createFavoriteGroup validates name', () => {
    expect(createFavoriteGroup('')).toBeNull();
  });

  it('creates, renames, assigns and removes favorites', () => {
    const group = createFavoriteGroup('我的收藏夹');
    flushStorageQueue();
    expect(group).toEqual(expect.objectContaining({ name: '我的收藏夹', itemIds: [] }));

    renameFavoriteGroup(group.id, '改名');
    flushStorageQueue();
    expect(getFavoriteGroups()[0].name).toBe('改名');

    assignFavoriteToGroup(group.id, 1);
    assignFavoriteToGroup(group.id, 1);
    assignFavoriteToGroup(group.id, 2);
    flushStorageQueue();
    expect(getFavoriteGroups()[0].itemIds.sort()).toEqual([1, 2]);

    removeFavoriteFromGroup(group.id, 1);
    flushStorageQueue();
    expect(getFavoriteGroups()[0].itemIds).toEqual([2]);
  });

  it('assignFavoriteToGroup ignores invalid inputs', () => {
    assignFavoriteToGroup('', 1);
    assignFavoriteToGroup('g', null);
    flushStorageQueue();
    expect(getFavoriteGroups()).toEqual([]);
  });

  it('deletes and clears groups', () => {
    const a = createFavoriteGroup('a');
    const b = createFavoriteGroup('b');
    flushStorageQueue();
    expect(getFavoriteGroups().length).toBe(2);

    deleteFavoriteGroup(a.id);
    flushStorageQueue();
    expect(getFavoriteGroups().length).toBe(1);

    deleteFavoriteGroup(b.id);
    flushStorageQueue();
    expect(getFavoriteGroups()).toEqual([]);

    clearFavoriteGroups();
    flushStorageQueue();
    expect(getFavoriteGroups()).toEqual([]);
  });

  it('ignores updates for unknown group ids', () => {
    const group = createFavoriteGroup('x');
    flushStorageQueue();

    renameFavoriteGroup('missing', 'y');
    deleteFavoriteGroup('missing');
    removeFavoriteFromGroup('missing', 1);
    flushStorageQueue();

    expect(getFavoriteGroups().length).toBe(1);
    expect(getFavoriteGroups()[0].id).toBe(group.id);
  });
});
