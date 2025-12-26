import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FiStar, FiTrendingUp } from '../components/icons/feather';
import PageShell from '../components/PageShell';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import animeData from '../data/animeData';
import { Link } from 'react-router-dom';
import { usePersistedState } from '../utils/usePersistedState';
import { trackEvent } from '../utils/analytics';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { recordInteraction } from '../utils/interactionStore';

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
  padding: var(--spacing-sm-mid) var(--spacing-md-tight);
  color: ${(p) => (p.$active ? 'var(--text-on-primary)' : 'var(--text-secondary)')};
  background: ${(p) => (p.$active ? 'var(--primary-color)' : 'transparent')};
  border: 1px solid ${(p) => (p.$active ? 'transparent' : 'var(--border-subtle)')};
  transition: var(--transition);

  &:hover {
    background: ${(p) => (p.$active ? 'var(--primary-color)' : 'var(--surface-soft-hover)')};
  }
`;

const HighlightGrid = styled.div.attrs({
  'data-divider': 'grid',
  role: 'list',
  'aria-label': '排行榜精选作品',
})`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);

  & > *:nth-child(1) {
    grid-column: span 7;
  }

  & > *:nth-child(2) {
    grid-column: span 5;
  }

  & > *:nth-child(3) {
    grid-column: span 12;
  }

  @media (max-width: 992px) {
    grid-template-columns: 1fr;

    & > * {
      grid-column: span 1;
    }
  }
`;

const HighlightCard = styled(Link).attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-pressable': true,
  'data-shimmer': true,
  'data-focus-guide': true,
  'data-elev': '4',
  role: 'listitem',
})`
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  display: grid;
  gap: var(--spacing-md);
  position: relative;
  overflow: hidden;
  color: inherit;
`;

const HighlightCover = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.$image});
  background-size: cover;
  background-position: center;
  opacity: 0.16;
  filter: saturate(1.2);
`;

const HighlightOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, var(--overlay-strong) 0%, transparent 65%);
`;

const HighlightContent = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--spacing-md);
`;

const HighlightTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs-plus) var(--spacing-sm-plus);
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--badge-border);
  background: var(--badge-bg);
  color: var(--text-secondary);
  font-weight: 600;
`;

const Metric = styled.div`
  font-size: var(--text-8xl);
  font-weight: 900;
  letter-spacing: -0.02em;
  font-family: var(--font-display);
`;

const Subtitle = styled.div`
  color: var(--text-secondary);
`;

const STORAGE_KEY = STORAGE_KEYS.rankingsSort;

const SORTS = {
  rating: {
    id: 'rating',
    label: '评分',
    icon: <FiStar />,
    subtitle: '按评分从高到低',
    sortFn: (a, b) => b.rating - a.rating,
  },
  popularity: {
    id: 'popularity',
    label: '人气',
    icon: <FiTrendingUp />,
    subtitle: '按人气从高到低',
    sortFn: (a, b) => b.popularity - a.popularity,
  },
};

function RankingsPage() {
  const [sortId, setSortId] = usePersistedState(STORAGE_KEY, SORTS.rating.id);

  const sort = SORTS[sortId] || SORTS.rating;

  const sorted = useMemo(() => {
    const list = [...animeData];
    list.sort(sort.sortFn);
    return list;
  }, [sort.sortFn]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(0, 12);

  const setSortAndPersist = (nextId) => {
    setSortId(nextId);
    trackEvent('rankings.sort.change', { sort: nextId });
    recordInteraction(STORAGE_KEYS.rankingsActions, { sort: nextId });
  };

  return (
    <PageShell
      title="排行榜"
      subtitle={`一眼看懂：${sort.subtitle}。`}
      badge="热榜"
      meta={<span>Top 3 精选 · 可切换评分/人气</span>}
      actions={
        <ToggleGroup aria-label="切换排行榜排序方式">
          {Object.values(SORTS).map((item) => (
            <Toggle
              key={item.id}
              type="button"
              $active={sortId === item.id}
              aria-pressed={sortId === item.id}
              onClick={() => setSortAndPersist(item.id)}
            >
              {item.icon}
              {item.label}
            </Toggle>
          ))}
        </ToggleGroup>
      }
    >
      <HighlightGrid>
        {top3.map((anime, idx) => (
          <HighlightCard key={anime.id} to={`/anime/${anime.id}`}>
            <HighlightCover $image={anime.cover} aria-hidden="true" />
            <HighlightOverlay aria-hidden="true" />
            <HighlightContent>
              <HighlightTop>
                <Badge>
                  #{idx + 1} {sort.label}榜
                </Badge>
                <Badge title={sort.label}>
                  {sort.icon}
                  {sortId === 'rating' ? `${anime.rating}/5` : anime.popularity.toLocaleString()}
                </Badge>
              </HighlightTop>
              <Metric>{anime.title}</Metric>
              <Subtitle>{anime.type}</Subtitle>
            </HighlightContent>
          </HighlightCard>
        ))}
      </HighlightGrid>

      <div>
        <h2 className="section-title" style={{ marginBottom: 'var(--spacing-xl)' }}>
          Top 12
        </h2>
        <AnimeGrid $bento>
          {rest.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </AnimeGrid>
      </div>
    </PageShell>
  );
}

export default RankingsPage;
