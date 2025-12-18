import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import animeData, { featuredAnime, popularAnime, newReleases, categories } from '../data/animeData';
import AnimeCard from './anime/AnimeCard';
import { AnimeGrid } from './anime/AnimeGrid';
import { safeLocalStorageGet, safeLocalStorageSet } from '../utils/storage';

const SectionContainer = styled.section`
  padding: var(--spacing-3xl) 0;
`;

const SectionInner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: var(--spacing-md);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: var(--surface-soft);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  font-size: 1rem;
  white-space: nowrap;
  transition: var(--transition);
  background-color: ${(props) => (props.$active ? 'var(--primary-color)' : 'var(--surface-soft)')};
  color: ${(props) => (props.$active ? 'white' : 'var(--text-secondary)')};

  &:hover {
    background-color: ${(props) =>
      props.$active ? 'var(--primary-color)' : 'var(--surface-soft-hover)'};
  }
`;

const ShowMoreButton = styled.button`
  display: block;
  margin: var(--spacing-xl) auto 0;
  padding: 0.75rem 2rem;
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background-color: rgba(255, 77, 77, 0.1);
    transform: translateY(-2px);
  }
`;

const categoryOptions = [
  { id: 'all', name: '全部' },
  { id: 'featured', name: '精选' },
  { id: 'popular', name: '热门' },
  { id: 'new', name: '最新' },
  ...categories.map((cat) => ({ id: `cat-${cat.id}`, name: cat.name })),
];

const DEFAULT_STORAGE_KEY = 'guoman.animeList.activeTab';

function AnimeList({
  title = '国漫作品',
  defaultTab = 'all',
  storageKey = DEFAULT_STORAGE_KEY,
  initialDisplayCount = 8,
}) {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return defaultTab;
    const saved = safeLocalStorageGet(storageKey);
    return saved || defaultTab;
  });

  const [displayCount, setDisplayCount] = useState(initialDisplayCount);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    safeLocalStorageSet(storageKey, activeTab);
  }, [activeTab, storageKey]);

  useEffect(() => {
    setDisplayCount(initialDisplayCount);
  }, [activeTab, initialDisplayCount]);

  const displayedAnime = useMemo(() => {
    let filteredAnime = [];

    switch (activeTab) {
      case 'featured':
        filteredAnime = featuredAnime
          .map((id) => animeData.find((anime) => anime.id === id))
          .filter(Boolean);
        break;
      case 'popular':
        filteredAnime = popularAnime
          .map((id) => animeData.find((anime) => anime.id === id))
          .filter(Boolean);
        break;
      case 'new':
        filteredAnime = newReleases
          .map((id) => animeData.find((anime) => anime.id === id))
          .filter(Boolean);
        break;
      case 'all':
        filteredAnime = animeData;
        break;
      default:
        if (activeTab.startsWith('cat-')) {
          const catId = Number.parseInt(activeTab.slice(4), 10);
          const categoryName = categories.find((cat) => cat.id === catId)?.name;

          filteredAnime = animeData.filter((anime) =>
            anime.tags.some((tag) => tag === categoryName),
          );
        } else {
          filteredAnime = animeData;
        }
    }

    return filteredAnime;
  }, [activeTab]);

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + initialDisplayCount);
  };

  return (
    <SectionContainer>
      <SectionInner>
        <SectionHeader>
          <h2 className="section-title">{title}</h2>
          <TabsContainer>
            {categoryOptions.map((category) => (
              <Tab
                key={category.id}
                type="button"
                $active={activeTab === category.id}
                aria-pressed={activeTab === category.id}
                onClick={() => setActiveTab(category.id)}
              >
                {category.name}
              </Tab>
            ))}
          </TabsContainer>
        </SectionHeader>

        <AnimeGrid>
          {displayedAnime.slice(0, displayCount).map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </AnimeGrid>

        {displayCount < displayedAnime.length && (
          <ShowMoreButton type="button" onClick={handleShowMore}>
            查看更多
          </ShowMoreButton>
        )}
      </SectionInner>
    </SectionContainer>
  );
}

export default AnimeList;
