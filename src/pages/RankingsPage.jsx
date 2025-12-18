import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiStar, FiTrendingUp } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import animeData from '../data/animeData';
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage';

const ToggleGroup = styled.div`
  display: inline-flex;
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
`;

const Toggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.9rem;
  color: ${(p) => (p.$active ? 'white' : 'var(--text-secondary)')};
  background: ${(p) => (p.$active ? 'var(--primary-color)' : 'transparent')};
  transition: var(--transition);

  &:hover {
    background: ${(p) => (p.$active ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.08)')};
  }
`;

const HighlightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const HighlightCard = styled.div`
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  backdrop-filter: blur(14px);
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
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.18);
  color: var(--text-secondary);
  font-weight: 600;
`;

const Metric = styled.div`
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.div`
  color: var(--text-secondary);
`;

const STORAGE_KEY = 'guoman.rankings.sort';

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
  const [sortId, setSortId] = useState(() => {
    if (typeof window === 'undefined') return SORTS.rating.id;
    return safeLocalStorageGet(STORAGE_KEY) || SORTS.rating.id;
  });

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
    if (typeof window !== 'undefined') {
      safeLocalStorageSet(STORAGE_KEY, nextId);
    }
  };

  return (
    <PageShell
      title="排行榜"
      subtitle={`一眼看懂：${sort.subtitle}。`}
      actions={
        <ToggleGroup aria-label="切换排行榜排序方式">
          {Object.values(SORTS).map((item) => (
            <Toggle
              key={item.id}
              type="button"
              $active={sortId === item.id}
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
          <HighlightCard key={anime.id}>
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
          </HighlightCard>
        ))}
      </HighlightGrid>

      <div>
        <h2 className="section-title">Top 12</h2>
        <AnimeGrid>
          {rest.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </AnimeGrid>
      </div>
    </PageShell>
  );
}

export default RankingsPage;
