import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import animeData, { featuredAnime, popularAnime, newReleases, categories } from '../data/animeData';

const SectionContainer = styled.section`
  padding: var(--spacing-3xl) 0;
`;

const SectionInner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: var(--spacing-md);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary-color);
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Tab = styled.button`
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  font-size: 1rem;
  white-space: nowrap;
  transition: var(--transition);
  background-color: ${props => props.$active ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? 'white' : 'var(--text-secondary)'};
  
  &:hover {
    background-color: ${props => props.$active ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const AnimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--spacing-md);
  }
`;

const AnimeCard = styled(motion.div)`
  border-radius: var(--border-radius-md);
  overflow: hidden;
  background-color: rgba(22, 27, 34, 0.7);
  border: 1px solid var(--border-color);
  transition: var(--transition);
  box-shadow: var(--shadow-md);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(255, 77, 77, 0.3);
  }
`;

const AnimeCover = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 140%; /* 10:14 aspect ratio */
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  ${AnimeCard}:hover & img {
    transform: scale(1.05);
  }
`;

const AnimeCardContent = styled.div`
  padding: var(--spacing-md);
`;

const AnimeTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const AnimeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-tertiary);
`;

const AnimeType = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
`;

const AnimeRating = styled.span`
  display: flex;
  align-items: center;
  color: var(--secondary-color);
  
  &::before {
    content: '★';
    margin-right: 0.25rem;
  }
`;

const ShowMoreButton = styled.button`
  display: block;
  margin: var(--spacing-xl) auto 0;
  padding: 0.75rem 2rem;
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  transition: var(--transition);
  
  &:hover {
    background-color: rgba(255, 77, 77, 0.1);
    transform: translateY(-2px);
  }
`;

const categoryOptions = [
  { id: 'all', name: '全部' },
  { id: 'featured', name: '精选' },
  { id: 'popular', name: '热门' },
  { id: 'new', name: '最新' },
  ...categories.map(cat => ({ id: `cat-${cat.id}`, name: cat.name }))
];

function AnimeList() {
  const [activeTab, setActiveTab] = useState('all');
  const [displayCount, setDisplayCount] = useState(8);
  const [displayedAnime, setDisplayedAnime] = useState([]);
  
  useEffect(() => {
    let filteredAnime = [];
    
    switch(activeTab) {
      case 'featured':
        filteredAnime = featuredAnime.map(id => animeData.find(anime => anime.id === id));
        break;
      case 'popular':
        filteredAnime = popularAnime.map(id => animeData.find(anime => anime.id === id));
        break;
      case 'new':
        filteredAnime = newReleases.map(id => animeData.find(anime => anime.id === id));
        break;
      case 'all':
        filteredAnime = animeData;
        break;
      default:
        if (activeTab.startsWith('cat-')) {
          const catId = parseInt(activeTab.slice(4));
          filteredAnime = animeData.filter(anime => 
            anime.tags.some(tag => 
              categories.find(cat => cat.id === catId)?.name === tag
            )
          );
        } else {
          filteredAnime = animeData;
        }
    }
    
    setDisplayedAnime(filteredAnime);
    setDisplayCount(8); // 重置显示数量
  }, [activeTab]);
  
  const handleShowMore = () => {
    setDisplayCount(prev => prev + 8);
  };
  
  return (
    <SectionContainer>
      <SectionInner>
        <SectionHeader>
          <h2 className="section-title">国漫作品</h2>
          <TabsContainer>
            {categoryOptions.map((category) => (
              <Tab 
                key={category.id}
                $active={activeTab === category.id}
                onClick={() => setActiveTab(category.id)}
              >
                {category.name}
              </Tab>
            ))}
          </TabsContainer>
        </SectionHeader>
        
        <AnimeGrid>
          {displayedAnime.slice(0, displayCount).map((anime) => (
            <AnimeCard 
              key={anime.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link to={`/anime/${anime.id}`}>
                <AnimeCover>
                  <img src={anime.cover} alt={anime.title} />
                </AnimeCover>
                <AnimeCardContent>
                  <AnimeTitle>{anime.title}</AnimeTitle>
                  <AnimeInfo>
                    <AnimeType>{anime.type.split('、')[0]}</AnimeType>
                    <AnimeRating>{anime.rating}</AnimeRating>
                  </AnimeInfo>
                </AnimeCardContent>
              </Link>
            </AnimeCard>
          ))}
        </AnimeGrid>
        
        {displayCount < displayedAnime.length && (
          <ShowMoreButton onClick={handleShowMore}>
            查看更多
          </ShowMoreButton>
        )}
      </SectionInner>
    </SectionContainer>
  );
}

export default AnimeList; 