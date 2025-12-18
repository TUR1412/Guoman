import React, { useMemo } from 'react';
import styled from 'styled-components';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import PageShell from '../components/PageShell';
import EmptyState from '../components/EmptyState';
import AnimeCard from '../components/anime/AnimeCard';
import { AnimeGrid } from '../components/anime/AnimeGrid';
import { useFavorites } from '../components/FavoritesProvider';
import { useToast } from '../components/ToastProvider';
import animeData from '../data/animeData';

const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.1rem;
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(255, 77, 77, 0.45);
  background: rgba(255, 77, 77, 0.16);
  color: var(--text-primary);
  font-weight: 800;
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-glow);
  }

  &:active {
    transform: translateY(0px) scale(0.98);
  }
`;

const Summary = styled.div`
  color: var(--text-tertiary);
`;

function FavoritesPage() {
  const { favoriteIds, clearFavorites } = useFavorites();
  const toast = useToast();

  const list = useMemo(() => {
    const ids = Array.from(favoriteIds);
    return ids.map((id) => animeData.find((a) => a.id === id)).filter(Boolean);
  }, [favoriteIds]);

  const onClear = () => {
    if (list.length === 0) return;
    const ok = window.confirm('确定要清空收藏吗？此操作不可撤销。');
    if (!ok) return;

    clearFavorites();
    toast.success('已清空收藏', '随时可以从详情页再次加入收藏。');
  };

  return (
    <PageShell
      title="我的收藏"
      subtitle="你点过心动的作品都会留在这里（本地保存，刷新不丢）。"
      actions={
        <DangerButton type="button" onClick={onClear} disabled={list.length === 0}>
          <FiTrash2 />
          清空收藏
        </DangerButton>
      }
    >
      <Summary>
        共收藏 <strong>{list.length}</strong> 部作品
      </Summary>

      {list.length > 0 ? (
        <AnimeGrid>
          {list.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </AnimeGrid>
      ) : (
        <EmptyState
          icon={<FiHeart size={22} />}
          title="你还没有收藏任何作品"
          description="去作品详情页点一下“收藏”，它就会出现在这里。"
          primaryAction={{ href: '#/recommendations', label: '去看推荐' }}
          secondaryAction={{ href: '#/rankings', label: '看看排行榜' }}
        />
      )}
    </PageShell>
  );
}

export default FavoritesPage;
