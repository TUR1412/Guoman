import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiClock, FiTrash2 } from 'react-icons/fi';
import animeData from '../data/animeData';
import { AnimeGrid } from './anime/AnimeGrid';
import AnimeCard from './anime/AnimeCard';
import { clearRecentlyViewed, getRecentlyViewed } from '../utils/recentlyViewed';
import { useToast } from './ToastProvider';

const SectionContainer = styled.section`
  padding: var(--spacing-3xl) 0;
`;

const SectionInner = styled.div`
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

const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TitleIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--surface-soft);
  border: 1px solid var(--border-subtle);
  display: grid;
  place-items: center;
  color: var(--primary-color);
`;

const Title = styled.h2`
  font-size: 1.9rem;
  font-weight: 800;
`;

const Subtitle = styled.p`
  color: var(--text-tertiary);
  margin-top: 0.25rem;
`;

const ClearButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.9rem;
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

function RecentlyViewed() {
  const toast = useToast();
  const [ids, setIds] = useState(() => getRecentlyViewed());

  const list = useMemo(
    () => ids.map((id) => animeData.find((anime) => anime.id === id)).filter(Boolean),
    [ids],
  );

  const onClear = () => {
    clearRecentlyViewed();
    setIds([]);
    toast.info('已清空最近浏览', '随时可以从作品详情重新生成记录。');
  };

  if (list.length === 0) {
    return null;
  }

  return (
    <SectionContainer
      aria-live="polite"
      aria-relevant="additions removals"
      role="region"
      aria-label="最近浏览"
      aria-describedby="guoman-recent-desc"
    >
      <SectionInner>
        <SectionHeader>
          <div>
            <TitleWrap>
              <TitleIcon aria-hidden="true">
                <FiClock />
              </TitleIcon>
              <div>
                <Title>最近浏览</Title>
                <Subtitle id="guoman-recent-desc">
                  你刚刚看过的作品会留在这里，方便继续探索。
                </Subtitle>
              </div>
            </TitleWrap>
          </div>
          <ClearButton type="button" onClick={onClear} aria-label="清空最近浏览">
            <FiTrash2 />
            清空记录
          </ClearButton>
        </SectionHeader>

        <AnimeGrid>
          {list.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </AnimeGrid>
      </SectionInner>
    </SectionContainer>
  );
}

export default RecentlyViewed;
