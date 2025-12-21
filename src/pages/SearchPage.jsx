import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import VirtualizedGrid from '../components/VirtualizedGrid';
import animeData, { animeIndex, tagCounts } from '../data/animeData';
import { usePersistedState } from '../utils/usePersistedState';
import { getCachedSearch, setCachedSearch } from '../utils/searchCache';
import { trackEvent } from '../utils/analytics';
import { STORAGE_KEYS } from '../utils/dataKeys';

const SearchBar = styled.form.attrs({ 'data-card': true, 'data-divider': 'card' })`
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
`;

const Input = styled.input`
  flex: 1;
  padding: 0.85rem var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--field-bg);
  color: var(--text-primary);

  &:focus {
    border-color: var(--primary-color);
    background: var(--field-bg-focus);
  }

  &::placeholder {
    color: var(--text-tertiary);
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
    transform: translateY(-1px);
    box-shadow: var(--shadow-glow);
    background: var(--primary-soft-hover);
  }

  &:active {
    transform: translateY(0px) scale(0.98);
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

  &:active {
    transform: scale(0.98);
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

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [value, setValue] = useState(q);
  const inputRef = useRef(null);
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
  const searchInputId = useId();

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

  const normalizedQuery = useMemo(() => normalize(q), [q]);
  const cachedIds = useMemo(() => getCachedSearch(normalizedQuery), [normalizedQuery]);

  const results = useMemo(() => {
    if (!normalizedQuery) return [];

    if (cachedIds && cachedIds.length > 0) {
      return cachedIds.map((id) => animeIndex.get(id)).filter(Boolean);
    }

    const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
    return animeData.filter((anime) => {
      const haystack = normalize(
        [anime.title, anime.originalTitle, anime.studio, anime.type, ...(anime.tags || [])].join(
          ' ',
        ),
      );

      return tokens.every((t) => haystack.includes(t));
    });
  }, [cachedIds, normalizedQuery]);

  useEffect(() => {
    if (!normalizedQuery) return;
    if (cachedIds && cachedIds.length > 0) return;
    setCachedSearch(
      normalizedQuery,
      results.map((anime) => anime.id),
    );
  }, [cachedIds, normalizedQuery, results]);

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
      meta={<span>多关键词 · ESC 清空 · 标签快选 · 历史记录</span>}
    >
      <SearchBar onSubmit={onSubmit} role="search" aria-label="站内搜索">
        <span id="guoman-search-page-hint" className="sr-only">
          支持多关键词搜索，空格分隔；例如：古风 仙侠
        </span>
        <label className="sr-only" htmlFor={searchInputId}>
          搜索关键词
        </label>
        <Input
          id={searchInputId}
          type="search"
          name="q"
          aria-label="搜索关键词"
          aria-describedby="guoman-search-page-hint"
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="例如：古风 仙侠 / 斗罗 / 绘梦动画"
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

      {q ? (
        <Summary role="status" aria-live="polite">
          关键词：<strong>{q}</strong> · 共找到 <strong>{results.length}</strong> 部作品
        </Summary>
      ) : null}

      {!q && trendingTags.length > 0 ? (
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

      {!q && history.length > 0 ? (
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

      {q && results.length > 0 ? (
        results.length > 24 ? (
          <VirtualizedGrid
            $bento
            items={results}
            pageSize={24}
            renderItem={(anime) => <AnimeCard key={anime.id} anime={anime} />}
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
          title={q ? '没有找到匹配结果' : '从这里开始搜索'}
          description={
            q ? '换个关键词试试，或者去推荐/排行榜逛逛。' : '输入关键词，按下回车或点击搜索。'
          }
          primaryAction={{ to: '/recommendations', label: '去看推荐' }}
          secondaryAction={{ to: '/rankings', label: '看看排行榜' }}
        />
      )}
    </PageShell>
  );
}

export default SearchPage;
