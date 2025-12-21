import { beforeEach, describe, expect, it } from 'vitest';

import {
  addComment,
  clearComments,
  COMMENTS_STORAGE_KEY,
  getCommentsForAnime,
} from './commentsStore';
import { flushStorageQueue } from './storageQueue';

describe('commentsStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    flushStorageQueue();
  });

  it('returns empty list for missing anime', () => {
    expect(getCommentsForAnime('1')).toEqual([]);
  });

  it('tolerates invalid storage payload', () => {
    window.localStorage.setItem(COMMENTS_STORAGE_KEY, '{bad-json');
    expect(getCommentsForAnime('1')).toEqual([]);
  });

  it('addComment validates required fields', () => {
    expect(addComment({ animeId: '', comment: 'x' })).toBeNull();
    expect(addComment({ animeId: '1', comment: '' })).toBeNull();
  });

  it('addComment stores entry and defaults', () => {
    const entry = addComment({ animeId: '1', comment: '不错', rating: '5' });
    flushStorageQueue();

    expect(entry).toEqual(
      expect.objectContaining({
        user: '访客',
        comment: '不错',
        rating: 5,
      }),
    );

    const list = getCommentsForAnime('1');
    expect(list.length).toBe(1);
    expect(list[0].comment).toBe('不错');
  });

  it('clearComments clears per-anime and global', () => {
    addComment({ animeId: '1', comment: 'a' });
    addComment({ animeId: '2', comment: 'b' });
    flushStorageQueue();

    clearComments('1');
    flushStorageQueue();
    expect(getCommentsForAnime('1')).toEqual([]);
    expect(getCommentsForAnime('2').length).toBe(1);

    clearComments();
    flushStorageQueue();
    expect(getCommentsForAnime('2')).toEqual([]);
  });
});
