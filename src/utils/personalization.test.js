import { describe, expect, it } from 'vitest';
import {
  buildTasteProfile,
  getPersonalizedRecommendations,
  recommendFromProfile,
} from './personalization';
import { flushStorageQueue } from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';

describe('personalization', () => {
  it('buildTasteProfile collects tag/studio weights', () => {
    const animeById = new Map([
      [
        1,
        {
          id: 1,
          tags: ['热血', '玄幻'],
          studio: 'A Studio',
          type: '动作、奇幻',
        },
      ],
    ]);

    const profile = buildTasteProfile({
      animeById,
      favoriteIds: [1],
      watchEntries: [],
      recentlyViewedIds: [],
      searchHistory: [],
    });

    expect(profile.topTags.map((t) => t.key)).toEqual(expect.arrayContaining(['热血', '玄幻']));
    expect(profile.topStudios[0]).toEqual(expect.objectContaining({ key: 'a studio' }));
  });

  it('recommendFromProfile ranks by taste and supports exclusions', () => {
    const animeList = [
      {
        id: 1,
        tags: ['热血', '玄幻'],
        studio: 'S1',
        rating: 5,
        popularity: 2000,
        type: '动作、奇幻',
      },
      {
        id: 2,
        tags: ['玄幻', '冒险'],
        studio: 'S1',
        rating: 4,
        popularity: 1200,
        type: '冒险、奇幻',
      },
      { id: 3, tags: ['日常'], studio: 'S2', rating: 2, popularity: 9000, type: '日常、治愈' },
    ];
    const animeById = new Map(animeList.map((a) => [a.id, a]));
    const profile = buildTasteProfile({ animeById, favoriteIds: [1] });

    const ranked = recommendFromProfile({ animeList, profile, excludeIds: [1], limit: 2 });
    expect(ranked[0].anime.id).toBe(2);
    expect(ranked[0].reasons.tags).toEqual(expect.arrayContaining(['玄幻']));
  });

  it('getPersonalizedRecommendations reads local signals', () => {
    window.localStorage.clear();
    flushStorageQueue();

    window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([1]));
    window.localStorage.setItem(STORAGE_KEYS.searchHistory, JSON.stringify(['玄幻']));

    const animeList = [
      {
        id: 1,
        tags: ['热血', '玄幻'],
        studio: 'S1',
        rating: 5,
        popularity: 2000,
        type: '动作、奇幻',
      },
      {
        id: 2,
        tags: ['玄幻', '冒险'],
        studio: 'S1',
        rating: 4,
        popularity: 1200,
        type: '冒险、奇幻',
      },
      { id: 3, tags: ['日常'], studio: 'S2', rating: 2, popularity: 9000, type: '日常、治愈' },
    ];
    const animeById = new Map(animeList.map((a) => [a.id, a]));

    const res = getPersonalizedRecommendations({ animeList, animeById, limit: 2 });
    expect(res.profile.topTags.map((t) => t.key)).toEqual(expect.arrayContaining(['玄幻']));
    expect(res.ranked[0].anime.id).toBe(2);
  });

  it('recommendFromProfile respects limit and tolerates empty inputs', () => {
    const res = recommendFromProfile({ animeList: [], profile: null, limit: 0 });
    expect(res).toEqual([]);

    const resNegative = recommendFromProfile({ animeList: [], profile: null, limit: -1 });
    expect(resNegative).toEqual([]);
  });

  it('buildTasteProfile tolerates missing/invalid anime fields', () => {
    const animeById = new Map([
      [
        1,
        {
          id: 1,
          tags: 'not-array',
          studio: '',
          type: '',
        },
      ],
    ]);

    const profile = buildTasteProfile({
      animeById,
      favoriteIds: [1],
      watchEntries: [{ id: 999, progress: 30 }],
      recentlyViewedIds: [2],
      searchHistory: ['  ', null, '热血'],
    });

    expect(profile.topTags.map((t) => t.key)).toEqual(expect.arrayContaining(['热血']));
  });

  it('getPersonalizedRecommendations tolerates invalid stored JSON', () => {
    window.localStorage.clear();
    flushStorageQueue();

    window.localStorage.setItem(STORAGE_KEYS.favorites, '{bad');
    window.localStorage.setItem(STORAGE_KEYS.searchHistory, JSON.stringify({}));

    const animeList = [{ id: 1, tags: ['热血'], studio: 'S', rating: 5, popularity: 1, type: '' }];
    const animeById = new Map(animeList.map((a) => [a.id, a]));

    const res = getPersonalizedRecommendations({ animeList, animeById, limit: 3 });
    expect(Array.isArray(res.ranked)).toBe(true);
    expect(res.profile.topTags.length).toBeGreaterThanOrEqual(0);
  });
});
