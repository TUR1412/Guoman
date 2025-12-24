import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiArrowRight,
  FiDownload,
  FiPlay,
  FiShare2,
  FiTrash2,
} from '../components/icons/feather';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/ToastProvider';
import { animeIndex } from '../data/animeData';
import {
  clearEngagementHistory,
  getDownloadHistory,
  getPlayHistory,
} from '../utils/engagementStore';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { getSharePosters } from '../utils/sharePoster';
import { trackEvent } from '../utils/analytics';
import { getContinueWatchingList, subscribeWatchProgress } from '../utils/watchProgress';
import { useFollowingEntries } from '../utils/useIsFollowing';
import { useFavoriteIds } from '../utils/useIsFavorite';
import { formatZhMonthDayTime } from '../utils/datetime';
import { useStorageSignal } from '../utils/useStorageSignal';

const Grid = styled.div.attrs({ 'data-divider': 'grid' })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
`;

const Card = styled.div.attrs({ 'data-card': true, 'data-divider': 'card' })`
  grid-column: span 3;
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

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      240px 160px at 10% 0%,
      rgba(var(--primary-rgb), 0.14),
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

const StatLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 800;
  color: var(--text-secondary);
  position: relative;
  z-index: 1;
`;

const StatValue = styled.div`
  font-size: var(--text-8xl);
  font-weight: 900;
  color: var(--primary-color);
  position: relative;
  z-index: 1;
`;

const StatMeta = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  position: relative;
  z-index: 1;
`;

const WideCard = styled(Card)`
  grid-column: 1 / -1;
`;

const Actions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
  position: relative;
  z-index: 1;
`;

const Button = styled.button.attrs({ type: 'button', 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    background: var(--surface-soft-hover);
    border-color: var(--chip-border-hover);
  }
`;

const LinkButton = styled(Link).attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    background: var(--surface-soft-hover);
    border-color: var(--chip-border-hover);
  }
`;

const Timeline = styled.div.attrs({ role: 'list', 'data-divider': 'list' })`
  display: grid;
  gap: var(--spacing-md);
  position: relative;
  z-index: 1;
`;

const TimelineItem = styled.div.attrs({ role: 'listitem', 'data-card': true })`
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--surface-paper);
  box-shadow: var(--shadow-sm);

  @media (max-width: 576px) {
    grid-template-columns: 48px 1fr;
    grid-template-rows: auto auto;
  }
`;

const Thumb = styled.div`
  width: 56px;
  height: 56px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const ItemMain = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

const ItemTitle = styled.div`
  font-weight: 800;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 82%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 82%, transparent 100%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
`;

const ItemMeta = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  overflow: hidden;
  text-overflow: clip;
  white-space: nowrap;
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 80%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 80%, transparent 100%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
`;

const ItemTime = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-xs);

  @media (max-width: 576px) {
    grid-column: 1 / -1;
  }
`;

function InsightsPage() {
  const toast = useToast();
  const favoriteIds = useFavoriteIds();
  const followingEntries = useFollowingEntries();
  const { signal, bump } = useStorageSignal([
    STORAGE_KEYS.playHistory,
    STORAGE_KEYS.downloadHistory,
    STORAGE_KEYS.sharePoster,
    STORAGE_KEYS.feedback,
    STORAGE_KEYS.notifications,
  ]);

  useEffect(() => {
    return subscribeWatchProgress(bump);
  }, [bump]);

  const playHistory = useMemo(() => {
    void signal;
    return getPlayHistory();
  }, [signal]);
  const downloadHistory = useMemo(() => {
    void signal;
    return getDownloadHistory();
  }, [signal]);
  const posters = useMemo(() => {
    void signal;
    return getSharePosters();
  }, [signal]);
  const continueWatching = useMemo(() => {
    void signal;
    return getContinueWatchingList({ limit: 999 });
  }, [signal]);

  const timeline = useMemo(() => {
    const merged = [];

    playHistory.forEach((entry) => {
      merged.push({
        type: 'play',
        createdAt: entry.createdAt || 0,
        animeId: entry.animeId,
        title: entry.title || '',
        meta: entry.platform ? `播放入口：${entry.platform}` : '播放入口',
      });
    });

    downloadHistory.forEach((entry) => {
      merged.push({
        type: 'download',
        createdAt: entry.createdAt || 0,
        animeId: entry.animeId,
        title: entry.title || '',
        meta: '下载意向（占位）',
      });
    });

    posters.forEach((entry) => {
      merged.push({
        type: 'poster',
        createdAt: entry.createdAt || 0,
        animeId: null,
        title: entry.title || '分享海报',
        meta: entry.subtitle || '海报工坊生成',
      });
    });

    return merged
      .filter((item) => item.createdAt)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20);
  }, [downloadHistory, playHistory, posters]);

  const onClearEngagement = () => {
    const ok = window.confirm('确定要清空播放/下载足迹吗？此操作不可撤销。');
    if (!ok) return;
    clearEngagementHistory();
    bump();
    toast.info('已清空足迹', '播放/下载历史已清理。');
    trackEvent('insights.engagement.clear');
  };

  return (
    <PageShell
      title="足迹中心"
      subtitle="把“留存”做成体验：记录你的播放/下载/分享行为，并提供可视化总览与一键清理。"
      badge="商业化模块"
      meta={<span>增长分析 · 留存链路 · 本地足迹</span>}
      actions={
        <Actions>
          <LinkButton to="/posters" title="打开海报工坊">
            <FiShare2 />
            海报工坊 <FiArrowRight />
          </LinkButton>
          <LinkButton to="/achievements" title="打开成就中心">
            <FiActivity />
            成就中心 <FiArrowRight />
          </LinkButton>
          <Button onClick={onClearEngagement} title="清空播放/下载足迹">
            <FiTrash2 />
            清空足迹
          </Button>
        </Actions>
      }
    >
      <Grid>
        <Card aria-label="收藏数量">
          <StatLabel>
            <FiActivity /> 收藏
          </StatLabel>
          <StatValue>{favoriteIds.size}</StatValue>
          <StatMeta>影响推荐引擎与口味画像。</StatMeta>
        </Card>

        <Card aria-label="追更数量">
          <StatLabel>
            <FiActivity /> 追更
          </StatLabel>
          <StatValue>{followingEntries.length}</StatValue>
          <StatMeta>可在追更中心设置提醒。</StatMeta>
        </Card>

        <Card aria-label="继续观看数量">
          <StatLabel>
            <FiPlay /> 继续观看
          </StatLabel>
          <StatValue>{continueWatching.length}</StatValue>
          <StatMeta>你的观看进度会保存在本地。</StatMeta>
        </Card>

        <Card aria-label="海报记录数量">
          <StatLabel>
            <FiShare2 /> 海报
          </StatLabel>
          <StatValue>{posters.length}</StatValue>
          <StatMeta>可在海报工坊重新下载。</StatMeta>
        </Card>

        <WideCard aria-label="最近足迹时间线">
          <StatLabel>
            <FiActivity /> 最近足迹
          </StatLabel>
          {timeline.length > 0 ? (
            <Timeline>
              {timeline.map((item) => {
                const anime = item.animeId ? animeIndex.get(item.animeId) : null;
                const icon =
                  item.type === 'play' ? (
                    <FiPlay />
                  ) : item.type === 'download' ? (
                    <FiDownload />
                  ) : (
                    <FiShare2 />
                  );

                return (
                  <TimelineItem key={`${item.type}-${item.createdAt}-${item.animeId || 'x'}`}>
                    <Thumb aria-hidden="true">
                      {anime?.cover ? (
                        <img src={anime.cover} alt="" loading="lazy" decoding="async" />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'grid',
                            placeItems: 'center',
                            color: 'var(--text-tertiary)',
                          }}
                        >
                          {icon}
                        </div>
                      )}
                    </Thumb>
                    <ItemMain>
                      {anime ? (
                        <Link
                          to={`/anime/${anime.id}`}
                          style={{ color: 'inherit', minWidth: 0 }}
                          onClick={() => trackEvent('insights.timeline.open', { id: anime.id })}
                        >
                          <ItemTitle title={item.title || anime.title}>
                            {item.title || anime.title}
                          </ItemTitle>
                        </Link>
                      ) : (
                        <ItemTitle title={item.title}>{item.title}</ItemTitle>
                      )}
                      <ItemMeta title={item.meta}>{item.meta}</ItemMeta>
                    </ItemMain>
                    <ItemTime>{formatZhMonthDayTime(item.createdAt, '未知时间')}</ItemTime>
                  </TimelineItem>
                );
              })}
            </Timeline>
          ) : (
            <EmptyState
              title="还没有足迹"
              description="先去看一部作品，或者生成一张海报，这里就会开始记录。"
              primaryAction={{ to: '/recommendations', label: '去看推荐' }}
              secondaryAction={{ to: '/rankings', label: '看看排行榜' }}
            />
          )}
        </WideCard>
      </Grid>
    </PageShell>
  );
}

export default InsightsPage;
