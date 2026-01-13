import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiTag } from '../components/icons/feather';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import VirtualizedGrid from '../components/VirtualizedGrid';
import animeData from '../data/animeData';
import { usePersistedState } from '../utils/usePersistedState';
import { trackEvent } from '../utils/analytics';
import { STORAGE_KEYS } from '../utils/dataKeys';

const Summary = styled.div`
  color: var(--text-tertiary);
`;

const ToggleGroup = styled.div.attrs({ 'data-divider': 'inline' })`
  --divider-inline-gap: var(--spacing-xs);
  display: inline-flex;
  border: 1px solid var(--border-subtle);
  border-radius: var(--border-radius-pill);
  overflow: hidden;
  background: var(--surface-soft);
`;

const Toggle = styled.button.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md-tight);
  color: ${(p) => (p.$active ? 'var(--text-on-primary)' : 'var(--text-secondary)')};
  background: ${(p) => (p.$active ? 'var(--primary-color)' : 'transparent')};
  border: 1px solid ${(p) => (p.$active ? 'transparent' : 'var(--border-subtle)')};
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: ${(p) => (p.$active ? 'var(--primary-color)' : 'var(--surface-soft-hover)')};
    }
  }
`;

const SORTS = {
  rating: {
    id: 'rating',
    label: '评分',
    sortFn: (a, b) => b.rating - a.rating,
  },
  popularity: {
    id: 'popularity',
    label: '人气',
    sortFn: (a, b) => b.popularity - a.popularity,
  },
};

function TagPage() {
  const { tag: rawTag } = useParams();
  const tag = decodeURIComponent(rawTag || '');
  const [sortId, setSortId] = usePersistedState(STORAGE_KEYS.tagSort, SORTS.rating.id);

  const sort = SORTS[sortId] || SORTS.rating;

  const results = useMemo(() => {
    if (!tag) return [];
    const list = animeData.filter((anime) => (anime.tags || []).includes(tag));
    return list.sort(sort.sortFn);
  }, [tag, sort.sortFn]);

  return (
    <PageShell
      title={`标签：${tag || '未知'}`}
      subtitle="按标签浏览相关作品。"
      badge="标签"
      meta={<span>共找到 {results.length} 部作品</span>}
      actions={
        <ToggleGroup aria-label="排序方式">
          {Object.values(SORTS).map((item) => (
            <Toggle
              key={item.id}
              type="button"
              $active={sortId === item.id}
              aria-pressed={sortId === item.id}
              onClick={() => {
                setSortId(item.id);
                trackEvent('tag.sort.change', { tag, sort: item.id });
              }}
            >
              {item.label}
            </Toggle>
          ))}
        </ToggleGroup>
      }
    >
      <Summary>
        共找到 <strong>{results.length}</strong> 部作品
      </Summary>

      {results.length > 0 ? (
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
          icon={<FiTag size={22} />}
          title="这个标签下暂无作品"
          description="试试别的标签，或者回到首页随便逛逛。"
          primaryAction={{ to: '/', label: '回到首页' }}
          secondaryAction={{ to: '/recommendations', label: '去看推荐' }}
        />
      )}
    </PageShell>
  );
}

export default TagPage;
