import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiTag } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import animeData from '../data/animeData';

const Summary = styled.div`
  color: var(--text-tertiary);
`;

function TagPage() {
  const { tag: rawTag } = useParams();
  const tag = decodeURIComponent(rawTag || '');

  const results = useMemo(() => {
    if (!tag) return [];
    return animeData.filter((anime) => (anime.tags || []).includes(tag));
  }, [tag]);

  return (
    <PageShell title={`标签：${tag || '未知'}`} subtitle="按标签浏览相关作品。">
      <Summary>
        共找到 <strong>{results.length}</strong> 部作品
      </Summary>

      {results.length > 0 ? (
        <AnimeGrid>
          {results.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </AnimeGrid>
      ) : (
        <EmptyState
          icon={<FiTag size={22} />}
          title="这个标签下暂无作品"
          description="试试别的标签，或者回到首页随便逛逛。"
          primaryAction={{ href: '#/', label: '回到首页' }}
          secondaryAction={{ href: '#/recommendations', label: '去看推荐' }}
        />
      )}
    </PageShell>
  );
}

export default TagPage;

