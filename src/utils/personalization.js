import { safeLocalStorageGet } from './storage';
import { getPendingStorageWriteValue, hasPendingStorageWrite } from './storageQueue';
import { getContinueWatchingList } from './watchProgress';
import { getRecentlyViewed } from './recentlyViewed';
import { STORAGE_KEYS } from './dataKeys';

const normalize = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const parseJsonArray = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const buildTasteProfile = ({
  animeById,
  favoriteIds = [],
  watchEntries = [],
  recentlyViewedIds = [],
  searchHistory = [],
} = {}) => {
  const tagWeights = new Map();
  const studioWeights = new Map();

  const bump = (map, key, value) => {
    const normalized = normalize(key);
    if (!normalized) return;
    map.set(normalized, (map.get(normalized) || 0) + value);
  };

  const bumpAnime = (anime, weight) => {
    if (!anime) return;
    ensureArray(anime.tags).forEach((tag) => bump(tagWeights, tag, weight));
    if (anime.studio) bump(studioWeights, anime.studio, weight * 0.6);
    if (anime.type) {
      const mainType = String(anime.type).split('、')[0];
      bump(tagWeights, mainType, weight * 0.25);
    }
  };

  favoriteIds.forEach((id) => bumpAnime(animeById.get(id), 4));

  watchEntries.forEach((entry) => {
    const anime = animeById.get(entry.id);
    const progressFactor = Math.min(Math.max(Number(entry.progress || 0) / 100, 0), 1);
    bumpAnime(anime, 1.2 + progressFactor * 2.2);
  });

  recentlyViewedIds.forEach((id) => bumpAnime(animeById.get(id), 0.9));

  ensureArray(searchHistory).forEach((q) => {
    const term = normalize(q);
    if (!term) return;
    bump(tagWeights, term, 0.55);
  });

  const top = (map, limit = 6) =>
    Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key, score]) => ({ key, score }));

  return {
    tagWeights,
    studioWeights,
    topTags: top(tagWeights, 6),
    topStudios: top(studioWeights, 4),
  };
};

export const recommendFromProfile = ({
  animeList = [],
  profile,
  excludeIds = [],
  limit = 8,
} = {}) => {
  const exclude = new Set(ensureArray(excludeIds).map((id) => Number(id)));
  const tagWeights = profile?.tagWeights || new Map();
  const studioWeights = profile?.studioWeights || new Map();

  const scoreAnime = (anime) => {
    const baseRating = Number(anime?.rating || 0) * 10;
    const basePopularity = Number(anime?.popularity || 0) / 1000;

    const tags = ensureArray(anime?.tags);
    const tagScore = tags.reduce((sum, tag) => sum + (tagWeights.get(normalize(tag)) || 0), 0);

    const typeMain = anime?.type ? String(anime.type).split('、')[0] : '';
    const typeScore = typeMain ? tagWeights.get(normalize(typeMain)) || 0 : 0;

    const studioScore = anime?.studio ? studioWeights.get(normalize(anime.studio)) || 0 : 0;
    return baseRating + basePopularity + tagScore + typeScore + studioScore;
  };

  const explain = (anime) => {
    const tags = ensureArray(anime?.tags)
      .map((t) => ({ t, w: tagWeights.get(normalize(t)) || 0 }))
      .filter((item) => item.w > 0)
      .sort((a, b) => b.w - a.w)
      .slice(0, 3)
      .map((item) => item.t);

    return { tags };
  };

  const ranked = ensureArray(animeList)
    .filter((anime) => anime?.id && !exclude.has(anime.id))
    .map((anime) => ({ anime, score: scoreAnime(anime), reasons: explain(anime) }))
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, Math.max(0, Number(limit) || 0));
};

export const getPersonalizedRecommendations = ({
  animeList,
  animeById,
  limit = 8,
  excludeIds = [],
} = {}) => {
  const rawFavorites = hasPendingStorageWrite(STORAGE_KEYS.favorites)
    ? getPendingStorageWriteValue(STORAGE_KEYS.favorites)
    : safeLocalStorageGet(STORAGE_KEYS.favorites);
  const rawHistory = hasPendingStorageWrite(STORAGE_KEYS.searchHistory)
    ? getPendingStorageWriteValue(STORAGE_KEYS.searchHistory)
    : safeLocalStorageGet(STORAGE_KEYS.searchHistory);

  const favoriteIds = parseJsonArray(rawFavorites)
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));

  const searchHistory = parseJsonArray(rawHistory)
    .map((q) => String(q || '').trim())
    .filter(Boolean)
    .slice(0, 20);

  const watchEntries = getContinueWatchingList({ limit: 10 });
  const recentlyViewedIds = getRecentlyViewed();

  const profile = buildTasteProfile({
    animeById,
    favoriteIds,
    watchEntries,
    recentlyViewedIds,
    searchHistory,
  });

  const ranked = recommendFromProfile({
    animeList,
    profile,
    excludeIds: [...favoriteIds, ...excludeIds],
    limit,
  });

  return { profile, ranked };
};
