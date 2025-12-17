import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }
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
  if (!anime) return null;

  const typeShort = anime?.type?.split('、')?.[0] ?? '';

  return (
    <Card
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link to={`/anime/${anime.id}`} aria-label={`查看《${anime.title}》详情`}>
        <Cover>
          <img src={anime.cover} alt={anime.title} loading="lazy" />
        </Cover>
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

