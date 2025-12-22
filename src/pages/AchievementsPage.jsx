import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import { FiAward, FiBell, FiHeart, FiMessageSquare, FiPlay, FiShare2 } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import { useToast } from '../components/ToastProvider';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { getDownloadHistory, getPlayHistory } from '../utils/engagementStore';
import { getFeedbackList } from '../utils/feedbackStore';
import { getSharePosters } from '../utils/sharePoster';
import { useFavoriteIds } from '../utils/useIsFavorite';
import { useFollowingEntries } from '../utils/useIsFollowing';
import { useProMembership } from '../utils/useProMembership';
import { safeJsonParse } from '../utils/json';
import { usePersistedState } from '../utils/usePersistedState';
import { getContinueWatchingList, subscribeWatchProgress } from '../utils/watchProgress';

const Grid = styled.div.attrs({ 'data-divider': 'grid' })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
`;

const Card = styled(motion.div).attrs({ 'data-card': true, 'data-divider': 'card' })`
  grid-column: span 4;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
  display: grid;
  gap: var(--spacing-md);
  position: relative;
  overflow: hidden;
  transition: var(--transition);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      280px 180px at 10% 0%,
      rgba(var(--accent-rgb), 0.14),
      transparent 62%
    );
    opacity: 0.8;
    pointer-events: none;
  }

  @media (max-width: 992px) {
    grid-column: span 6;
  }

  @media (max-width: 576px) {
    grid-column: 1 / -1;
  }
`;

const UnlockGlow = styled(motion.div)`
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(
    260px 140px at 20% 0%,
    rgba(var(--primary-rgb), 0.34),
    transparent 70%
  );
  mix-blend-mode: screen;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 900;
  font-size: var(--text-lg-plus);
  color: var(--text-primary);
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--primary-soft-border);
  background: rgba(var(--primary-rgb), 0.14);
  color: var(--primary-color);
  font-size: var(--text-xs);
  font-weight: 900;
  letter-spacing: 0.04em;
`;

const Desc = styled.div`
  color: var(--text-secondary);
  line-height: var(--leading-snug-plus);
  position: relative;
  z-index: 1;
`;

const ProgressRow = styled.div`
  display: grid;
  gap: 6px;
  position: relative;
  z-index: 1;
`;

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  color: var(--text-tertiary);
  font-size: var(--text-xs);
`;

const ProgressTrack = styled.div`
  height: 10px;
  border-radius: var(--border-radius-pill);
  background: var(--progress-track);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${(p) => `${p.$percent}%`};
  background: linear-gradient(
    90deg,
    rgba(var(--primary-rgb), 0.95),
    rgba(var(--secondary-rgb), 0.82)
  );
  border-radius: inherit;
  transition: width var(--motion-base) var(--ease-out);
`;

const totalToPercent = (current, target) => {
  const c = Number(current) || 0;
  const t = Number(target) || 0;
  if (t <= 0) return 0;
  return Math.min(100, Math.max(0, (c / t) * 100));
};

function AchievementsPage() {
  const toast = useToast();
  const reducedMotion = useReducedMotion();
  const favoriteIds = useFavoriteIds();
  const followingEntries = useFollowingEntries();
  const pro = useProMembership();
  const [signal, setSignal] = useState(0);
  const [hotUnlockedIds, setHotUnlockedIds] = useState([]);
  const [seenUnlockedIds, setSeenUnlockedIds] = usePersistedState(
    STORAGE_KEYS.achievementsUnlocked,
    [],
    {
      serialize: (value) => JSON.stringify(Array.isArray(value) ? value : []),
      deserialize: (raw) => safeJsonParse(raw, []),
    },
  );
  const didInitRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const onStorage = (event) => {
      const key = event?.detail?.key || event?.key;
      if (
        key === STORAGE_KEYS.playHistory ||
        key === STORAGE_KEYS.downloadHistory ||
        key === STORAGE_KEYS.sharePoster ||
        key === STORAGE_KEYS.feedback
      ) {
        setSignal((prev) => prev + 1);
      }
    };

    const unsubscribeWatch = subscribeWatchProgress(() => {
      setSignal((prev) => prev + 1);
    });

    window.addEventListener('guoman:storage', onStorage);
    window.addEventListener('storage', onStorage);
    return () => {
      unsubscribeWatch?.();
      window.removeEventListener('guoman:storage', onStorage);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const counts = useMemo(() => {
    void signal;
    const plays = getPlayHistory().length;
    const downloads = getDownloadHistory().length;
    const posters = getSharePosters().length;
    const feedback = getFeedbackList().length;
    const continueWatching = getContinueWatchingList({ limit: 999 }).length;

    return {
      favorites: favoriteIds.size,
      following: followingEntries.length,
      continueWatching,
      plays,
      downloads,
      posters,
      feedback,
      pro: pro.enabled ? 1 : 0,
    };
  }, [favoriteIds.size, followingEntries.length, pro.enabled, signal]);

  const items = useMemo(
    () => [
      {
        id: 'fav-1',
        icon: <FiHeart />,
        title: '初见心动',
        desc: '收藏 1 部作品，开启你的本地优先旅程。',
        current: counts.favorites,
        target: 1,
      },
      {
        id: 'fav-10',
        icon: <FiHeart />,
        title: '收藏达人',
        desc: '收藏 10 部作品，推荐引擎会更懂你。',
        current: counts.favorites,
        target: 10,
      },
      {
        id: 'follow-1',
        icon: <FiBell />,
        title: '追更开幕',
        desc: '追更 1 部作品，并在追更中心设置提醒。',
        current: counts.following,
        target: 1,
      },
      {
        id: 'follow-5',
        icon: <FiBell />,
        title: '追更专家',
        desc: '追更 5 部作品，把时间线排得明明白白。',
        current: counts.following,
        target: 5,
      },
      {
        id: 'watch-1',
        icon: <FiPlay />,
        title: '继续观看',
        desc: '留下 1 条观看进度，回到首页即可继续。',
        current: counts.continueWatching,
        target: 1,
      },
      {
        id: 'play-5',
        icon: <FiPlay />,
        title: '影厅常客',
        desc: '留下 5 次播放足迹（占位：后续可接入真实播放源）。',
        current: counts.plays,
        target: 5,
      },
      {
        id: 'poster-1',
        icon: <FiShare2 />,
        title: '分享一次',
        desc: '生成 1 张分享海报：让推荐变成传播。',
        current: counts.posters,
        target: 1,
      },
      {
        id: 'feedback-1',
        icon: <FiMessageSquare />,
        title: '共创者',
        desc: '提交 1 条反馈：用真实体验驱动迭代。',
        current: counts.feedback,
        target: 1,
      },
      {
        id: 'pro-1',
        icon: <FiAward />,
        title: 'PRO 初体验',
        desc: '开启一次 PRO（本地演示开关）。',
        current: counts.pro,
        target: 1,
      },
    ],
    [counts],
  );

  const unlockedIds = useMemo(
    () => items.filter((item) => item.current >= item.target).map((item) => item.id),
    [items],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const prev = Array.isArray(seenUnlockedIds) ? seenUnlockedIds : [];
    const prevSet = new Set(prev);
    const sameLength = prev.length === unlockedIds.length;
    const same = sameLength && unlockedIds.every((id) => prevSet.has(id));

    if (same) return undefined;

    if (!didInitRef.current) {
      didInitRef.current = true;
      setSeenUnlockedIds(unlockedIds);
      return undefined;
    }

    const newly = unlockedIds.filter((id) => !prevSet.has(id));
    setSeenUnlockedIds(unlockedIds);

    if (newly.length === 0) return undefined;

    const titleMap = new Map(items.map((i) => [i.id, i.title]));
    const titles = newly.map((id) => titleMap.get(id)).filter(Boolean);

    toast.success(
      '成就解锁',
      titles.length ? `已解锁：${titles.join('、')}` : `已解锁 ${newly.length} 项成就。`,
      { celebrate: true, durationMs: 3200 },
    );

    setHotUnlockedIds(newly);
    const t = window.setTimeout(() => setHotUnlockedIds([]), 4200);
    return () => window.clearTimeout(t);
  }, [didInitRef, items, seenUnlockedIds, setSeenUnlockedIds, toast, unlockedIds]);

  const unlocked = unlockedIds.length;

  return (
    <PageShell
      title="成就中心"
      subtitle="把“使用行为”做成可见的进度条：更强的留存、更强的反馈、更强的可玩性。"
      badge="增长模块"
      meta={
        <span>
          已解锁 <strong>{unlocked}</strong> / {items.length} · 收藏 {counts.favorites} · 追更{' '}
          {counts.following}
        </span>
      }
      actions={null}
    >
      <Grid>
        {items.map((item) => {
          const ok = item.current >= item.target;
          const percent = totalToPercent(item.current, item.target);
          const hot = ok && hotUnlockedIds.includes(item.id);

          return (
            <Card
              key={item.id}
              aria-label={`${item.title} 成就`}
              whileHover={reducedMotion ? undefined : { y: -2, scale: 1.01 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.22 }}
              style={
                ok
                  ? {
                      borderColor: 'var(--primary-soft-border)',
                      boxShadow: 'var(--shadow-glow)',
                    }
                  : undefined
              }
            >
              {hot && !reducedMotion ? (
                <UnlockGlow
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.95, 0] }}
                  transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden="true"
                />
              ) : null}
              <TitleRow>
                <Title>
                  {item.icon} {item.title}
                </Title>
                {ok ? <Badge>已解锁</Badge> : <Badge>进行中</Badge>}
              </TitleRow>

              <Desc>{item.desc}</Desc>

              <ProgressRow>
                <ProgressMeta>
                  <span>
                    {item.current} / {item.target}
                  </span>
                  <span>{Math.round(percent)}%</span>
                </ProgressMeta>
                <ProgressTrack
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                >
                  <ProgressFill $percent={percent} />
                </ProgressTrack>
              </ProgressRow>
            </Card>
          );
        })}
      </Grid>
    </PageShell>
  );
}

export default AchievementsPage;
