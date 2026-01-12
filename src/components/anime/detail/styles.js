import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export const DetailContainer = styled(motion.section).attrs({ layout: true })`
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-3xl);
`;

export const DetailInner = styled.div.attrs({ 'data-stagger': true, 'data-divider': 'list' })`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

export const BannerContainer = styled.div.attrs({ 'data-parallax': true })`
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

export const BannerImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$image});
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
    background: var(--hero-overlay);
  }
`;

export const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-2xl);
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const CoverContainer = styled.div`
  grid-column: span 4;

  @media (max-width: 992px) {
    display: flex;
    justify-content: center;
    grid-column: 1 / -1;
  }
`;

export const CoverImage = styled(motion.div).attrs({ 'data-card': true })`
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
    background: linear-gradient(0deg, var(--overlay-strong) 0%, transparent 60%);
    z-index: 1;
  }
`;

export const AnimeInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
  grid-column: span 8;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

export const AnimeTitle = styled.h1`
  font-size: var(--text-9xl);
  font-weight: 900;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
  grid-column: 1 / -1;

  @media (max-width: 768px) {
    font-size: var(--text-8xl);
  }

  @media (max-width: 576px) {
    font-size: var(--text-5xl);
  }
`;

export const AnimeOriginalTitle = styled.h2`
  font-size: var(--text-lg-plus);
  font-weight: 400;
  margin-bottom: var(--spacing-lg);
  color: var(--text-tertiary);
  grid-column: 1 / -1;
`;

export const MetaInfo = styled.div.attrs({ role: 'list', 'aria-label': '作品信息' })`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  grid-column: span 7;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

export const MetaItem = styled.div.attrs({ role: 'listitem' })`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

export const MetaLabel = styled.span`
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

export const MetaValue = styled.span`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-secondary);
`;

export const AnimeDescription = styled.p`
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  grid-column: 1 / -1;

  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  grid-column: 1 / -1;
`;

export const ProgressCard = styled.div.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  display: grid;
  gap: var(--spacing-md);
  grid-column: span 5;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

export const ProgressTitle = styled.h3`
  font-size: var(--text-lg-plus);
  font-weight: 600;
  color: var(--text-primary);
`;

export const ProgressRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: var(--spacing-md);
  align-items: center;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const ProgressLabel = styled.span`
  color: var(--text-tertiary);
  font-size: var(--text-sm-plus);
`;

export const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

export const ProgressActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

export const WatchButton = styled.a.attrs({
  'data-shimmer': true,
  'data-pressable': true,
  'data-focus-guide': true,
})`
  padding: var(--spacing-sm-plus) var(--spacing-xl);
  background-color: var(--primary-color);
  color: var(--text-on-primary);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: var(--transition);
  box-shadow: var(--shadow-primary);

  &:hover {
    background-color: var(--primary-color);
    filter: brightness(1.05);
    transform: translateY(-2px);
    box-shadow: var(--shadow-primary-hover);
  }

  &[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
    background-color: var(--surface-soft);
    color: var(--text-tertiary);
    border: 1px solid var(--border-subtle);
  }
`;

export const SecondaryButton = styled.button.attrs({ 'data-pressable': true })`
  padding: var(--spacing-sm-plus) var(--spacing-lg);
  background-color: ${(p) => (p.$active ? 'var(--primary-soft)' : 'var(--surface-soft)')};
  color: ${(p) => (p.$active ? 'var(--text-primary)' : 'var(--text-secondary)')};
  border-radius: var(--border-radius-md);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: var(--transition);
  border: 1px solid ${(p) => (p.$active ? 'var(--primary-soft-border)' : 'var(--border-subtle)')};

  &:hover {
    background-color: ${(p) =>
      p.$active ? 'var(--primary-soft-hover)' : 'var(--surface-soft-hover)'};
    transform: translateY(-2px);
  }
`;

export const TagsContainer = styled.div`
  margin-bottom: var(--spacing-xl);
  grid-column: span 6;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

export const TagsTitle = styled.h3`
  font-size: var(--text-lg-plus);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`;

export const Tags = styled.div.attrs({ role: 'list' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

export const Tag = styled(Link).attrs({ 'data-pressable': true, role: 'listitem' })`
  padding: var(--spacing-xs) var(--spacing-sm-plus);
  background-color: var(--primary-soft);
  border: 1px solid var(--primary-soft-border);
  color: var(--primary-color);
  border-radius: var(--border-radius-sm);
  font-size: var(--text-sm);
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-soft-hover);
    transform: translateY(-2px);
  }
`;

export const StaffContainer = styled.div`
  margin-bottom: var(--spacing-xl);
  grid-column: span 6;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

export const CharactersContainer = styled.div`
  margin-bottom: var(--spacing-xl);
  grid-column: 1 / -1;
`;

export const SectionTitle = styled.h3`
  font-size: var(--text-4xl);
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

export const StaffGrid = styled.div.attrs({ role: 'list' })`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
`;

export const StaffCard = styled.div.attrs({
  role: 'listitem',
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '2',
})`
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
`;

export const StaffRole = styled.span`
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-xs);
`;

export const StaffName = styled.span`
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-secondary);
`;

export const CharactersGrid = styled.div.attrs({ role: 'list' })`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
`;

export const CharacterCard = styled.div.attrs({
  role: 'listitem',
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '2',
})`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
`;

export const CharacterAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-4xl);
  font-weight: 600;
  color: var(--text-primary);
`;

export const CharacterInfo = styled.div`
  flex: 1;
`;

export const CharacterName = styled.div`
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-secondary);
`;

export const CharacterDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--text-tertiary);
`;

export const RelatedContainer = styled.div`
  margin-bottom: var(--spacing-xl);
  grid-column: span 6;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

export const RelatedGrid = styled.div.attrs({ role: 'list' })`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
`;

export const RelatedCard = styled(Link).attrs({
  role: 'listitem',
  'data-card': true,
  'data-divider': 'card',
  'data-pressable': true,
})`
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

export const RelatedImage = styled.div`
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
    transition: transform var(--motion-base) var(--ease-out);
  }
`;

export const RelatedTitle = styled.div`
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  padding: var(--spacing-sm);
  text-align: center;
  background: var(--surface-glass);
  backdrop-filter: blur(12px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
  -webkit-mask-image: linear-gradient(90deg, #000 0%, #000 82%, transparent 100%);
  mask-image: linear-gradient(90deg, #000 0%, #000 82%, transparent 100%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
`;

export const ReviewsContainer = styled.div`
  grid-column: span 6;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

export const ReviewCard = styled.div.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '2',
})`
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
`;

export const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

export const ReviewUser = styled.div`
  font-weight: 600;
  color: var(--text-secondary);
`;

export const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--secondary-color);
`;

export const ReviewComment = styled.p`
  line-height: var(--leading-normal);
  color: var(--text-secondary);
`;

export const CommentForm = styled.form`
  display: grid;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`;

export const CommentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

export const CommentActions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

export const CommentButton = styled.button.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md-tight);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    background: var(--surface-soft-hover);
  }
`;
