import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import AnimeList from '../components/AnimeList';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import animeData, { animeIndex } from '../data/animeData';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { getPersonalizedRecommendations } from '../utils/personalization';
import { subscribeWatchProgress } from '../utils/watchProgress';
import { useFavoritesUpdatedAt } from '../utils/useIsFavorite';

const PersonalizeCard = styled(motion.section).attrs({ 'data-card': true, 'data-divider': 'card' })`
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
  display: grid;
  gap: var(--spacing-lg);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      280px 180px at 10% 0%,
      rgba(var(--secondary-rgb), 0.18),
      transparent 60%
    );
    opacity: 0.8;
    pointer-events: none;
  }
`;

const PersonalizeHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
  position: relative;
  z-index: 1;
`;

const PersonalizeTitle = styled.div`
  display: grid;
  gap: 6px;
`;

const H2 = styled.h2`
  font-size: var(--text-4xl);
  line-height: var(--leading-tight);
  font-family: var(--font-display);

  @media (max-width: 768px) {
    font-size: var(--text-3xl);
  }
`;

const Muted = styled.p`
  color: var(--text-secondary);
  max-width: 70ch;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: 8px 12px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--stamp-border);
  background: var(--stamp-bg);
  color: var(--stamp-text);
  font-size: var(--text-xs);
  font-weight: 800;
  white-space: nowrap;
  box-shadow: var(--shadow-stamp);
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: 6px 10px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-secondary);
  font-size: var(--text-xs);
`;

const Grid = styled(AnimeGrid)`
  position: relative;
  z-index: 1;
`;

function RecommendationsPage() {
  const reducedMotion = useReducedMotion();
  const favoritesUpdatedAt = useFavoritesUpdatedAt();
  const [signal, setSignal] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const unsubscribeWatch = subscribeWatchProgress(() => {
      setSignal((prev) => prev + 1);
    });

    const onStorage = (event) => {
      const key = event?.detail?.key || event?.key;
      if (key === STORAGE_KEYS.recentlyViewed || key === STORAGE_KEYS.searchHistory) {
        setSignal((prev) => prev + 1);
      }
    };

    window.addEventListener('guoman:storage', onStorage);
    window.addEventListener('storage', onStorage);

    return () => {
      unsubscribeWatch?.();
      window.removeEventListener('guoman:storage', onStorage);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const personalized = useMemo(() => {
    void favoritesUpdatedAt;
    void signal;
    return getPersonalizedRecommendations({
      animeList: animeData,
      animeById: animeIndex,
      limit: 8,
    });
  }, [favoritesUpdatedAt, signal]);

  const topTags = personalized.profile.topTags
    .map((t) => t.key)
    .filter(Boolean)
    .slice(0, 5);
  const ranked = personalized.ranked.map((item) => item.anime).filter(Boolean);

  const personalizeMotion = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <PageShell
      title="国漫推荐"
      subtitle="从「精选 / 热门 / 最新」到标签分类，一键找到你的下一部心动国漫。"
      badge="推荐精选"
      meta={<span>精选推荐 · 标签筛选 · 一键收藏</span>}
    >
      <PersonalizeCard {...personalizeMotion} aria-label="为你推荐">
        <PersonalizeHeader>
          <PersonalizeTitle>
            <H2>为你推荐</H2>
            <Muted>基于你的收藏 / 观看进度 / 搜索词，生成本地口味画像并排序推荐。</Muted>
          </PersonalizeTitle>
          <Badge>
            <FiStar /> Taste Engine
          </Badge>
        </PersonalizeHeader>

        {topTags.length > 0 ? (
          <ChipRow aria-label="你的偏好标签">
            {topTags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </ChipRow>
        ) : (
          <Muted>还没有足够的偏好数据：先收藏几部作品或观看一集，推荐会更“懂你”。</Muted>
        )}

        {ranked.length > 0 ? (
          <Grid $bento>
            {ranked.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </Grid>
        ) : null}
      </PersonalizeCard>

      <AnimeList
        title="为你精选"
        defaultTab="featured"
        storageKey={STORAGE_KEYS.recommendationsTab}
      />
    </PageShell>
  );
}

export default RecommendationsPage;
