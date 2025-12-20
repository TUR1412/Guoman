import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiPlay, FiTrash2 } from 'react-icons/fi';
import animeData from '../data/animeData';
import { AnimeGrid } from './anime/AnimeGrid';
import AnimeCard from './anime/AnimeCard';
import { clearWatchProgress, getContinueWatchingList, subscribeWatchProgress } from '../utils/watchProgress';
import { useToast } from './ToastProvider';
import EmptyState from './EmptyState';
import { trackEvent } from '../utils/analytics';

const SectionContainer = styled.section`
  padding: var(--spacing-3xl) 0;
`;

const SectionInner = styled.div.attrs({ 'data-divider': 'list' })`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: grid;
  gap: var(--spacing-xl);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TitleGroup = styled.div`
  display: grid;
  gap: var(--spacing-xs-plus);
`;

const TitleWrap = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: var(--spacing-sm-plus);
  row-gap: var(--spacing-xs);
  align-items: center;
`;

const TitleIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-lg);
  background: var(--surface-soft);
  border: 1px solid var(--border-subtle);
  display: grid;
  place-items: center;
  color: var(--primary-color);
  grid-row: 1 / span 2;
`;

const Title = styled.h2`
  font-size: var(--text-7xl);
  font-weight: 800;
  grid-column: 2;
`;

const Subtitle = styled.p`
  color: var(--text-tertiary);
  margin-top: var(--spacing-xs);
  grid-column: 2;
`;

const MetaLine = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const ClearButton = styled.button.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm-compact) var(--spacing-md-tight);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-secondary);
  transition: var(--transition);

  &:hover {
    background: var(--surface-soft-hover);
    color: var(--text-primary);
  }

  &:active {
    transform: scale(0.98);
  }
`;

function ContinueWatching() {
  const toast = useToast();
  const [entries, setEntries] = useState(() => getContinueWatchingList({ limit: 8 }));

  useEffect(() => {
    const unsubscribe = subscribeWatchProgress(() => {
      setEntries(getContinueWatchingList({ limit: 8 }));
    });
    return unsubscribe;
  }, []);

  const list = useMemo(
    () =>
      entries
        .map((entry) => animeData.find((anime) => anime.id === entry.id))
        .filter(Boolean),
    [entries],
  );

  const latestUpdatedAt = useMemo(() => {
    if (entries.length === 0) return null;
    return Math.max(...entries.map((entry) => entry.updatedAt || 0));
  }, [entries]);

  const formatDateTime = (value) => {
    if (!value) return '暂无记录';
    return new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  };

  const onClear = () => {
    clearWatchProgress();
    setEntries([]);
    toast.info('已清空观看进度', '继续观看会在你下次观看后自动恢复。');
    trackEvent('watchProgress.clear');
  };

  return (
    <SectionContainer
      aria-live="polite"
      aria-relevant="additions removals"
      role="region"
      aria-label="继续观看"
      aria-describedby="guoman-continue-desc"
    >
      <SectionInner data-stagger>
        <SectionHeader>
          <TitleGroup>
            <TitleWrap>
              <TitleIcon aria-hidden="true">
                <FiPlay />
              </TitleIcon>
              <Title>继续观看</Title>
              <Subtitle id="guoman-continue-desc">你的播放进度已保存，可随时续播。</Subtitle>
            </TitleWrap>
            <MetaLine>最近更新：{formatDateTime(latestUpdatedAt)}</MetaLine>
          </TitleGroup>
          <ClearButton type="button" onClick={onClear} aria-label="清空观看进度">
            <FiTrash2 />
            清空进度
          </ClearButton>
        </SectionHeader>

        {list.length > 0 ? (
          <AnimeGrid $bento>
            {list.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </AnimeGrid>
        ) : (
          <EmptyState
            icon={<FiPlay size={22} />}
            title="还没有观看记录"
            description="去作品详情里调整集数/进度，就能在这里继续观看。"
            primaryAction={{ to: '/recommendations', label: '去看推荐' }}
            secondaryAction={{ to: '/rankings', label: '看看排行榜' }}
          />
        )}
      </SectionInner>
    </SectionContainer>
  );
}

export default ContinueWatching;



