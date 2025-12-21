import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useFavorites } from '../FavoritesProvider';
import { useToast } from '../ToastProvider';
import { getWatchProgress, subscribeWatchProgress } from '../../utils/watchProgress';
import { prefetchRoute } from '../../utils/routePrefetch';
import { trackEvent } from '../../utils/analytics';

const Card = styled(motion.article).attrs({
  role: 'listitem',
  'data-card': true,
  'data-divider': 'card',
})`
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  transition: var(--transition);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(12px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg), var(--shadow-glow);
    border-color: var(--chip-border-hover);
  }

  &:focus-within {
    box-shadow: var(--shadow-lg), var(--shadow-ring);
    border-color: var(--primary-soft-border);
  }
`;

const Cover = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 140%;
  overflow: hidden;

  ${Card}:hover img {
    transform: scale(1.05);
  }
`;

const CoverLink = styled(Link)`
  position: absolute;
  inset: 0;
  display: block;
  z-index: 1;
`;

const CoverImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  z-index: 0;
`;

const FavButton = styled.button.attrs({ 'data-pressable': true })`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--control-border);
  background: var(--control-bg);
  color: var(--text-primary);
  backdrop-filter: blur(10px);
  transition: var(--transition);

  opacity: 0;
  transform: translateY(-2px);

  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  ${Card}:focus-within &,
  &:focus-visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    border-color: var(--chip-border-hover);
    color: var(--primary-color);
  }

  &:active {
    transform: translateY(0) scale(0.96);
  }
`;

const FavDot = styled.div`
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 2;
  width: 10px;
  height: 10px;
  border-radius: var(--border-radius-pill);
  background: var(--primary-color);
  box-shadow: var(--shadow-ring);
`;

const ProgressPanel = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: var(--spacing-sm-compact) var(--spacing-sm-plus);
  z-index: 2;
  background: linear-gradient(0deg, var(--overlay-strong) 0%, transparent 100%);
  color: var(--text-on-dark);
`;

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-xxs);
  font-weight: 600;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  border-radius: var(--border-radius-pill);
  background: var(--progress-track);
  margin-top: var(--spacing-xs-plus);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => `${props.$value}%`};
  background: var(--progress-fill);
  border-radius: inherit;
`;

const CardLink = styled(Link).attrs({ 'data-pressable': true })`
  display: block;
  padding: var(--spacing-md);
  color: inherit;
`;

const Title = styled.h3`
  font-size: var(--text-base-plus);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 576px) {
    font-size: var(--text-base);
  }
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
`;

const Type = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
`;

const Rating = styled.span`
  display: inline-flex;
  align-items: center;
  color: var(--secondary-color);
  font-weight: 700;

  &::before {
    content: '★';
    margin-right: var(--spacing-xs);
  }
`;

function AnimeCard({ anime }) {
  const favorites = useFavorites();
  const toast = useToast();
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(() => getWatchProgress(anime?.id));

  const animeId = anime?.id;
  const favorited = animeId ? favorites.isFavorite(animeId) : false;
  const typeShort = anime?.type?.split('、')?.[0] ?? '';
  const descId = `anime-card-desc-${anime?.id ?? 'unknown'}`;

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!animeId) return;
    favorites.toggleFavorite(animeId);
    if (favorited) {
      toast.info('已取消收藏', `《${anime.title}》已从收藏移除。`);
    } else {
      toast.success('已加入收藏', `《${anime.title}》已加入收藏。`);
    }
    trackEvent('favorites.toggle', { id: animeId, active: !favorited });
  };

  useEffect(() => {
    setProgress(getWatchProgress(anime?.id));
    const unsubscribe = subscribeWatchProgress(() => {
      setProgress(getWatchProgress(anime?.id));
    });
    return unsubscribe;
  }, [anime?.id]);

  const progressValue = progress?.progress ?? 0;

  if (!anime) return null;

  return (
    <Card
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.35 }}
      whileHover={reducedMotion ? undefined : { scale: 1.02 }}
    >
      <Cover>
        <CoverLink
          to={`/anime/${anime.id}`}
          aria-label={`查看《${anime.title}》详情`}
          aria-describedby={descId}
          onMouseEnter={() => prefetchRoute(`/anime/${anime.id}`)}
          onFocus={() => prefetchRoute(`/anime/${anime.id}`)}
        />
        <CoverImg
          src={anime.cover}
          alt={anime.title}
          loading="lazy"
          decoding="async"
          width="320"
          height="448"
        />
        <FavButton
          type="button"
          aria-label={favorited ? '取消收藏' : '加入收藏'}
          aria-pressed={favorited}
          onClick={toggleFavorite}
          style={
            favorited
              ? {
                  borderColor: 'var(--primary-soft-border)',
                  color: 'var(--primary-color)',
                  background: 'var(--primary-soft)',
                }
              : undefined
          }
          title={favorited ? '已收藏' : '收藏'}
        >
          <FiHeart />
        </FavButton>
        {favorited ? <FavDot aria-hidden="true" /> : null}
        {progress && (progress.progress > 0 || progress.episode > 1) ? (
          <ProgressPanel aria-label={`观看进度 ${progressValue}%`}>
            <ProgressMeta>
              <span>继续观看</span>
              <span>
                第 {progress.episode} 集 · {progressValue}%
              </span>
            </ProgressMeta>
            <ProgressTrack>
              <ProgressFill $value={progressValue} />
            </ProgressTrack>
          </ProgressPanel>
        ) : null}
      </Cover>
      <CardLink
        to={`/anime/${anime.id}`}
        aria-label={`查看《${anime.title}》详情`}
        aria-describedby={descId}
        onMouseEnter={() => prefetchRoute(`/anime/${anime.id}`)}
        onFocus={() => prefetchRoute(`/anime/${anime.id}`)}
      >
        <span id={descId} className="sr-only">
          {typeShort ? `类型：${typeShort}。` : ''}
          评分：{anime.rating}。
        </span>
        <Title>{anime.title}</Title>
        <Meta>
          <Type>{typeShort}</Type>
          <Rating>{anime.rating}</Rating>
        </Meta>
      </CardLink>
    </Card>
  );
}

export default AnimeCard;
