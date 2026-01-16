import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiStar, FiTag } from '../components/icons/feather';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import VirtualizedGrid from '../components/VirtualizedGrid';
import SparkBar from '../components/charts/SparkBar';
import animeData from '../data/animeData';
import { useToast } from '../components/ToastProvider';
import { usePersistedState } from '../utils/usePersistedState';
import { trackEvent } from '../utils/analytics';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { useStorageSignal } from '../utils/useStorageSignal';
import { getPinnedTags, togglePinnedTag } from '../utils/pinnedTags';

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

const HeaderActions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const PinButton = styled.button.attrs({
  type: 'button',
  'data-pressable': true,
  'data-shimmer': true,
  'data-focus-guide': true,
})`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-pill);
  border: 1px solid ${(p) => (p.$active ? 'var(--chip-border-active)' : 'var(--border-subtle)')};
  background: ${(p) => (p.$active ? 'var(--chip-bg-active)' : 'var(--surface-soft)')};
  color: var(--text-primary);
  font-weight: 800;
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--chip-border-hover);
      background: var(--surface-soft-hover);
      box-shadow: var(--shadow-glow);
    }
  }
`;

const InsightCard = styled.section.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  display: grid;
  gap: var(--spacing-md);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      260px 180px at 12% 0%,
      rgba(var(--secondary-rgb), 0.16),
      transparent 62%
    );
    opacity: 0.8;
    pointer-events: none;
  }
`;

const InsightHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`;

const InsightTitle = styled.h2`
  font-size: var(--text-3xl);
  letter-spacing: 0.01em;
`;

const InsightMeta = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
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
  const toast = useToast();
  const { signal: pinnedSignal, bump: bumpPinned } = useStorageSignal([STORAGE_KEYS.pinnedTags]);
  const pinnedTags = useMemo(() => (pinnedSignal, getPinnedTags()), [pinnedSignal]);
  const pinned = Boolean(tag) && pinnedTags.includes(tag);

  const sort = SORTS[sortId] || SORTS.rating;

  const results = useMemo(() => {
    if (!tag) return [];
    const list = animeData.filter((anime) => (anime.tags || []).includes(tag));
    return list.sort(sort.sortFn);
  }, [tag, sort.sortFn]);

  const yearDistribution = useMemo(() => {
    const counts = new Map();
    results.forEach((anime) => {
      const year = Number(anime?.releaseYear);
      if (!Number.isFinite(year)) return;
      const key = String(year);
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    const entries = Array.from(counts.entries())
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([label, value]) => ({ label, value }));

    const minYear = entries.length > 0 ? Number(entries[0].label) : null;
    const maxYear = entries.length > 0 ? Number(entries[entries.length - 1].label) : null;
    return { entries, minYear, maxYear };
  }, [results]);

  return (
    <PageShell
      title={`标签：${tag || '未知'}`}
      subtitle="按标签浏览相关作品。"
      badge="标签"
      meta={<span>共找到 {results.length} 部作品</span>}
      actions={
        <HeaderActions>
          <PinButton
            type="button"
            $active={pinned}
            aria-pressed={pinned}
            disabled={!tag}
            onClick={() => {
              if (!tag) return;
              const next = togglePinnedTag(tag);
              bumpPinned();
              if (!next.changed) return;

              if (next.pinned) {
                toast.success('已钉住标签', tag);
              } else {
                toast.info('已取消钉住', tag);
              }

              trackEvent('tag.pinned.toggle', { tag, pinned: next.pinned });
            }}
            title={pinned ? '取消钉住：从首页常用标签移除' : '钉住：在首页常用标签显示'}
          >
            <FiStar /> {pinned ? '已钉住' : '钉住'}
          </PinButton>

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
        </HeaderActions>
      }
    >
      <Summary>
        共找到 <strong>{results.length}</strong> 部作品
      </Summary>

      {yearDistribution.entries.length > 1 ? (
        <InsightCard aria-label="年份分布">
          <InsightHeader>
            <InsightTitle>年份分布</InsightTitle>
            <InsightMeta>
              {yearDistribution.minYear != null && yearDistribution.maxYear != null
                ? `${yearDistribution.minYear}–${yearDistribution.maxYear}`
                : '—'}
              {` · ${yearDistribution.entries.length} 个年份`}
            </InsightMeta>
          </InsightHeader>
          <SparkBar
            items={yearDistribution.entries}
            ariaLabel={`标签「${tag || '未知'}」年份分布`}
            maxBars={18}
          />
        </InsightCard>
      ) : null}

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
