import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useFavorites } from '../FavoritesProvider';
import { useToast } from '../ToastProvider';

const Card = styled(motion.article)`
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  transition: var(--transition);
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg), var(--shadow-glow);
    border-color: rgba(255, 77, 77, 0.25);
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

const FavButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(0, 0, 0, 0.22);
  color: rgba(255, 255, 255, 0.92);
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
    border-color: rgba(255, 77, 77, 0.45);
    color: rgba(255, 77, 77, 0.95);
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
  border-radius: 999px;
  background: rgba(255, 77, 77, 0.95);
  box-shadow: 0 0 0 3px rgba(255, 77, 77, 0.18);
`;

const Body = styled.div`
  padding: var(--spacing-md);
`;

const Title = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 576px) {
    font-size: 0.98rem;
  }
`;

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  font-size: 0.9rem;
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
    margin-right: 0.25rem;
  }
`;

function AnimeCard({ anime }) {
  const favorites = useFavorites();
  const toast = useToast();

  if (!anime) return null;

  const favorited = favorites.isFavorite(anime.id);
  const typeShort = anime?.type?.split('、')?.[0] ?? '';

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    favorites.toggleFavorite(anime.id);
    if (favorited) {
      toast.info('已取消收藏', `《${anime.title}》已从收藏移除。`);
    } else {
      toast.success('已加入收藏', `《${anime.title}》已加入收藏。`);
    }
  };

  return (
    <Card
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ scale: 1.02 }}
    >
      <Cover>
        <CoverLink to={`/anime/${anime.id}`} aria-label={`查看《${anime.title}》详情`} />
        <CoverImg src={anime.cover} alt={anime.title} loading="lazy" />
        <FavButton
          type="button"
          aria-label={favorited ? '取消收藏' : '加入收藏'}
          aria-pressed={favorited}
          onClick={toggleFavorite}
          style={
            favorited
              ? {
                  borderColor: 'rgba(255, 77, 77, 0.55)',
                  color: 'rgba(255, 77, 77, 0.95)',
                  background: 'rgba(255, 77, 77, 0.14)',
                }
              : undefined
          }
          title={favorited ? '已收藏' : '收藏'}
        >
          <FiHeart />
        </FavButton>
        {favorited ? <FavDot aria-hidden="true" /> : null}
      </Cover>
      <Link to={`/anime/${anime.id}`} aria-label={`查看《${anime.title}》详情`}>
        <Body>
          <Title>{anime.title}</Title>
          <Meta>
            <Type>{typeShort}</Type>
            <Rating>{anime.rating}</Rating>
          </Meta>
        </Body>
      </Link>
    </Card>
  );
}

export default AnimeCard;
