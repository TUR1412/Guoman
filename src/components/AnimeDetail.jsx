import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiStar, FiPlay, FiCalendar, FiFilm, FiUsers, FiDownload, FiShare2, FiHeart } from 'react-icons/fi';
import animeData from '../data/animeData';

const DetailContainer = styled.section`
  padding-top: calc(var(--header-height) + var(--spacing-xl));
  padding-bottom: var(--spacing-3xl);
`;

const DetailInner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-2xl);
  
  @media (max-width: 768px) {
    height: 300px;
  }
  
  @media (max-width: 576px) {
    height: 200px;
  }
`;

const BannerImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(13, 17, 23, 1) 0%, rgba(13, 17, 23, 0.7) 50%, rgba(13, 17, 23, 0.4) 100%);
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-2xl);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CoverContainer = styled.div`
  @media (max-width: 992px) {
    display: flex;
    justify-content: center;
  }
`;

const CoverImage = styled(motion.div)`
  width: 100%;
  max-width: 300px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  position: relative;
  
  img {
    width: 100%;
    display: block;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 50%);
    z-index: 1;
  }
`;

const AnimeInfo = styled.div``;

const AnimeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.75rem;
  }
`;

const AnimeOriginalTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 400;
  margin-bottom: var(--spacing-lg);
  color: var(--text-tertiary);
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaLabel = styled.span`
  font-size: 0.9rem;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetaValue = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const AnimeDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
`;

const WatchButton = styled(Link)`
  padding: 0.75rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
  
  &:hover {
    background-color: #e64545;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 77, 77, 0.4);
  }
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
  border: 1px solid var(--border-color);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const TagsContainer = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const TagsTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled(Link)`
  padding: 0.25rem 0.75rem;
  background-color: rgba(255, 77, 77, 0.1);
  color: var(--primary-color);
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
  transition: var(--transition);
  
  &:hover {
    background-color: rgba(255, 77, 77, 0.2);
    transform: translateY(-2px);
  }
`;

const StaffContainer = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const CharactersContainer = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: var(--primary-color);
  }
`;

const StaffGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
`;

const StaffCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgba(22, 27, 34, 0.6);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
`;

const StaffRole = styled.span`
  font-size: 0.9rem;
  color: var(--text-tertiary);
  margin-bottom: 0.25rem;
`;

const StaffName = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const CharactersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
`;

const CharacterCard = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background-color: rgba(22, 27, 34, 0.6);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
`;

const CharacterAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-tertiary);
`;

const CharacterInfo = styled.div`
  flex: 1;
`;

const CharacterName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const CharacterDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--text-tertiary);
`;

const RelatedContainer = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
`;

const RelatedCard = styled(Link)`
  display: block;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  transition: var(--transition);
  
  &:hover {
    transform: translateY(-5px);
    
    img {
      transform: scale(1.05);
    }
  }
`;

const RelatedImage = styled.div`
  width: 100%;
  height: 0;
  padding-top: 140%; /* 10:14 aspect ratio */
  position: relative;
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
`;

const RelatedTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  padding: var(--spacing-sm);
  text-align: center;
  background-color: rgba(22, 27, 34, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReviewsContainer = styled.div``;

const ReviewCard = styled.div`
  background-color: rgba(22, 27, 34, 0.6);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  margin-bottom: var(--spacing-md);
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const ReviewUser = styled.div`
  font-weight: 600;
  color: var(--text-secondary);
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--secondary-color);
`;

const ReviewComment = styled.p`
  line-height: 1.6;
  color: var(--text-secondary);
`;

function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [relatedAnimes, setRelatedAnimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchAnime = () => {
      try {
        const foundAnime = animeData.find(anime => anime.id === parseInt(id));
        if (foundAnime) {
          setAnime(foundAnime);
          
          // 获取相关动漫
          if (foundAnime.relatedAnime && foundAnime.relatedAnime.length > 0) {
            const related = foundAnime.relatedAnime
              .map(relId => animeData.find(a => a.id === relId))
              .filter(Boolean);
            setRelatedAnimes(related);
          }
        }
      } catch (error) {
        console.error('Error fetching anime:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnime();
  }, [id]);
  
  if (isLoading) {
    return (
      <DetailContainer>
        <DetailInner>
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <h2>加载中...</h2>
          </div>
        </DetailInner>
      </DetailContainer>
    );
  }
  
  if (!anime) {
    return (
      <DetailContainer>
        <DetailInner>
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <h2>未找到该动漫</h2>
            <p>抱歉，我们找不到您请求的动漫内容。</p>
            <Link to="/" style={{ color: 'var(--primary-color)', marginTop: '1rem', display: 'inline-block' }}>
              返回首页
            </Link>
          </div>
        </DetailInner>
      </DetailContainer>
    );
  }
  
  return (
    <DetailContainer>
      <BannerContainer>
        <BannerImage image={anime.cover} />
      </BannerContainer>
      
      <DetailInner>
        <ContentContainer>
          <CoverContainer>
            <CoverImage
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src={anime.cover} alt={anime.title} />
            </CoverImage>
          </CoverContainer>
          
          <AnimeInfo>
            <AnimeTitle>{anime.title}</AnimeTitle>
            <AnimeOriginalTitle>{anime.originalTitle}</AnimeOriginalTitle>
            
            <MetaInfo>
              <MetaItem>
                <MetaLabel><FiStar /> 评分</MetaLabel>
                <MetaValue>{anime.rating}/5</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel><FiCalendar /> 年份</MetaLabel>
                <MetaValue>{anime.releaseYear}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel><FiFilm /> 集数</MetaLabel>
                <MetaValue>{anime.episodes}集</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel><FiUsers /> 人气</MetaLabel>
                <MetaValue>{anime.popularity.toLocaleString()}</MetaValue>
              </MetaItem>
            </MetaInfo>
            
            <AnimeDescription>{anime.description}</AnimeDescription>
            
            <ActionButtons>
              <WatchButton to={anime.watchLinks[0]?.url || "#"} target="_blank">
                <FiPlay /> 立即观看
              </WatchButton>
              <SecondaryButton>
                <FiDownload /> 下载
              </SecondaryButton>
              <SecondaryButton>
                <FiHeart /> 收藏
              </SecondaryButton>
              <SecondaryButton>
                <FiShare2 /> 分享
              </SecondaryButton>
            </ActionButtons>
            
            <TagsContainer>
              <TagsTitle>标签</TagsTitle>
              <Tags>
                {anime.tags.map((tag, index) => (
                  <Tag key={index} to={`/tag/${tag}`}>
                    {tag}
                  </Tag>
                ))}
              </Tags>
            </TagsContainer>
            
            {anime.staff && anime.staff.length > 0 && (
              <StaffContainer>
                <SectionTitle>制作人员</SectionTitle>
                <StaffGrid>
                  {anime.staff.map((staff, index) => (
                    <StaffCard key={index}>
                      <StaffRole>{staff.role}</StaffRole>
                      <StaffName>{staff.name}</StaffName>
                    </StaffCard>
                  ))}
                </StaffGrid>
              </StaffContainer>
            )}
            
            {anime.characters && anime.characters.length > 0 && (
              <CharactersContainer>
                <SectionTitle>角色</SectionTitle>
                <CharactersGrid>
                  {anime.characters.map((character, index) => (
                    <CharacterCard key={index}>
                      <CharacterAvatar>
                        {character.name.charAt(0)}
                      </CharacterAvatar>
                      <CharacterInfo>
                        <CharacterName>{character.name}</CharacterName>
                        <CharacterDetails>
                          <span>{character.role}</span>
                          <span>CV: {character.voice}</span>
                        </CharacterDetails>
                      </CharacterInfo>
                    </CharacterCard>
                  ))}
                </CharactersGrid>
              </CharactersContainer>
            )}
            
            {relatedAnimes.length > 0 && (
              <RelatedContainer>
                <SectionTitle>相关推荐</SectionTitle>
                <RelatedGrid>
                  {relatedAnimes.map((relatedAnime) => (
                    <RelatedCard key={relatedAnime.id} to={`/anime/${relatedAnime.id}`}>
                      <RelatedImage>
                        <img src={relatedAnime.cover} alt={relatedAnime.title} />
                      </RelatedImage>
                      <RelatedTitle>{relatedAnime.title}</RelatedTitle>
                    </RelatedCard>
                  ))}
                </RelatedGrid>
              </RelatedContainer>
            )}
            
            {anime.reviews && anime.reviews.length > 0 && (
              <ReviewsContainer>
                <SectionTitle>评论</SectionTitle>
                {anime.reviews.map((review, index) => (
                  <ReviewCard key={index}>
                    <ReviewHeader>
                      <ReviewUser>{review.user}</ReviewUser>
                      <ReviewRating>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar key={i} style={{ fill: i < review.rating ? 'var(--secondary-color)' : 'none' }} />
                        ))}
                      </ReviewRating>
                    </ReviewHeader>
                    <ReviewComment>{review.comment}</ReviewComment>
                  </ReviewCard>
                ))}
              </ReviewsContainer>
            )}
          </AnimeInfo>
        </ContentContainer>
      </DetailInner>
    </DetailContainer>
  );
}

export default AnimeDetail; 