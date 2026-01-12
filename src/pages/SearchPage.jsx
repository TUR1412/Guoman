import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from '../components/icons/feather';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import VirtualizedGrid from '../components/VirtualizedGrid';
import animeData, { animeIndex, tagCounts } from '../data/animeData';
import { usePersistedState } from '../utils/usePersistedState';
import { getCachedSearch, setCachedSearch } from '../utils/searchCache';
import {
  applyAnimeFilters,
  buildAnimeFacets,
  getTopFacetEntries,
} from '../utils/animeFilterEngine';
import { trackEvent } from '../utils/analytics';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { SelectField, TextField } from '../ui';

const SearchBar = styled.form.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
`;

const FiltersCard = styled.section.attrs({ 'data-card': true, 'data-divider': 'card' })`
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  display: grid;
  gap: var(--spacing-lg);
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const FiltersTitle = styled.h2`
  font-size: var(--text-3xl);
  letter-spacing: 0.01em;
`;

const FiltersMeta = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const FiltersGrid = styled.div.attrs({ 'data-grid': '12' })`
  --grid-gap: var(--spacing-lg);
  align-items: start;
`;

const Field = styled.div`
  display: grid;
  gap: var(--spacing-sm);
`;

const FieldLabel = styled.label`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const FilterChipRow = styled.div.attrs({ role: 'list' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const FilterChip = styled.button.attrs({ role: 'listitem', 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: var(--spacing-xs-plus) var(--spacing-md-compact);
  border-radius: var(--border-radius-pill);
  border: 1px solid ${(p) => (p.$active ? 'var(--chip-border-active)' : 'var(--chip-border)')};
  background: ${(p) => (p.$active ? 'var(--chip-bg-active)' : 'var(--chip-bg)')};
  color: ${(p) => (p.$active ? 'var(--text-primary)' : 'var(--text-secondary)')};
  font-size: var(--text-sm);
  transition: var(--transition);

  &:hover {
    border-color: var(--chip-border-hover);
    background: var(--chip-bg-hover);
    color: var(--text-primary);
  }
`;

const ChipCount = styled.span`
  font-size: var(--text-xs);
  color: var(--text-tertiary);
`;

const FiltersFooter = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const ResetButton = styled.button.attrs({ 'data-pressable': true })`
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-secondary);
  padding: 0.45rem 0.85rem;
  border-radius: var(--border-radius-pill);
  font-size: var(--text-xs);
  transition: var(--transition);

  &:hover {
    background: var(--surface-soft-hover);
    color: var(--text-primary);
  }
`;

const Button = styled.button.attrs({
  'data-pressable': true,
  'data-shimmer': true,
  'data-focus-guide': true,
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: 0.85rem var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--primary-soft-border);
  background: var(--primary-soft);
  color: var(--text-primary);
  font-weight: 700;
  transition: var(--transition);

  &:hover {
    box-shadow: var(--shadow-glow);
    background: var(--primary-soft-hover);
  }
`;

const Summary = styled.div`
  color: var(--text-tertiary);
`;

const ClearButton = styled.button.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-secondary);
  transition: var(--transition);

  &:hover {
    background: var(--surface-soft-hover);
    color: var(--text-primary);
  }
`;

const Label = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const HistoryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const HistoryClear = styled.button.attrs({ 'data-pressable': true })`
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-secondary);
  padding: 0.3rem 0.7rem;
  border-radius: var(--border-radius-pill);
  font-size: var(--text-xs);
  transition: var(--transition);

  &:hover {
    background: var(--surface-soft-hover);
    color: var(--text-primary);
  }
`;

const TagRow = styled.div.attrs({ role: 'list' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const TagChip = styled.button.attrs({ role: 'listitem', 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: var(--spacing-xs-plus) var(--spacing-md-compact);
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  transition: var(--transition);

  &:hover {
    border-color: var(--chip-border-hover);
    background: var(--chip-bg-hover);
    color: var(--text-primary);
  }
`;

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .trim();

const HISTORY_KEY = STORAGE_KEYS.searchHistory;
const FILTERS_KEY = STORAGE_KEYS.searchFilters;

const DEFAULT_FILTERS = Object.freeze({
  tags: [],
  types: [],
  statuses: [],
  studio: '',
  yearMin: null,
  yearMax: null,
  minRating: null,
});

const parseFilters = (raw) => {
  if (!raw) return DEFAULT_FILTERS;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_FILTERS;

    const tags = Array.isArray(parsed.tags) ? parsed.tags.map(String).filter(Boolean) : [];
    const types = Array.isArray(parsed.types) ? parsed.types.map(String).filter(Boolean) : [];
    const statuses = Array.isArray(parsed.statuses)
      ? parsed.statuses.map(String).filter(Boolean)
      : [];
    const studio = typeof parsed.studio === 'string' ? parsed.studio : '';

    const toNumOrNull = (value) => {
      if (value === null || typeof value === 'undefined') return null;
      if (typeof value === 'string' && value.trim() === '') return null;
      const num = Number(value);
      return Number.isFinite(num) ? num : null;
    };

    const yearMin = toNumOrNull(parsed.yearMin);
    const yearMax = toNumOrNull(parsed.yearMax);
    const minRating = toNumOrNull(parsed.minRating);

    return {
      tags,
      types,
      statuses,
      studio,
      yearMin,
      yearMax,
      minRating,
    };
  } catch {
    return DEFAULT_FILTERS;
  }
};

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const resetFlag = searchParams.get('reset') || '';
  const [value, setValue] = useState(q);
  const inputRef = useRef(null);
  const prefetchRef = useRef({ timeoutId: null, idleId: null, last: '' });
  const [history, setHistory] = usePersistedState(HISTORY_KEY, [], {
    serialize: (next) => JSON.stringify(next),
    deserialize: (raw) => {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    },
  });
  const [filters, setFilters] = usePersistedState(FILTERS_KEY, DEFAULT_FILTERS, {
    serialize: (next) => JSON.stringify(next),
    deserialize: parseFilters,
  });
  const searchInputId = useId();

  useEffect(() => {
    if (resetFlag !== '1') return;
    setFilters(DEFAULT_FILTERS);
    trackEvent('search.filters.reset');
    setSearchParams(q ? { q } : {});
  }, [q, resetFlag, setFilters, setSearchParams]);

  useEffect(() => {
    setValue(q);
  }, [q]);

  useEffect(() => {
    inputRef.current?.focus?.();
  }, []);

  const trendingTags = useMemo(() => {
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, []);

  const hasActiveFilters = useMemo(() => {
    if (!filters) return false;
    if (Array.isArray(filters.tags) && filters.tags.length > 0) return true;
    if (Array.isArray(filters.types) && filters.types.length > 0) return true;
    if (Array.isArray(filters.statuses) && filters.statuses.length > 0) return true;
    if (filters.studio) return true;
    if (filters.yearMin != null) return true;
    if (filters.yearMax != null) return true;
    if (filters.minRating != null) return true;
    return false;
  }, [filters]);

  const normalizedQuery = useMemo(() => normalize(q), [q]);
  const cachedIds = useMemo(() => getCachedSearch(normalizedQuery), [normalizedQuery]);

  const queryResults = useMemo(() => {
    if (!normalizedQuery) return animeData;

    if (cachedIds && cachedIds.length > 0) {
      return cachedIds.map((id) => animeIndex.get(id)).filter(Boolean);
    }

    const list = applyAnimeFilters(animeData, { query: normalizedQuery });
    list.sort(
      (a, b) =>
        (Number(b.popularity) || 0) - (Number(a.popularity) || 0) ||
        (Number(b.rating) || 0) - (Number(a.rating) || 0) ||
        (Number(b.releaseYear) || 0) - (Number(a.releaseYear) || 0),
    );
    return list;
  }, [cachedIds, normalizedQuery]);

  const results = useMemo(() => {
    const list = applyAnimeFilters(queryResults, {
      query: '',
      tags: filters.tags,
      types: filters.types,
      statuses: filters.statuses,
      studios: filters.studio ? [filters.studio] : [],
      yearMin: filters.yearMin,
      yearMax: filters.yearMax,
      minRating: filters.minRating,
    });

    const next = [...list];
    next.sort(
      (a, b) =>
        (Number(b.popularity) || 0) - (Number(a.popularity) || 0) ||
        (Number(b.rating) || 0) - (Number(a.rating) || 0) ||
        (Number(b.releaseYear) || 0) - (Number(a.releaseYear) || 0),
    );
    return next;
  }, [filters, queryResults]);

  useEffect(() => {
    if (!normalizedQuery) return;
    if (cachedIds && cachedIds.length > 0) return;
    setCachedSearch(
      normalizedQuery,
      queryResults.map((anime) => anime.id),
    );
  }, [cachedIds, normalizedQuery, queryResults]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const next = normalize(value);
    if (!next) return undefined;
    if (next.length < 2) return undefined;
    if (next === normalizedQuery) return undefined;
    if (prefetchRef.current.last === next) return undefined;
    if (getCachedSearch(next)) return undefined;

    if (prefetchRef.current.timeoutId) {
      window.clearTimeout(prefetchRef.current.timeoutId);
      prefetchRef.current.timeoutId = null;
    }
    if (prefetchRef.current.idleId && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(prefetchRef.current.idleId);
      prefetchRef.current.idleId = null;
    }

    const run = () => {
      try {
        prefetchRef.current.idleId = null;
        prefetchRef.current.timeoutId = null;
        const list = applyAnimeFilters(animeData, { query: next });
        list.sort(
          (a, b) =>
            (Number(b.popularity) || 0) - (Number(a.popularity) || 0) ||
            (Number(b.rating) || 0) - (Number(a.rating) || 0) ||
            (Number(b.releaseYear) || 0) - (Number(a.releaseYear) || 0),
        );
        setCachedSearch(
          next,
          list.map((anime) => anime.id),
        );
        prefetchRef.current.last = next;
      } catch {}
    };

    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') {
        prefetchRef.current.idleId = window.requestIdleCallback(run, { timeout: 1400 });
        return;
      }

      prefetchRef.current.timeoutId = window.setTimeout(run, 0);
    };

    const debounceId = window.setTimeout(schedule, 220);

    return () => {
      window.clearTimeout(debounceId);
    };
  }, [normalizedQuery, value]);

  const baseFacets = useMemo(() => buildAnimeFacets(queryResults), [queryResults]);
  const liveFacets = useMemo(() => buildAnimeFacets(results), [results]);

  const yearOptions = useMemo(() => {
    const years = Array.from(baseFacets.years.keys()).filter((y) => Number.isFinite(Number(y)));
    years.sort((a, b) => Number(b) - Number(a));
    return years.map((y) => Number(y));
  }, [baseFacets.years]);

  const studioOptions = useMemo(
    () => getTopFacetEntries(baseFacets.studios, { limit: 18 }),
    [baseFacets.studios],
  );

  const statusOptions = useMemo(
    () => getTopFacetEntries(baseFacets.statuses, { limit: 8 }),
    [baseFacets.statuses],
  );

  const typeOptions = useMemo(
    () => getTopFacetEntries(baseFacets.types, { limit: 10 }),
    [baseFacets.types],
  );

  const tagOptions = useMemo(
    () => getTopFacetEntries(baseFacets.tags, { limit: 16 }),
    [baseFacets.tags],
  );

  const onSubmit = (e) => {
    e.preventDefault();
    const next = value.trim();
    if (next) {
      setHistory((prev) => {
        const updated = [next, ...prev.filter((item) => item !== next)].slice(0, 8);
        return updated;
      });
      trackEvent('search.submit', { query: next });
    }
    setSearchParams(next ? { q: next } : {});
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Escape') return;
    setValue('');
    setSearchParams({});
    inputRef.current?.focus?.();
  };

  return (
    <PageShell
      title="搜索"
      subtitle="按标题 / 原名 / 类型 / 标签 / 制作方搜索。支持多关键词（空格分隔）。"
      badge="搜索"
      meta={<span>多关键词 · 实时预取 · 高级筛选 · 虚拟滚动 · ESC 清空</span>}
    >
      <SearchBar onSubmit={onSubmit} role="search" aria-label="站内搜索">
        <span id="guoman-search-page-hint" className="sr-only">
          支持多关键词搜索，空格分隔；例如：古风 仙侠
        </span>
        <label className="sr-only" htmlFor={searchInputId}>
          搜索关键词
        </label>
        <TextField
          id={searchInputId}
          type="search"
          name="q"
          aria-label="搜索关键词"
          aria-describedby="guoman-search-page-hint"
          inputRef={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例如：古风 仙侠 / 斗罗 / 绘梦动画"
          style={{ flex: 1 }}
        />
        <Button type="submit">
          <FiSearch />
          搜索
        </Button>
        {value ? (
          <ClearButton
            type="button"
            aria-label="清空搜索"
            onClick={() => {
              setValue('');
              setSearchParams({});
              inputRef.current?.focus?.();
            }}
          >
            清空
          </ClearButton>
        ) : null}
      </SearchBar>

      <FiltersCard aria-label="高级筛选">
        <FiltersHeader>
          <div>
            <FiltersTitle>高级筛选</FiltersTitle>
            <FiltersMeta>多级维度叠加 · 动态面板 · 本地 60FPS 虚拟滚动</FiltersMeta>
          </div>
          {hasActiveFilters ? (
            <ResetButton
              type="button"
              onClick={() => {
                setFilters(DEFAULT_FILTERS);
                trackEvent('search.filters.reset');
              }}
            >
              清空筛选
            </ResetButton>
          ) : (
            <FiltersMeta>未启用筛选</FiltersMeta>
          )}
        </FiltersHeader>

        <FiltersGrid>
          <div data-col-span="12" data-col-span-md="6">
            <SelectField
              id="guoman-search-filter-studio"
              label="制作方"
              value={filters.studio}
              onChange={(e) => {
                const nextStudio = e.target.value;
                setFilters((prev) => ({ ...prev, studio: nextStudio }));
                trackEvent('search.filter.studio', { studio: nextStudio || null });
              }}
            >
              <option value="">不限</option>
              {studioOptions.map(([studio, count]) => (
                <option key={studio} value={studio}>
                  {studio}（{count}）
                </option>
              ))}
            </SelectField>
          </div>

          <div data-col-span="12" data-col-span-md="6">
            <SelectField
              id="guoman-search-filter-rating"
              label="最低评分"
              value={filters.minRating == null ? '' : String(filters.minRating)}
              onChange={(e) => {
                const raw = e.target.value;
                const next = raw ? Number(raw) : null;
                setFilters((prev) => ({ ...prev, minRating: next }));
                trackEvent('search.filter.minRating', { minRating: next });
              }}
            >
              <option value="">不限</option>
              <option value="4">4.0+</option>
              <option value="4.2">4.2+</option>
              <option value="4.4">4.4+</option>
              <option value="4.6">4.6+</option>
              <option value="4.8">4.8+</option>
            </SelectField>
          </div>

          <div data-col-span="12" data-col-span-md="6">
            <SelectField
              id="guoman-search-filter-year-min"
              label="年份从"
              value={filters.yearMin == null ? '' : String(filters.yearMin)}
              onChange={(e) => {
                const raw = e.target.value;
                const next = raw ? Number.parseInt(raw, 10) : null;
                setFilters((prev) => {
                  const nextMax =
                    prev.yearMax != null && next != null && next > prev.yearMax
                      ? next
                      : prev.yearMax;
                  return { ...prev, yearMin: next, yearMax: nextMax };
                });
                trackEvent('search.filter.yearMin', { yearMin: next });
              }}
            >
              <option value="">不限</option>
              {yearOptions.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </SelectField>
          </div>

          <div data-col-span="12" data-col-span-md="6">
            <SelectField
              id="guoman-search-filter-year-max"
              label="年份到"
              value={filters.yearMax == null ? '' : String(filters.yearMax)}
              onChange={(e) => {
                const raw = e.target.value;
                const next = raw ? Number.parseInt(raw, 10) : null;
                setFilters((prev) => {
                  const nextMin =
                    prev.yearMin != null && next != null && next < prev.yearMin
                      ? next
                      : prev.yearMin;
                  return { ...prev, yearMax: next, yearMin: nextMin };
                });
                trackEvent('search.filter.yearMax', { yearMax: next });
              }}
            >
              <option value="">不限</option>
              {yearOptions.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </SelectField>
          </div>

          <Field data-col-span="12">
            <FieldLabel as="div">连载状态</FieldLabel>
            <FilterChipRow aria-label="连载状态筛选">
              {statusOptions.map(([status]) => {
                const active = filters.statuses.includes(status);
                const count = liveFacets.statuses.get(status) || 0;
                return (
                  <FilterChip
                    key={status}
                    type="button"
                    $active={active}
                    aria-pressed={active}
                    onClick={() => {
                      setFilters((prev) => {
                        const next = prev.statuses.includes(status)
                          ? prev.statuses.filter((s) => s !== status)
                          : [...prev.statuses, status];
                        return { ...prev, statuses: next };
                      });
                      trackEvent('search.filter.status.toggle', { status, active: !active });
                    }}
                  >
                    {status}
                    <ChipCount aria-hidden="true">{count}</ChipCount>
                  </FilterChip>
                );
              })}
            </FilterChipRow>
          </Field>

          <Field data-col-span="12">
            <FieldLabel as="div">类型关键词</FieldLabel>
            <FilterChipRow aria-label="类型筛选">
              {typeOptions.map(([type]) => {
                const active = filters.types.includes(type);
                const count = liveFacets.types.get(type) || 0;
                return (
                  <FilterChip
                    key={type}
                    type="button"
                    $active={active}
                    aria-pressed={active}
                    onClick={() => {
                      setFilters((prev) => {
                        const next = prev.types.includes(type)
                          ? prev.types.filter((t) => t !== type)
                          : [...prev.types, type];
                        return { ...prev, types: next };
                      });
                      trackEvent('search.filter.type.toggle', { type, active: !active });
                    }}
                  >
                    {type}
                    <ChipCount aria-hidden="true">{count}</ChipCount>
                  </FilterChip>
                );
              })}
            </FilterChipRow>
          </Field>

          <Field data-col-span="12">
            <FieldLabel as="div">标签</FieldLabel>
            <FilterChipRow aria-label="标签筛选">
              {tagOptions.map(([tag]) => {
                const active = filters.tags.includes(tag);
                const count = liveFacets.tags.get(tag) || 0;
                return (
                  <FilterChip
                    key={tag}
                    type="button"
                    $active={active}
                    aria-pressed={active}
                    onClick={() => {
                      setFilters((prev) => {
                        const next = prev.tags.includes(tag)
                          ? prev.tags.filter((t) => t !== tag)
                          : [...prev.tags, tag];
                        return { ...prev, tags: next };
                      });
                      trackEvent('search.filter.tag.toggle', { tag, active: !active });
                    }}
                  >
                    {tag}
                    <ChipCount aria-hidden="true">{count}</ChipCount>
                  </FilterChip>
                );
              })}
            </FilterChipRow>
          </Field>
        </FiltersGrid>

        <FiltersFooter>
          <span aria-hidden="true">
            {hasActiveFilters
              ? `已启用筛选 · 命中 ${results.length} 部作品`
              : '提示：输入关键词也能参与筛选'}
          </span>
          <span aria-hidden="true">搜索结果支持虚拟滚动（数据量大时自动开启）</span>
        </FiltersFooter>
      </FiltersCard>

      {q || hasActiveFilters ? (
        <Summary role="status" aria-live="polite">
          {q ? (
            <>
              关键词：<strong>{q}</strong> ·{' '}
            </>
          ) : (
            <>已启用筛选 · </>
          )}
          共找到 <strong>{results.length}</strong> 部作品
        </Summary>
      ) : null}

      {!q && !hasActiveFilters && trendingTags.length > 0 ? (
        <>
          <Label>热门标签</Label>
          <TagRow aria-label="热门标签">
            {trendingTags.map((tag) => (
              <TagChip
                key={tag}
                type="button"
                onClick={() => {
                  setValue(tag);
                  setHistory((prev) => {
                    const updated = [tag, ...prev.filter((item) => item !== tag)].slice(0, 8);
                    return updated;
                  });
                  setSearchParams({ q: tag });
                  trackEvent('search.tag', { tag });
                  inputRef.current?.focus?.();
                }}
              >
                {tag}
              </TagChip>
            ))}
          </TagRow>
        </>
      ) : null}

      {!q && !hasActiveFilters && history.length > 0 ? (
        <>
          <HistoryRow>
            <Label>最近搜索</Label>
            <HistoryClear
              type="button"
              onClick={() => {
                setHistory([]);
                trackEvent('search.history.clear');
              }}
            >
              清空
            </HistoryClear>
          </HistoryRow>
          <TagRow aria-label="搜索历史">
            {history.map((item) => (
              <TagChip
                key={item}
                type="button"
                onClick={() => {
                  setValue(item);
                  setSearchParams({ q: item });
                  inputRef.current?.focus?.();
                }}
              >
                {item}
              </TagChip>
            ))}
          </TagRow>
        </>
      ) : null}

      {(q || hasActiveFilters) && results.length > 0 ? (
        results.length > 24 ? (
          <VirtualizedGrid
            items={results}
            renderItem={(anime) => <AnimeCard anime={anime} virtualized />}
          />
        ) : (
          <AnimeGrid $bento>
            {results.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </AnimeGrid>
        )
      ) : (
        <EmptyState
          icon={<FiSearch size={22} />}
          title={q || hasActiveFilters ? '没有找到匹配结果' : '从这里开始搜索'}
          description={
            q || hasActiveFilters
              ? hasActiveFilters
                ? '可以尝试调整筛选条件（或点“清空筛选”回到全量搜索）。'
                : '换个关键词试试，或者去推荐/排行榜逛逛。'
              : '输入关键词，按下回车或点击搜索。'
          }
          primaryAction={
            hasActiveFilters
              ? {
                  to: `/search?reset=1${q ? `&q=${encodeURIComponent(q)}` : ''}`,
                  label: '清空筛选',
                }
              : { to: '/recommendations', label: '去看推荐' }
          }
          secondaryAction={
            hasActiveFilters
              ? { to: '/recommendations', label: '去看推荐' }
              : { to: '/rankings', label: '看看排行榜' }
          }
        />
      )}
    </PageShell>
  );
}

export default SearchPage;
