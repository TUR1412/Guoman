// 动漫卡片：展示作品概要，并可承载推荐匹配度与理由提示。
import React, { memo, useCallback, useEffect, useId, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiBell, FiColumns, FiHeart } from '../icons/feather';
import { useToast } from '../ToastProvider';
import { getCompareList, toggleCompare as toggleCompareInStore } from '../../utils/compareStore';
import { STORAGE_KEYS } from '../../utils/dataKeys';
import { toggleFavorite as toggleFavoriteInStore } from '../../utils/favoritesStore';
import { toggleFollowing } from '../../utils/followingStore';
import { useIsFavorite } from '../../utils/useIsFavorite';
import { useIsFollowing } from '../../utils/useIsFollowing';
import { useStorageSignal } from '../../utils/useStorageSignal';
import { getWatchProgress, subscribeWatchProgressById } from '../../utils/watchProgress';
import { prefetchRoute } from '../../utils/routePrefetch';
import { trackEvent } from '../../utils/analytics';
import { useAppReducedMotion } from '../../motion/useAppReducedMotion';

const Card = styled(motion.article).attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const Cover = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 140%;
  overflow: hidden;

  @media (hover: hover) and (pointer: fine) {
    ${Card}:hover img {
      transform: scale(1.05);
    }
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
  transition: transform var(--motion-base) var(--ease-out);
  z-index: 0;
`;

const FavButton = styled(motion.button).attrs({ 'data-pressable': true })`
  --pressable-offset-y: -2px;
  --pressable-scale-active: 0.96;

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

  @media (hover: hover) and (pointer: fine) {
    ${Card}:hover & {
      opacity: 1;
      --pressable-offset-y: 0px;
    }
  }

  ${Card}:focus-within &,
  &:focus-visible {
    opacity: 1;
    --pressable-offset-y: 0px;
  }

  @media (max-width: 768px) {
    opacity: 1;
    --pressable-offset-y: 0px;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--chip-border-hover);
      color: var(--primary-color);
    }
  }

  @media (hover: none) and (pointer: coarse) {
    opacity: 1;
    --pressable-offset-y: 0px;
  }
`;

const FollowButton = styled(FavButton)`
  left: 10px;
  right: auto;
`;

const CompareButton = styled(FavButton)`
  left: 50%;
  right: auto;
  transform: translateX(-50%);
`;

const FavDot = styled(motion.div)`
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 2;
  width: 10px;
  height: 10px;
  border-radius: var(--border-radius-pill);
  background: var(--primary-color);
  box-shadow: var(--shadow-ring);
  transform: translate(16px, 16px);
`;

const FavIcon = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  text-overflow: clip;
  white-space: nowrap;
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 82%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 82%, transparent 100%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;

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

const InsightRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  flex-wrap: wrap;
`;

const InsightBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--primary-soft-border);
  background: rgba(var(--primary-rgb), 0.14);
  color: var(--text-primary);
  font-size: var(--text-xs);
  font-weight: 800;
`;

const InsightChips = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const InsightChip = styled.span`
  padding: 2px 8px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-secondary);
  font-size: var(--text-xxs);
`;

const Type = styled.span`
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
  max-width: 70%;
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 80%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 80%, transparent 100%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
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

function AnimeCard({ anime, virtualized = false, insight }) {
  const toast = useToast();
  const reducedMotion = useAppReducedMotion();
  const animeId = anime?.id;
  const instanceId = useId();
  const [progress, setProgress] = useState(() => getWatchProgress(animeId));

  const favorited = useIsFavorite(animeId);
  const following = useIsFollowing(animeId);
  const { signal: compareSignal, bump: bumpCompare } = useStorageSignal([STORAGE_KEYS.compareList]);
  const compared = useMemo(
    () => (compareSignal, animeId ? getCompareList().includes(animeId) : false),
    [animeId, compareSignal],
  );
  const typeShort = useMemo(() => anime?.type?.split('、')?.[0] ?? '', [anime?.type]);
  const insightScore = useMemo(() => {
    const raw = Number(insight?.score);
    return Number.isFinite(raw) ? Math.round(raw) : null;
  }, [insight?.score]);
  const insightTags = useMemo(() => {
    if (!Array.isArray(insight?.reasons)) return [];
    return insight.reasons
      .map((tag) => String(tag))
      .filter(Boolean)
      .slice(0, 3);
  }, [insight?.reasons]);
  const descId = useMemo(() => `anime-card-desc-${animeId ?? 'unknown'}`, [animeId]);
  const coverLayoutId = useMemo(
    () => (animeId ? `guoman:anime-cover:${animeId}:${instanceId}` : undefined),
    [animeId, instanceId],
  );

  const toggleFavorite = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!animeId) return;
      toggleFavoriteInStore(animeId);
      if (favorited) {
        toast.info('已取消收藏', `《${anime.title}》已从收藏移除。`);
      } else {
        toast.success('已加入收藏', `《${anime.title}》已加入收藏。`);
      }
      trackEvent('favorites.toggle', { id: animeId, active: !favorited });
    },
    [anime?.title, animeId, favorited, toast],
  );

  const toggleFollow = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const result = toggleFollowing({ animeId, title: anime?.title });
      if (!result.ok) return;

      if (result.action === 'followed') {
        toast.success('已加入追更', '可在「追更中心」设置提醒时间。');
      } else if (result.action === 'unfollowed') {
        toast.info('已取消追更', '你可以随时重新加入追更。');
      }

      trackEvent('following.toggle', { id: animeId, active: result.action === 'followed' });
    },
    [anime?.title, animeId, toast],
  );

  const toggleCompare = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!animeId) return;
      const before = getCompareList();
      const result = toggleCompareInStore(animeId);
      bumpCompare();
      if (!result?.changed) return;

      const replaced =
        result.action === 'add' &&
        before.length === 2 &&
        before.some((id) => !result.list.includes(id));

      if (result.action === 'add') {
        toast.success(
          '已加入对比',
          replaced ? '已自动替换最早的对比项。' : '再选一部作品即可并排对照。',
        );
      } else {
        toast.info('已移出对比', '你可以继续添加其他作品。');
      }

      trackEvent('compare.toggle', {
        id: animeId,
        active: result.action === 'add',
        replaced: Boolean(replaced),
        size: result.list.length,
      });
    },
    [animeId, bumpCompare, toast],
  );

  useEffect(() => {
    if (!animeId) return undefined;
    setProgress(getWatchProgress(animeId));

    const unsubscribe = subscribeWatchProgressById(animeId, () => {
      setProgress(getWatchProgress(animeId));
    });
    return unsubscribe;
  }, [animeId]);

  const progressValue = progress?.progress ?? 0;

  if (!anime) return null;

  const enableMountMotion = !virtualized && !reducedMotion;

  return (
    <Card
      initial={enableMountMotion ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={enableMountMotion ? { duration: 0.35 } : { duration: 0 }}
      whileHover={reducedMotion ? undefined : { scale: 1.02 }}
    >
      <Cover layoutId={coverLayoutId}>
        <CoverLink
          to={`/anime/${anime.id}`}
          state={coverLayoutId ? { coverLayoutId } : undefined}
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

        <FollowButton
          type="button"
          aria-label={following ? '取消追更' : '追更'}
          aria-pressed={following}
          onClick={toggleFollow}
          whileTap={reducedMotion ? undefined : { scale: 0.92 }}
          whileHover={reducedMotion ? undefined : { scale: 1.02 }}
          style={
            following
              ? {
                  borderColor: 'var(--primary-soft-border)',
                  color: 'var(--primary-color)',
                  background: 'rgba(var(--primary-rgb), 0.14)',
                }
              : undefined
          }
          title={following ? '已追更' : '追更'}
        >
          <FavIcon
            key={following ? 'followed' : 'not-following'}
            initial={reducedMotion ? false : { rotate: -12, scale: 0.9 }}
            animate={reducedMotion ? { rotate: 0, scale: 1 } : { rotate: 0, scale: 1 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 640, damping: 32, mass: 0.6 }
            }
            aria-hidden="true"
          >
            <FiBell />
          </FavIcon>
        </FollowButton>

        <CompareButton
          type="button"
          aria-label={compared ? '从对比中移除' : '加入对比'}
          aria-pressed={compared}
          onClick={toggleCompare}
          whileTap={reducedMotion ? undefined : { scale: 0.92 }}
          whileHover={reducedMotion ? undefined : { scale: 1.02 }}
          style={
            compared
              ? {
                  borderColor: 'rgba(var(--secondary-rgb), 0.55)',
                  color: 'var(--secondary-color)',
                  background: 'rgba(var(--secondary-rgb), 0.14)',
                }
              : undefined
          }
          title={compared ? '已加入对比' : '加入对比'}
        >
          <FavIcon
            key={compared ? 'compared' : 'not-compared'}
            initial={reducedMotion ? false : { scale: 0.9, rotate: -10 }}
            animate={reducedMotion ? { scale: 1, rotate: 0 } : { scale: 1, rotate: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 620, damping: 32, mass: 0.6 }
            }
            aria-hidden="true"
          >
            <FiColumns />
          </FavIcon>
        </CompareButton>

        <FavButton
          type="button"
          aria-label={favorited ? '取消收藏' : '加入收藏'}
          aria-pressed={favorited}
          onClick={toggleFavorite}
          whileTap={reducedMotion ? undefined : { scale: 0.92 }}
          whileHover={reducedMotion ? undefined : { scale: 1.02 }}
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
          <FavIcon
            key={favorited ? 'on' : 'off'}
            initial={reducedMotion ? false : { scale: 0.9, rotate: -10 }}
            animate={reducedMotion ? { scale: 1, rotate: 0 } : { scale: 1, rotate: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 620, damping: 32, mass: 0.6 }
            }
            aria-hidden="true"
          >
            <FiHeart />
          </FavIcon>
        </FavButton>
        {favorited ? (
          <FavDot
            aria-hidden="true"
            initial={reducedMotion ? false : { scale: 0 }}
            animate={reducedMotion ? { scale: 1 } : { scale: [0, 1.2, 1] }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.35 }}
          />
        ) : null}
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
        state={coverLayoutId ? { coverLayoutId } : undefined}
        aria-describedby={descId}
        onMouseEnter={() => prefetchRoute(`/anime/${anime.id}`)}
        onFocus={() => prefetchRoute(`/anime/${anime.id}`)}
      >
        <span id={descId} className="sr-only">
          {typeShort ? `类型：${typeShort}。` : ''}
          评分：{anime.rating}。
        </span>
        <Title title={anime.title}>{anime.title}</Title>
        <Meta>
          <Type title={anime.type}>{typeShort}</Type>
          <Rating>{anime.rating}</Rating>
        </Meta>
        {insightScore !== null || insightTags.length > 0 ? (
          <InsightRow>
            {insightScore !== null ? <InsightBadge>匹配度 {insightScore}%</InsightBadge> : null}
            <InsightChips>
              {insightTags.map((tag) => (
                <InsightChip key={`${anime.id}-${tag}`}>{tag}</InsightChip>
              ))}
            </InsightChips>
          </InsightRow>
        ) : null}
      </CardLink>
    </Card>
  );
}

export default memo(AnimeCard);
