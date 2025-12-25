const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .trim();

const splitTokens = (value) => normalizeText(value).split(/\s+/).filter(Boolean);

const splitTypeTokens = (value) =>
  normalizeText(value)
    .split(/[、,，/]+|\s+/g)
    .map((token) => token.trim())
    .filter(Boolean);

const bumpCount = (map, key) => {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + 1);
};

export const buildAnimeFacets = (animeList) => {
  const tags = new Map();
  const studios = new Map();
  const statuses = new Map();
  const types = new Map();
  const years = new Map();

  let yearMin = null;
  let yearMax = null;
  let ratingMin = null;
  let ratingMax = null;

  const list = Array.isArray(animeList) ? animeList : [];
  for (const anime of list) {
    if (!anime) continue;

    const year = Number(anime.releaseYear);
    if (Number.isFinite(year)) {
      bumpCount(years, year);
      yearMin = yearMin === null ? year : Math.min(yearMin, year);
      yearMax = yearMax === null ? year : Math.max(yearMax, year);
    }

    const rating = Number(anime.rating);
    if (Number.isFinite(rating)) {
      ratingMin = ratingMin === null ? rating : Math.min(ratingMin, rating);
      ratingMax = ratingMax === null ? rating : Math.max(ratingMax, rating);
    }

    bumpCount(studios, anime.studio || '');
    bumpCount(statuses, anime.status || '');

    const typeTokens = splitTypeTokens(anime.type);
    typeTokens.forEach((token) => bumpCount(types, token));

    const animeTags = Array.isArray(anime.tags) ? anime.tags : [];
    animeTags.forEach((tag) => bumpCount(tags, tag));
  }

  return {
    tags,
    studios,
    statuses,
    types,
    years,
    ranges: {
      yearMin,
      yearMax,
      ratingMin,
      ratingMax,
    },
  };
};

const normalizeSet = (value) => {
  if (!value) return new Set();
  if (Array.isArray(value)) {
    return new Set(value.map((v) => String(v).trim()).filter(Boolean));
  }
  if (value instanceof Set) return new Set(Array.from(value.values()));
  return new Set([String(value).trim()].filter(Boolean));
};

export const applyAnimeFilters = (
  animeList,
  {
    query = '',
    tags = [],
    studios = [],
    statuses = [],
    types = [],
    yearMin = null,
    yearMax = null,
    minRating = null,
  } = {},
) => {
  const list = Array.isArray(animeList) ? animeList : [];
  const tokens = splitTokens(query);

  const tagSet = normalizeSet(tags);
  const studioSet = normalizeSet(studios);
  const statusSet = normalizeSet(statuses);
  const typeSet = normalizeSet(types);

  const toOptionalNumber = (value) => {
    if (value === null || typeof value === 'undefined') return null;
    if (typeof value === 'string' && value.trim() === '') return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  };

  const numericYearMin = toOptionalNumber(yearMin);
  const numericYearMax = toOptionalNumber(yearMax);
  const numericMinRating = toOptionalNumber(minRating);

  const out = [];
  for (const anime of list) {
    if (!anime) continue;

    if (tokens.length > 0) {
      const haystack = normalizeText(
        [anime.title, anime.originalTitle, anime.studio, anime.type, ...(anime.tags || [])].join(
          ' ',
        ),
      );

      const ok = tokens.every((t) => haystack.includes(t));
      if (!ok) continue;
    }

    if (tagSet.size > 0) {
      const animeTags = Array.isArray(anime.tags) ? anime.tags : [];
      const hasAny = animeTags.some((tag) => tagSet.has(String(tag)));
      if (!hasAny) continue;
    }

    if (studioSet.size > 0) {
      const studio = String(anime.studio || '').trim();
      if (!studioSet.has(studio)) continue;
    }

    if (statusSet.size > 0) {
      const status = String(anime.status || '').trim();
      if (!statusSet.has(status)) continue;
    }

    if (typeSet.size > 0) {
      const tokens = splitTypeTokens(anime.type);
      const hasAny = tokens.some((token) => typeSet.has(token));
      if (!hasAny) continue;
    }

    const year = Number(anime.releaseYear);
    if (numericYearMin !== null && Number.isFinite(year) && year < numericYearMin) continue;
    if (numericYearMax !== null && Number.isFinite(year) && year > numericYearMax) continue;

    const rating = Number(anime.rating);
    if (numericMinRating !== null && Number.isFinite(rating) && rating < numericMinRating)
      continue;

    out.push(anime);
  }

  return out;
};

export const getTopFacetEntries = (facetMap, { limit = 12 } = {}) => {
  const entries = Array.from((facetMap instanceof Map ? facetMap : new Map()).entries());
  entries.sort((a, b) => b[1] - a[1]);
  return entries.slice(0, Math.max(0, Number(limit) || 0));
};
