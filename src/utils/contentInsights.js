// 内容洞察工具：基于本地数据生成标签趋势、工作室雷达与口碑脉冲指标。
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const ensureArray = (value) => (Array.isArray(value) ? value : []);
const normalizeText = (value) => String(value || '').trim();

const scoreByRange = (value, { min = 0, max = 100 } = {}) => {
  if (!Number.isFinite(value)) return 0;
  if (max <= min) return 0;
  return Math.round(((value - min) / (max - min)) * 100);
};

export const buildTagPulse = (animeList = [], { limit = 10 } = {}) => {
  const map = new Map();

  animeList.forEach((anime) => {
    if (!anime) return;
    const rating = toNumber(anime.rating, 0);
    const popularity = toNumber(anime.popularity, 0);
    const tags = new Set([
      ...ensureArray(anime.tags).map(normalizeText).filter(Boolean),
      normalizeText(anime.type?.split('、')?.[0] ?? ''),
    ]);

    tags.forEach((tag) => {
      if (!tag) return;
      const current = map.get(tag) || {
        tag,
        count: 0,
        ratingSum: 0,
        popularitySum: 0,
      };
      current.count += 1;
      current.ratingSum += rating;
      current.popularitySum += popularity;
      map.set(tag, current);
    });
  });

  const items = Array.from(map.values()).map((item) => {
    const avgRating = item.count ? item.ratingSum / item.count : 0;
    const avgPopularity = item.count ? item.popularitySum / item.count : 0;
    const momentum = avgRating * 20 + avgPopularity / 120 + item.count * 1.2;
    return {
      tag: item.tag,
      count: item.count,
      avgRating: Number(avgRating.toFixed(2)),
      avgPopularity: Math.round(avgPopularity),
      momentum,
    };
  });

  const sorted = items.sort((a, b) => b.momentum - a.momentum).slice(0, limit);
  const maxMomentum = Math.max(...sorted.map((item) => item.momentum), 1);

  return sorted.map((item) => ({
    ...item,
    heat: scoreByRange(item.momentum, { min: 0, max: maxMomentum }),
  }));
};

export const buildStudioRadar = (animeList = [], { limit = 6 } = {}) => {
  const map = new Map();

  animeList.forEach((anime) => {
    const studio = normalizeText(anime?.studio || '未知工作室');
    const rating = toNumber(anime?.rating, 0);
    const popularity = toNumber(anime?.popularity, 0);
    if (!studio) return;

    const current = map.get(studio) || {
      studio,
      count: 0,
      ratingSum: 0,
      popularitySum: 0,
      topAnime: null,
    };

    current.count += 1;
    current.ratingSum += rating;
    current.popularitySum += popularity;
    if (!current.topAnime || rating > current.topAnime.rating) {
      current.topAnime = {
        id: anime?.id,
        title: anime?.title,
        rating,
      };
    }

    map.set(studio, current);
  });

  const items = Array.from(map.values()).map((item) => {
    const avgRating = item.count ? item.ratingSum / item.count : 0;
    const avgPopularity = item.count ? item.popularitySum / item.count : 0;
    const momentum = avgRating * 18 + avgPopularity / 150 + item.count * 1.5;
    return {
      studio: item.studio,
      count: item.count,
      avgRating: Number(avgRating.toFixed(2)),
      avgPopularity: Math.round(avgPopularity),
      topAnime: item.topAnime,
      momentum,
    };
  });

  const sorted = items.sort((a, b) => b.momentum - a.momentum).slice(0, limit);
  const maxMomentum = Math.max(...sorted.map((item) => item.momentum), 1);

  return sorted.map((item) => ({
    ...item,
    heat: scoreByRange(item.momentum, { min: 0, max: maxMomentum }),
  }));
};

const extractKeywords = (reviews = []) => {
  const stopWords = new Set([
    '非常',
    '感觉',
    '觉得',
    '剧情',
    '故事',
    '角色',
    '动画',
    '国漫',
    '制作',
    '精彩',
    '好看',
    '喜欢',
  ]);
  const map = new Map();

  reviews.forEach((review) => {
    const text = normalizeText(review?.comment || '');
    if (!text) return;
    const tokens = text.match(/[\u4e00-\u9fa5]{2,4}/g) || [];
    tokens.forEach((token) => {
      if (stopWords.has(token)) return;
      map.set(token, (map.get(token) || 0) + 1);
    });
  });

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
};

export const buildAudiencePulse = (anime) => {
  if (!anime) return null;
  const reviews = ensureArray(anime.reviews);
  const reviewCount = reviews.length;
  const rating = toNumber(anime.rating, 0);
  const popularity = toNumber(anime.popularity, 0);
  const reviewRatings = reviews
    .map((review) => toNumber(review.rating, 0))
    .filter((value) => value > 0);

  const avgReviewRating = reviewRatings.length
    ? reviewRatings.reduce((sum, value) => sum + value, 0) / reviewRatings.length
    : rating;

  const variance = reviewRatings.length
    ? reviewRatings.reduce((sum, value) => sum + (value - avgReviewRating) ** 2, 0) /
      reviewRatings.length
    : 0;

  const heatRaw = avgReviewRating * 16 + Math.min(popularity / 1200, 10) * 6 + reviewCount * 4;
  const heat = clamp(Math.round(heatRaw), 0, 100);

  const tone = avgReviewRating >= 4.6
    ? '口碑爆棚'
    : avgReviewRating >= 4.2
      ? '口碑稳健'
      : avgReviewRating >= 3.6
        ? '争议分化'
        : '口碑待提升';

  const vibe = variance >= 1.2 ? '讨论度高' : '口碑集中';

  return {
    heat,
    tone,
    vibe,
    reviewCount,
    avgReviewRating: Number(avgReviewRating.toFixed(2)),
    keywords: extractKeywords(reviews),
  };
};
