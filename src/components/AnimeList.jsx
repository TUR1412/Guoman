import React, { useEffect, useId, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { FiFilter, FiGrid } from './icons/feather';
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
  align-items: flex-start;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const HeaderContent = styled.div`
  display: grid;
  gap: var(--spacing-xs-plus);
`;

const ResultMeta = styled.p.attrs({ role: 'status', 'aria-live': 'polite' })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const ControlsStack = styled.div`
  min-width: 0;
  flex: 1 1 auto;
  display: grid;
  gap: var(--spacing-sm-plus);
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

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--surface-soft-hover);
    }
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

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const SortGroup = styled.div.attrs({ role: 'group', 'aria-label': '排序方式' })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  flex-wrap: wrap;
`;

const SortChip = styled.button.attrs({ type: 'button', 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 0.42rem 0.7rem;
  border-radius: var(--border-radius-pill);
  border: 1px solid ${(props) => (props.$active ? 'transparent' : 'var(--border-subtle)')};
  background: ${(props) =>
    props.$active
      ? 'linear-gradient(120deg, rgba(var(--primary-rgb), 0.88), rgba(var(--secondary-rgb), 0.78))'
      : 'var(--surface-soft)'};
  color: ${(props) => (props.$active ? 'var(--text-on-primary)' : 'var(--text-secondary)')};
  font-size: var(--text-xs);
  font-weight: 700;
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${(props) => (props.$active ? 'transparent' : 'var(--chip-border-hover)')};
      color: ${(props) => (props.$active ? 'var(--text-on-primary)' : 'var(--text-primary)')};
      background: ${(props) => (props.$active ? undefined : 'var(--surface-soft-hover)')};
    }
  }
`;

const DensityToggle = styled.button.attrs({ type: 'button', 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: 0.45rem 0.8rem;
  border-radius: var(--border-radius-pill);
  border: 1px solid
    ${(props) => (props.$active ? 'rgba(var(--secondary-rgb), 0.55)' : 'var(--border-subtle)')};
  background: ${(props) =>
    props.$active ? 'rgba(var(--secondary-rgb), 0.16)' : 'var(--surface-soft)'};
  color: ${(props) => (props.$active ? 'var(--secondary-color)' : 'var(--text-secondary)')};
  font-size: var(--text-xs);
  font-weight: 700;
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: ${(props) =>
        props.$active ? 'rgba(var(--secondary-rgb), 0.65)' : 'var(--chip-border-hover)'};
      background: ${(props) =>
        props.$active ? 'rgba(var(--secondary-rgb), 0.2)' : 'var(--surface-soft-hover)'};
    }
  }
`;

const ResetButton = styled.button.attrs({ type: 'button', 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: 0.45rem 0.8rem;
  border-radius: var(--border-radius-pill);
  border: 1px dashed var(--border-subtle);
  background: transparent;
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  font-weight: 700;
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--chip-border-hover);
      color: var(--text-primary);
      background: var(--surface-soft);
    }
  }
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

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: var(--primary-soft);
    }
  }
`;

const categoryOptions = [
  { id: 'all', name: '全部' },
  { id: 'featured', name: '精选' },
  { id: 'popular', name: '热门' },
  { id: 'new', name: '最新' },
  ...categories.map((cat) => ({ id: `cat-${cat.id}`, name: cat.name })),
];

const sortOptions = [
  { id: 'recommended', name: '综合' },
  { id: 'rating', name: '评分优先' },
  { id: 'popularity', name: '热度优先' },
  { id: 'latest', name: '新作优先' },
];

const DEFAULT_STORAGE_KEY = 'guoman.animeList.activeTab';

function AnimeList({
  title = '国漫作品',
  defaultTab = 'all',
  storageKey = DEFAULT_STORAGE_KEY,
  initialDisplayCount = 8,
  bento = false,
}) {
  const titleId = useId();
  const descId = useId();
  const reducedMotion = useAppReducedMotion();
  const [activeTab, setActiveTab] = usePersistedState(storageKey, defaultTab);
  const [sortMode, setSortMode] = usePersistedState(`${storageKey}:sort`, sortOptions[0].id);
  const [compactMode, setCompactMode] = usePersistedState(`${storageKey}:compact`, false, {
    serialize: (value) => (value ? 'true' : 'false'),
    deserialize: (raw) => raw === true || raw === 'true',
  });

  const [displayCount, setDisplayCount] = useState(initialDisplayCount);
  const indicatorLayoutId = useMemo(() => `guoman-tab-indicator:${storageKey}`, [storageKey]);

  useEffect(() => {
    setDisplayCount(initialDisplayCount);
  }, [activeTab, initialDisplayCount, sortMode]);

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

  const sortedAnime = useMemo(() => {
    const candidates = [...displayedAnime];

    switch (sortMode) {
      case 'rating':
        return candidates.sort((left, right) => (right.rating || 0) - (left.rating || 0));
      case 'popularity':
        return candidates.sort((left, right) => (right.popularity || 0) - (left.popularity || 0));
      case 'latest':
        return candidates.sort((left, right) => (right.releaseYear || 0) - (left.releaseYear || 0));
      default:
        return candidates;
    }
  }, [displayedAnime, sortMode]);

  const visibleAnime = useMemo(
    () => sortedAnime.slice(0, Math.max(Number(displayCount) || 0, 0)),
    [displayCount, sortedAnime],
  );

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + initialDisplayCount);
  };

  const handleSortChange = (nextSortId) => {
    if (!nextSortId || sortMode === nextSortId) return;
    setSortMode(nextSortId);
    trackEvent('recommendations.sort.change', { sort: nextSortId, storageKey });
    if (storageKey === STORAGE_KEYS.recommendationsTab) {
      recordInteraction(STORAGE_KEYS.recommendationsActions, { sort: nextSortId });
    }
  };

  const handleCompactToggle = () => {
    const nextValue = !compactMode;
    setCompactMode(nextValue);
    trackEvent('recommendations.layout.toggle', { compact: nextValue, storageKey });
    if (storageKey === STORAGE_KEYS.recommendationsTab) {
      recordInteraction(STORAGE_KEYS.recommendationsActions, { compact: nextValue });
    }
  };

  const handleResetView = () => {
    const defaultSortMode = sortOptions[0].id;
    setActiveTab(defaultTab);
    setSortMode(defaultSortMode);
    setCompactMode(false);
    setDisplayCount(initialDisplayCount);
    trackEvent('recommendations.view.reset', { storageKey, defaultTab });
    if (storageKey === STORAGE_KEYS.recommendationsTab) {
      recordInteraction(STORAGE_KEYS.recommendationsActions, {
        action: 'reset',
        tab: defaultTab,
      });
    }
  };

  useEffect(() => {
    trackEvent('recommendations.tab.change', { tab: activeTab, storageKey });
    if (storageKey === STORAGE_KEYS.recommendationsTab) {
      recordInteraction(STORAGE_KEYS.recommendationsActions, { tab: activeTab });
    }
  }, [activeTab, storageKey]);

  const activeSortName =
    sortOptions.find((option) => option.id === sortMode)?.name || sortOptions[0].name;
  const isViewCustomized =
    activeTab !== defaultTab || sortMode !== sortOptions[0].id || compactMode;

  return (
    <SectionContainer aria-labelledby={titleId} aria-describedby={descId} data-stagger>
      <SectionInner>
        <SectionHeader>
          <HeaderContent>
            <h2 className="section-title" id={titleId}>
              {title}
            </h2>
            <ResultMeta>
              <FiFilter size={14} aria-hidden="true" />
              当前 {sortedAnime.length} 部 · {activeSortName}
            </ResultMeta>
          </HeaderContent>
          <ControlsStack>
            <TabsContainer aria-label="作品筛选标签">
              {categoryOptions.map((category) => (
                <Tab
                  key={category.id}
                  type="button"
                  $active={activeTab === category.id}
                  aria-selected={activeTab === category.id}
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
            <Toolbar>
              <SortGroup>
                {sortOptions.map((option) => (
                  <SortChip
                    key={option.id}
                    aria-pressed={sortMode === option.id}
                    $active={sortMode === option.id}
                    onClick={() => handleSortChange(option.id)}
                  >
                    {option.name}
                  </SortChip>
                ))}
                {isViewCustomized ? (
                  <ResetButton aria-label="重置筛选与布局" onClick={handleResetView}>
                    重置视图
                  </ResetButton>
                ) : null}
              </SortGroup>
              {!bento ? (
                <DensityToggle
                  $active={compactMode}
                  aria-pressed={compactMode}
                  aria-label={compactMode ? '切换为舒展卡片布局' : '切换为紧凑卡片布局'}
                  onClick={handleCompactToggle}
                >
                  <FiGrid size={14} aria-hidden="true" />
                  {compactMode ? '舒展布局' : '紧凑布局'}
                </DensityToggle>
              ) : null}
            </Toolbar>
          </ControlsStack>
        </SectionHeader>
        <span id={descId} className="sr-only">
          可通过上方标签切换作品分类，切换后列表将自动更新。
        </span>

        <AnimeGrid $bento={bento} $compact={compactMode}>
          <AnimatePresence initial={false}>
            {visibleAnime.map((anime) => (
              <motion.div
                key={anime.id}
                role="listitem"
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
                <AnimeCard anime={anime} compact={compactMode} />
              </motion.div>
            ))}
          </AnimatePresence>
        </AnimeGrid>

        {displayCount < sortedAnime.length && (
          <ShowMoreButton type="button" onClick={handleShowMore}>
            查看更多
          </ShowMoreButton>
        )}
      </SectionInner>
    </SectionContainer>
  );
}

export default AnimeList;
