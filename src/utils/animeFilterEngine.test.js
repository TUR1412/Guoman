import { describe, expect, it } from 'vitest';

import { applyAnimeFilters, buildAnimeFacets, getTopFacetEntries } from './animeFilterEngine';

const sample = [
  {
    id: 1,
    title: '斗罗大陆',
    originalTitle: 'Douluo Dalu',
    type: '动作、奇幻、冒险',
    releaseYear: 2018,
    status: '连载中',
    rating: 4.7,
    studio: '玄机科技',
    tags: ['玄幻', '热血'],
  },
  {
    id: 2,
    title: '天官赐福',
    originalTitle: "Heaven Official's Blessing",
    type: '仙侠、奇幻、古风',
    releaseYear: 2020,
    status: '已完结',
    rating: 4.9,
    studio: '绘梦动画',
    tags: ['古风', '奇幻'],
  },
  {
    id: 3,
    title: '全职高手',
    originalTitle: "The King's Avatar",
    type: '游戏、电竞、热血',
    releaseYear: 2017,
    status: '已完结',
    rating: 4.6,
    studio: '彩色铅笔',
    tags: ['电竞', '团队'],
  },
];

describe('animeFilterEngine', () => {
  it('handles null/empty inputs and empty filters', () => {
    expect(applyAnimeFilters(null)).toEqual([]);
    expect(applyAnimeFilters(sample, {})).toEqual(sample);
    expect(applyAnimeFilters(sample, { query: '不存在' })).toEqual([]);
  });

  it('filters by query tokens', () => {
    const out = applyAnimeFilters(sample, { query: '斗罗' });
    expect(out.map((a) => a.id)).toEqual([1]);
  });

  it('requires all query tokens to match (AND semantics)', () => {
    expect(applyAnimeFilters(sample, { query: '斗罗 热血' }).map((a) => a.id)).toEqual([1]);
    expect(applyAnimeFilters(sample, { query: '斗罗 电竞' })).toEqual([]);
  });

  it('filters by tags (any-match)', () => {
    const out = applyAnimeFilters(sample, { tags: ['古风', '电竞'] });
    expect(out.map((a) => a.id).sort()).toEqual([2, 3]);
  });

  it('supports tags/studios/statuses/types provided as Set or scalar', () => {
    expect(applyAnimeFilters(sample, { studios: new Set(['玄机科技']) }).map((a) => a.id)).toEqual([
      1,
    ]);
    expect(
      applyAnimeFilters(sample, { statuses: '已完结' })
        .map((a) => a.id)
        .sort(),
    ).toEqual([2, 3]);
    expect(applyAnimeFilters(sample, { types: '电竞' }).map((a) => a.id)).toEqual([3]);
  });

  it('filters by studio/status/year/rating', () => {
    const out = applyAnimeFilters(sample, {
      studios: ['绘梦动画'],
      statuses: ['已完结'],
      yearMin: 2019,
      minRating: 4.8,
    });
    expect(out.map((a) => a.id)).toEqual([2]);
  });

  it('treats empty-string numeric filters as unset', () => {
    expect(
      applyAnimeFilters(sample, { yearMin: '', yearMax: '  ', minRating: '' })
        .map((a) => a.id)
        .sort(),
    ).toEqual([1, 2, 3]);
  });

  it('does not filter out items when year/rating are non-finite', () => {
    const extended = [
      ...sample,
      {
        id: 4,
        title: '测试条目',
        originalTitle: 'Unknown',
        type: '',
        releaseYear: '未知',
        status: '',
        rating: 'N/A',
        studio: '',
        tags: null,
      },
    ];

    const out = applyAnimeFilters(extended, { yearMin: 2019, minRating: 4.8 });
    expect(out.some((a) => a.id === 4)).toBe(true);
  });

  it('builds facets and returns sorted top entries', () => {
    const facets = buildAnimeFacets(sample);
    const topStudios = getTopFacetEntries(facets.studios, { limit: 2 }).map(([k]) => k);
    expect(topStudios.length).toBe(2);
    expect(facets.ranges.yearMin).toBe(2017);
    expect(facets.ranges.yearMax).toBe(2020);
  });

  it('builds facets defensively for missing fields', () => {
    const facets = buildAnimeFacets([
      null,
      undefined,
      { id: 'x', tags: 'bad', type: null, studio: '', status: '' },
    ]);
    expect(facets.tags.size).toBe(0);
    expect(facets.studios.size).toBe(0);
    expect(facets.statuses.size).toBe(0);
    expect(facets.types.size).toBe(0);
    expect(facets.years.size).toBe(0);
    expect(facets.ranges.yearMin).toBeNull();
    expect(facets.ranges.ratingMin).toBeNull();
  });

  it('getTopFacetEntries is safe for non-Map inputs and negative limits', () => {
    expect(getTopFacetEntries(null)).toEqual([]);
    expect(getTopFacetEntries(new Map([['a', 1]]), { limit: -1 })).toEqual([]);
  });
});
