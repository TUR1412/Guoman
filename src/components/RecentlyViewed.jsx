import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiClock, FiTrash2 } from './icons/feather';
import { animeIndex } from '../data/animeData';
import { AnimeGrid } from './anime/AnimeGrid';
import AnimeCard from './anime/AnimeCard';
import { clearRecentlyViewed, getRecentlyViewed } from '../utils/recentlyViewed';
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
  margin-top: var(--spacing-xs-plus);
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
`;

function RecentlyViewed() {
  const toast = useToast();
  const [ids, setIds] = useState(() => getRecentlyViewed());

  const list = useMemo(() => ids.map((id) => animeIndex.get(id)).filter(Boolean), [ids]);

  const onClear = () => {
    clearRecentlyViewed();
    setIds([]);
    toast.info('已清空最近浏览', '随时可以从作品详情重新生成记录。');
    trackEvent('recent.clear');
  };

  return (
    <SectionContainer
      aria-live="polite"
      aria-relevant="additions removals"
      role="region"
      aria-label="最近浏览"
      aria-describedby="guoman-recent-desc"
    >
      <SectionInner data-stagger>
        <SectionHeader>
          <TitleGroup>
            <TitleWrap>
              <TitleIcon aria-hidden="true">
                <FiClock />
              </TitleIcon>
              <Title>最近浏览</Title>
              <Subtitle id="guoman-recent-desc">
                你刚刚看过的作品会留在这里，方便继续探索。
              </Subtitle>
            </TitleWrap>
            <MetaLine>共 {list.length} 部作品</MetaLine>
          </TitleGroup>
          <ClearButton type="button" onClick={onClear} aria-label="清空最近浏览">
            <FiTrash2 />
            清空记录
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
            icon={<FiClock size={22} />}
            title="还没有最近浏览"
            description="浏览作品详情后，这里会自动记录。"
            primaryAction={{ to: '/search', label: '去搜索' }}
            secondaryAction={{ to: '/recommendations', label: '去看推荐' }}
          />
        )}
      </SectionInner>
    </SectionContainer>
  );
}

export default RecentlyViewed;
