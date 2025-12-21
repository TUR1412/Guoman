import { beforeEach, describe, expect, it } from 'vitest';

import {
  buildPosterSvg,
  clearSharePosters,
  getSharePosters,
  recordSharePoster,
  SHARE_POSTER_STORAGE_KEY,
} from './sharePoster';
import { flushStorageQueue } from './storageQueue';

describe('sharePoster', () => {
  beforeEach(() => {
    window.localStorage.clear();
    flushStorageQueue();
  });

  it('tolerates invalid storage payload', () => {
    window.localStorage.setItem(SHARE_POSTER_STORAGE_KEY, '{bad');
    expect(getSharePosters()).toEqual([]);
  });

  it('treats non-array payload as empty', () => {
    window.localStorage.setItem(SHARE_POSTER_STORAGE_KEY, JSON.stringify({}));
    expect(getSharePosters()).toEqual([]);
  });

  it('records share poster history', () => {
    recordSharePoster({ title: '凡人修仙传', subtitle: '推荐给你' });
    flushStorageQueue();
    expect(getSharePosters().length).toBe(1);
    expect(getSharePosters()[0]).toEqual(expect.objectContaining({ title: '凡人修仙传' }));
  });

  it('supports read-after-write before storage flush', () => {
    recordSharePoster({ title: 'A', subtitle: 'B' });
    // 不 flush：readStore 应走 pending write 分支
    expect(getSharePosters().length).toBe(1);
    flushStorageQueue();
    expect(getSharePosters().length).toBe(1);
  });

  it('can clear poster history', () => {
    recordSharePoster({ title: 'A', subtitle: 'B' });
    expect(getSharePosters().length).toBe(1);
    clearSharePosters();
    expect(getSharePosters()).toEqual([]);
  });

  it('buildPosterSvg sanitizes inputs and uses fallback rating text', () => {
    const svg = buildPosterSvg({
      title: 'x'.repeat(200),
      subtitle: 'y'.repeat(200),
    });

    expect(svg).toContain('<?xml');
    expect(svg).toContain('<svg');
    expect(svg).toContain('国漫世界');
  });

  it('buildPosterSvg tolerates missing title/subtitle', () => {
    const svg = buildPosterSvg({ rating: '' });
    expect(svg).toContain('<svg');
  });

  it('buildPosterSvg renders rating when provided', () => {
    const svg = buildPosterSvg({ title: 'A', subtitle: 'B', rating: '9.9' });
    expect(svg).toContain('评分 9.9');
  });
});
