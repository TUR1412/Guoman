// 推荐页：输出口味画像、匹配度解释与标签趋势洞察。
import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar, FiTrendingUp } from '../components/icons/feather';
import PageShell from '../components/PageShell';
import AnimeList from '../components/AnimeList';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import animeData, { animeIndex } from '../data/animeData';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { getPersonalizedRecommendations } from '../utils/personalization';
import { subscribeWatchProgress } from '../utils/watchProgress';
import { useFavoritesUpdatedAt } from '../utils/useIsFavorite';
import { useStorageSignal } from '../utils/useStorageSignal';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';
import { buildTagPulse } from '../utils/contentInsights';

const PersonalizeCard = styled(motion.section).attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
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

const TagPulseCard = styled.section.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  display: grid;
  gap: var(--spacing-lg);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      260px 180px at 12% 0%,
      rgba(var(--primary-rgb), 0.14),
      transparent 60%
    );
    opacity: 0.8;
    pointer-events: none;
  }
`;

const TagPulseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TagPulseTitle = styled.div`
  display: grid;
  gap: 6px;
`;

const TagPulseGrid = styled.div.attrs({ 'data-divider': 'grid' })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;
`;

const TagPulseItem = styled(Link).attrs({ 'data-pressable': true })`
  grid-column: span 4;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-paper);
  color: inherit;
  display: grid;
  gap: 8px;
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--chip-border-hover);
      background: var(--surface-soft-hover);
    }
  }

  @media (max-width: 992px) {
    grid-column: span 6;
  }

  @media (max-width: 576px) {
    grid-column: 1 / -1;
  }
`;

const TagPulseName = styled.div`
  font-weight: 800;
  font-size: var(--text-lg);
  color: var(--text-primary);
`;

const TagPulseMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  color: var(--text-tertiary);
  font-size: var(--text-xs);
`;

const TagPulseBar = styled.div`
  height: 6px;
  border-radius: var(--border-radius-pill);
  background: var(--progress-track);
  overflow: hidden;
`;

const TagPulseFill = styled.div`
  height: 100%;
  width: ${(props) => `${props.$value}%`};
  background: linear-gradient(
    90deg,
    rgba(var(--primary-rgb), 0.85),
    rgba(var(--secondary-rgb), 0.7)
  );
`;

function RecommendationsPage() {
  const reducedMotion = useAppReducedMotion();
  const favoritesUpdatedAt = useFavoritesUpdatedAt();
  const { signal, bump } = useStorageSignal([
    STORAGE_KEYS.recentlyViewed,
    STORAGE_KEYS.searchHistory,
  ]);

  useEffect(() => {
    return subscribeWatchProgress(bump);
  }, [bump]);

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
  const rankedWithInsight = useMemo(() => {
    const items = personalized.ranked.filter((item) => item?.anime);
    const scores = items.map((item) => Number(item.score)).filter(Number.isFinite);
    const minScore = scores.length ? Math.min(...scores) : 0;
    const maxScore = scores.length ? Math.max(...scores) : 1;
    const toMatchScore = (score) => {
      if (!Number.isFinite(score)) return null;
      if (maxScore <= minScore) return 86;
      return Math.round(70 + ((score - minScore) / (maxScore - minScore)) * 30);
    };

    return items.map((item) => ({
      anime: item.anime,
      insight: {
        score: toMatchScore(item.score),
        reasons: item.reasons?.tags || [],
      },
    }));
  }, [personalized.ranked]);

  const tagPulse = useMemo(() => buildTagPulse(animeData, { limit: 9 }), []);

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

        {rankedWithInsight.length > 0 ? (
          <Grid>
            {rankedWithInsight.map((item) => (
              <AnimeCard key={item.anime.id} anime={item.anime} insight={item.insight} />
            ))}
          </Grid>
        ) : null}
      </PersonalizeCard>

      <TagPulseCard aria-label="标签趋势热力">
        <TagPulseHeader>
          <TagPulseTitle>
            <H2>标签趋势热力</H2>
            <Muted>结合评分、人气与覆盖作品数，输出当前最具势能的标签维度。</Muted>
          </TagPulseTitle>
          <Badge>
            <FiTrendingUp /> Tag Pulse
          </Badge>
        </TagPulseHeader>

        <TagPulseGrid>
          {tagPulse.map((item) => (
            <TagPulseItem key={item.tag} to={`/tag/${encodeURIComponent(item.tag)}`}>
              <TagPulseName>{item.tag}</TagPulseName>
              <TagPulseMeta>
                <span>{item.count} 部作品</span>
                <span>均分 {item.avgRating}</span>
                <span>热度 {item.avgPopularity.toLocaleString()}</span>
              </TagPulseMeta>
              <TagPulseBar aria-hidden="true">
                <TagPulseFill $value={item.heat} />
              </TagPulseBar>
            </TagPulseItem>
          ))}
        </TagPulseGrid>
      </TagPulseCard>

      <AnimeList
        title="为你精选"
        defaultTab="featured"
        storageKey={STORAGE_KEYS.recommendationsTab}
      />
    </PageShell>
  );
}

export default RecommendationsPage;
