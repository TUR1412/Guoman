import React, { useEffect, useId, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import animeData, {
  categories,
  featuredAnime,
  newReleases,
  popularAnime,
  selectAnimeByCategory,
  selectAnimeByIds,
} from '../data/animeData';
import AnimeCard from './anime/AnimeCard';
import { AnimeGrid } from './anime/AnimeGrid';
import { usePersistedState } from '../utils/usePersistedState';
import { trackEvent } from '../utils/analytics';
import { recordInteraction } from '../utils/interactionStore';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';

const SectionContainer = styled.section`
  padding: var(--spacing-3xl) 0;
`;

const SectionInner = styled.div.attrs({ 'data-divider': 'list' })`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--spacing-xl);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const TabsContainer = styled.div.attrs({ role: 'tablist', 'data-divider': 'inline' })`
  display: flex;
  gap: var(--spacing-md);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
  position: relative;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: var(--surface-soft);
    border-radius: var(--border-radius-sm);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: var(--border-radius-sm);
  }

  @media (max-width: 768px) {
    width: 100%;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: var(--divider-gradient);
    opacity: 0.4;
  }
`;

const Tab = styled.button.attrs({ 'data-pressable': true, role: 'tab' })`
  position: relative;
  overflow: hidden;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  font-size: var(--text-base);
  white-space: nowrap;
  transition: var(--transition);
  background-color: var(--surface-soft);
  color: ${(props) => (props.$active ? 'var(--text-on-primary)' : 'var(--text-secondary)')};
  border: 1px solid ${(props) => (props.$active ? 'transparent' : 'var(--border-subtle)')};

  &:hover {
    background-color: var(--surface-soft-hover);
  }
`;

const TabLabel = styled.span`
  position: relative;
  z-index: 1;
`;

const TabIndicator = styled(motion.span).attrs({ 'data-testid': 'anime-list-tab-indicator' })`
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(
    120deg,
    rgba(var(--primary-rgb), 0.92),
    rgba(var(--secondary-rgb), 0.78)
  );
  box-shadow: var(--shadow-primary-soft);
  z-index: 0;
`;

const ShowMoreButton = styled.button.attrs({
  'data-pressable': true,
  'data-shimmer': true,
  'data-focus-guide': true,
})`
  --pressable-hover-translate-y: -2px;

  display: block;
  margin: var(--spacing-xl) auto 0;
  padding: var(--spacing-sm-plus) var(--spacing-xl);
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-soft);
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
  bento = true,
}) {
  const titleId = useId();
  const descId = useId();
  const reducedMotion = useAppReducedMotion();
  const [activeTab, setActiveTab] = usePersistedState(storageKey, defaultTab);

  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const indicatorLayoutId = useMemo(() => `guoman-tab-indicator:${storageKey}`, [storageKey]);

  useEffect(() => {
    setDisplayCount(initialDisplayCount);
  }, [activeTab, initialDisplayCount]);

  const displayedAnime = useMemo(() => {
    switch (activeTab) {
      case 'featured':
        return selectAnimeByIds(featuredAnime);
      case 'popular':
        return selectAnimeByIds(popularAnime);
      case 'new':
        return selectAnimeByIds(newReleases);
      case 'all':
        return animeData;
      default:
        if (activeTab.startsWith('cat-')) {
          const catId = Number.parseInt(activeTab.slice(4), 10);
          const categoryName = categories.find((cat) => cat.id === catId)?.name;
          if (categoryName) {
            return selectAnimeByCategory(categoryName);
          }
        }
        return animeData;
    }
  }, [activeTab]);

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + initialDisplayCount);
  };

  useEffect(() => {
    trackEvent('recommendations.tab.change', { tab: activeTab, storageKey });
    if (storageKey === STORAGE_KEYS.recommendationsTab) {
      recordInteraction(STORAGE_KEYS.recommendationsActions, { tab: activeTab });
    }
  }, [activeTab, storageKey]);

  return (
    <SectionContainer aria-labelledby={titleId} aria-describedby={descId} data-stagger>
      <SectionInner>
        <SectionHeader>
          <h2 className="section-title" id={titleId}>
            {title}
          </h2>
          <TabsContainer aria-label="作品筛选标签">
            {categoryOptions.map((category) => (
              <Tab
                key={category.id}
                type="button"
                $active={activeTab === category.id}
                aria-selected={activeTab === category.id}
                aria-pressed={activeTab === category.id}
                tabIndex={activeTab === category.id ? 0 : -1}
                onClick={() => setActiveTab(category.id)}
              >
                {activeTab === category.id ? (
                  <TabIndicator
                    layoutId={indicatorLayoutId}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 520, damping: 40 }
                    }
                  />
                ) : null}
                <TabLabel>{category.name}</TabLabel>
              </Tab>
            ))}
          </TabsContainer>
        </SectionHeader>
        <span id={descId} className="sr-only">
          可通过上方标签切换作品分类，切换后列表将自动更新。
        </span>

        <AnimeGrid $bento={bento}>
          <AnimatePresence initial={false}>
            {displayedAnime.slice(0, displayCount).map((anime) => (
              <motion.div
                key={anime.id}
                layout
                initial={reducedMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
                animate={
                  reducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, y: 0, scale: 1 }
                }
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
                transition={
                  reducedMotion ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                }
              >
                <AnimeCard anime={anime} />
              </motion.div>
            ))}
          </AnimatePresence>
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
