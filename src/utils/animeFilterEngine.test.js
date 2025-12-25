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
  it('filters by query tokens', () => {
    const out = applyAnimeFilters(sample, { query: '斗罗' });
    expect(out.map((a) => a.id)).toEqual([1]);
  });

  it('filters by tags (any-match)', () => {
    const out = applyAnimeFilters(sample, { tags: ['古风', '电竞'] });
    expect(out.map((a) => a.id).sort()).toEqual([2, 3]);
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

  it('builds facets and returns sorted top entries', () => {
    const facets = buildAnimeFacets(sample);
    const topStudios = getTopFacetEntries(facets.studios, { limit: 2 }).map(([k]) => k);
    expect(topStudios.length).toBe(2);
    expect(facets.ranges.yearMin).toBe(2017);
    expect(facets.ranges.yearMax).toBe(2020);
  });
});
