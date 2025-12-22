import React, { useId, useMemo, useState, useEffect } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FiStar,
  FiPlay,
  FiCalendar,
  FiFilm,
  FiUsers,
  FiDownload,
  FiShare2,
  FiBell,
  FiHeart,
} from 'react-icons/fi';
import { animeIndex } from '../data/animeData';
import EmptyState from './EmptyState';
import { useToast } from './ToastProvider';
import { toggleFavorite } from '../utils/favoritesStore';
import { toggleFollowing } from '../utils/followingStore';
import { useIsFavorite } from '../utils/useIsFavorite';
import { useIsFollowing } from '../utils/useIsFollowing';
import { shareOrCopyLink } from '../utils/share';
import { recordRecentlyViewed } from '../utils/recentlyViewed';
import { usePageMeta } from '../utils/pageMeta';
import { addComment, clearComments, getCommentsForAnime } from '../utils/commentsStore';
import { downloadTextFile } from '../utils/download';
import { recordDownload, recordPlay } from '../utils/engagementStore';
import { buildPosterSvg, recordSharePoster } from '../utils/sharePoster';
import { trackEvent } from '../utils/analytics';
import {
  clearWatchProgress,
  getWatchProgress,
  subscribeWatchProgressById,
  updateWatchProgress,
} from '../utils/watchProgress';

const DetailContainer = styled(motion.section).attrs({ layout: true })`
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-3xl);
`;

const DetailInner = styled.div.attrs({ 'data-stagger': true, 'data-divider': 'list' })`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const BannerContainer = styled.div.attrs({ 'data-parallax': true })`
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

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-2xl);
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CoverContainer = styled.div`
  grid-column: span 4;

  @media (max-width: 992px) {
    display: flex;
    justify-content: center;
    grid-column: 1 / -1;
  }
`;

const CoverImage = styled(motion.div).attrs({ 'data-card': true })`
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

const AnimeInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
  grid-column: span 8;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const AnimeTitle = styled.h1`
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

const AnimeOriginalTitle = styled.h2`
  font-size: var(--text-lg-plus);
  font-weight: 400;
  margin-bottom: var(--spacing-lg);
  color: var(--text-tertiary);
  grid-column: 1 / -1;
`;

const MetaInfo = styled.div.attrs({ role: 'list', 'aria-label': '作品信息' })`
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

const MetaItem = styled.div.attrs({ role: 'listitem' })`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const MetaLabel = styled.span`
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const MetaValue = styled.span`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-secondary);
`;

const AnimeDescription = styled.p`
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  grid-column: 1 / -1;

  @media (max-width: 768px) {
    font-size: var(--text-base);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  grid-column: 1 / -1;
`;

const ProgressCard = styled.div.attrs({ 'data-card': true, 'data-divider': 'card' })`
  background: var(--surface-glass);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-subtle);
  margin-bottom: var(--spacing-xl);
  display: grid;
  gap: var(--spacing-md);
  backdrop-filter: blur(14px);
  grid-column: span 5;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const ProgressTitle = styled.h3`
  font-size: var(--text-lg-plus);
  font-weight: 600;
  color: var(--text-primary);
`;

const ProgressRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: var(--spacing-md);
  align-items: center;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ProgressLabel = styled.span`
  color: var(--text-tertiary);
  font-size: var(--text-sm-plus);
`;

const ProgressInput = styled.input`
  width: 100%;
  padding: var(--spacing-sm-mid) var(--spacing-md-compact);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--field-bg);
  color: var(--text-primary);
`;

const ProgressRange = styled.input`
  width: 100%;
  accent-color: var(--primary-color);
`;

const ProgressMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

const ProgressActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const WatchButton = styled.a.attrs({
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

const SecondaryButton = styled.button.attrs({ 'data-pressable': true })`
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

const TagsContainer = styled.div`
  margin-bottom: var(--spacing-xl);
  grid-column: span 6;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const TagsTitle = styled.h3`
  font-size: var(--text-lg-plus);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`;

const Tags = styled.div.attrs({ role: 'list' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
`;

const Tag = styled(Link).attrs({ 'data-pressable': true, role: 'listitem' })`
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

const StaffContainer = styled.div`
  margin-bottom: var(--spacing-xl);
  grid-column: span 6;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const CharactersContainer = styled.div`
  margin-bottom: var(--spacing-xl);
  grid-column: 1 / -1;
`;

const SectionTitle = styled.h3`
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

const StaffGrid = styled.div.attrs({ role: 'list' })`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
`;

const StaffCard = styled.div.attrs({ role: 'listitem', 'data-card': true, 'data-divider': 'card' })`
  display: flex;
  flex-direction: column;
  background: var(--surface-glass);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(12px);
`;

const StaffRole = styled.span`
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--spacing-xs);
`;

const StaffName = styled.span`
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-secondary);
`;

const CharactersGrid = styled.div.attrs({ role: 'list' })`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
`;

const CharacterCard = styled.div.attrs({
  role: 'listitem',
  'data-card': true,
  'data-divider': 'card',
})`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: var(--surface-glass);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  border: 1px solid var(--border-subtle);
  backdrop-filter: blur(12px);
`;

const CharacterAvatar = styled.div`
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

const CharacterInfo = styled.div`
  flex: 1;
`;

const CharacterName = styled.div`
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-secondary);
`;

const CharacterDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--text-tertiary);
`;

const RelatedContainer = styled.div`
  margin-bottom: var(--spacing-xl);
  grid-column: span 6;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const RelatedGrid = styled.div.attrs({ role: 'list' })`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
`;

const RelatedCard = styled(Link).attrs({
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
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-secondary);
  padding: var(--spacing-sm);
  text-align: center;
  background: var(--surface-glass);
  backdrop-filter: blur(12px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReviewsContainer = styled.div`
  grid-column: span 6;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const ReviewCard = styled.div.attrs({ 'data-card': true, 'data-divider': 'card' })`
  background: var(--surface-glass);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-subtle);
  margin-bottom: var(--spacing-md);
  backdrop-filter: blur(12px);
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
  gap: var(--spacing-xs);
  color: var(--secondary-color);
`;

const ReviewComment = styled.p`
  line-height: var(--leading-normal);
  color: var(--text-secondary);
`;

const CommentForm = styled.form`
  display: grid;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`;

const CommentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const CommentInput = styled.input`
  flex: 1;
  min-width: 180px;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--field-bg);
  color: var(--text-primary);

  &:focus {
    border-color: var(--primary-color);
    background: var(--field-bg-focus);
  }
`;

const CommentSelect = styled.select`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--field-bg);
  color: var(--text-primary);
`;

const CommentTextarea = styled.textarea`
  min-height: 120px;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--field-bg);
  color: var(--text-primary);
  resize: vertical;
  line-height: var(--leading-relaxed);

  &:focus {
    border-color: var(--primary-color);
    background: var(--field-bg-focus);
  }
`;

const CommentActions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const CommentButton = styled.button.attrs({ 'data-pressable': true })`
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

function AnimeDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [anime, setAnime] = useState(null);
  const [relatedAnimes, setRelatedAnimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [watchProgress, setWatchProgress] = useState(null);
  const [userComments, setUserComments] = useState([]);
  const [commentUser, setCommentUser] = useState('');
  const [commentDraft, setCommentDraft] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const titleId = useId();
  const descId = useId();
  const episodeInputId = useId();
  const progressRangeId = useId();
  const progressMetaId = useId();
  const reducedMotion = useReducedMotion();
  const toast = useToast();
  const favorited = useIsFavorite(anime?.id);
  const following = useIsFollowing(anime?.id);
  const sharedCoverLayoutId =
    typeof location?.state?.coverLayoutId === 'string' ? location.state.coverLayoutId : undefined;
  usePageMeta({
    title: anime ? anime.title : '作品详情',
    description: anime?.description || '查看国漫详情、评分、剧情与角色信息。',
    image: anime?.cover,
    structuredData: anime
      ? {
          '@type': 'CreativeWork',
          name: anime.title,
          description: anime.description,
          genre: anime.tags,
          datePublished: String(anime.releaseYear),
        }
      : null,
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAnime = () => {
      try {
        const numericId = Number.parseInt(id, 10);
        const foundAnime = Number.isFinite(numericId) ? animeIndex.get(numericId) : null;
        if (foundAnime) {
          setAnime(foundAnime);

          // 获取相关动漫
          if (foundAnime.relatedAnime && foundAnime.relatedAnime.length > 0) {
            const related = foundAnime.relatedAnime
              .map((relId) => animeIndex.get(relId))
              .filter(Boolean);
            setRelatedAnimes(related);
          } else {
            setRelatedAnimes([]);
          }
        } else {
          setAnime(null);
          setRelatedAnimes([]);
        }
      } catch (error) {
        if (import.meta.env?.DEV) {
          console.error('Error fetching anime:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  useEffect(() => {
    if (!anime?.id) return;
    recordRecentlyViewed(anime.id);
    trackEvent('anime.view', { id: anime.id });
  }, [anime?.id]);

  useEffect(() => {
    if (!anime?.id) return;
    setWatchProgress(getWatchProgress(anime.id) || { episode: 1, progress: 0 });
    const unsubscribe = subscribeWatchProgressById(anime.id, () => {
      setWatchProgress(getWatchProgress(anime.id) || { episode: 1, progress: 0 });
    });
    return unsubscribe;
  }, [anime?.id]);

  useEffect(() => {
    if (!anime?.id) return;
    setUserComments(getCommentsForAnime(anime.id));
  }, [anime?.id]);

  const mergedReviews = useMemo(() => {
    const base = Array.isArray(anime?.reviews) ? anime.reviews : [];
    const locals = userComments.map((comment) => ({
      user: comment.user,
      rating: comment.rating || 0,
      comment: comment.comment,
      isLocal: true,
    }));
    return [...locals, ...base];
  }, [anime?.reviews, userComments]);

  if (isLoading) {
    return (
      <DetailContainer aria-label="作品详情加载中">
        <DetailInner>
          <EmptyState
            icon={<FiFilm size={22} />}
            title="加载中..."
            description="正在为你准备作品详情。"
            primaryAction={{ to: '/rankings', label: '先逛逛排行榜' }}
            secondaryAction={{ to: '/recommendations', label: '看看推荐' }}
          />
        </DetailInner>
      </DetailContainer>
    );
  }

  if (!anime) {
    return (
      <DetailContainer aria-label="作品详情未找到">
        <DetailInner>
          <EmptyState
            icon={<FiFilm size={22} />}
            title="未找到该动漫"
            description="可能是链接已过期，或者该条目尚未收录。"
            primaryAction={{ to: '/', label: '回到首页' }}
            secondaryAction={{ to: '/search', label: '去搜索' }}
          />
        </DetailInner>
      </DetailContainer>
    );
  }

  const watchHref = anime.watchLinks?.[0]?.url;
  const isWatchDisabled = !watchHref;

  const handleToggleFavorite = () => {
    toggleFavorite(anime.id);

    if (favorited) {
      toast.info('已取消收藏', '你可以随时再次加入收藏。');
    } else {
      toast.success('已加入收藏', '已为你保存到「收藏」页。');
    }
    trackEvent('anime.favorite.toggle', { id: anime.id, active: !favorited });
  };

  const handleToggleFollowing = () => {
    const result = toggleFollowing({ animeId: anime.id, title: anime.title });
    if (!result.ok) return;

    if (result.action === 'followed') {
      toast.success('已加入追更', '可在「追更中心」为本片设置提醒。');
    } else if (result.action === 'unfollowed') {
      toast.info('已取消追更', '你可以随时重新加入追更。');
    }

    trackEvent('anime.follow.toggle', { id: anime.id, active: result.action === 'followed' });
  };

  const handleDownload = () => {
    recordDownload({ animeId: anime.id, title: anime.title });
    toast.success('已记录下载意向', '下载入口开放后会自动同步。');
    trackEvent('anime.download', { id: anime.id });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const result = await shareOrCopyLink({ title: anime.title, url });

    if (result.ok && result.method === 'share') {
      toast.success('已打开分享面板', '把这部国漫安利出去吧。');
      trackEvent('anime.share', { id: anime.id, method: 'share' });
      return;
    }

    if (result.ok && result.method === 'clipboard') {
      toast.success('链接已复制', '已复制到剪贴板，直接粘贴发送即可。');
      trackEvent('anime.share', { id: anime.id, method: 'clipboard' });
      return;
    }

    toast.warning('无法自动复制', '请手动从地址栏复制当前链接。');
    trackEvent('anime.share', { id: anime.id, method: 'fallback' });
  };

  const handlePoster = () => {
    const svg = buildPosterSvg({
      title: anime.title,
      subtitle: anime.originalTitle,
      rating: anime.rating,
    });
    const filename = `guoman-poster-${anime.id}.svg`;
    const res = downloadTextFile({
      text: svg,
      filename,
      mimeType: 'image/svg+xml;charset=utf-8',
    });

    if (!res.ok) {
      toast.warning('生成失败', '请检查浏览器下载权限后重试。');
      return;
    }

    recordSharePoster({ title: anime.title, subtitle: anime.originalTitle });
    toast.success('海报已生成', '分享卡片已下载到本地。', { celebrate: true });
    trackEvent('anime.poster', { id: anime.id });
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    const message = commentDraft.trim();
    if (!message) {
      toast.warning('评论不能为空', '写点你对这部作品的感受吧。');
      return;
    }

    const entry = addComment({
      animeId: String(anime.id),
      user: commentUser.trim() || '访客',
      comment: message,
      rating: commentRating,
    });

    if (!entry) {
      toast.warning('评论提交失败', '请稍后再试。');
      return;
    }

    setUserComments((prev) => [entry, ...prev]);
    setCommentDraft('');
    trackEvent('anime.comment.add', { id: anime.id, rating: commentRating });
    toast.success('评论已发布', '你的评论已经保存到本地。');
  };

  const handleClearComments = () => {
    clearComments(String(anime.id));
    setUserComments([]);
    trackEvent('anime.comment.clear', { id: anime.id });
    toast.info('已清空本地评论', '随时可以重新发表。');
  };

  const handleProgressUpdate = (next) => {
    if (!anime?.id) return;
    const nextEpisode = Math.min(Math.max(Number(next.episode || 1), 1), anime.episodes);
    const nextProgress = Math.min(Math.max(Number(next.progress || 0), 0), 100);
    const updated = updateWatchProgress({
      animeId: anime.id,
      episode: nextEpisode,
      progress: nextProgress,
    });
    setWatchProgress(updated);
  };

  const handleClearProgress = () => {
    if (!anime?.id) return;
    clearWatchProgress(anime.id);
    setWatchProgress({ episode: 1, progress: 0 });
    toast.info('进度已清空', '随时可以从这里重新开始记录。');
  };

  const safeProgress = watchProgress || { episode: 1, progress: 0 };

  return (
    <DetailContainer aria-labelledby={titleId} aria-describedby={descId}>
      <BannerContainer>
        <BannerImage $image={anime.cover} />
      </BannerContainer>

      <DetailInner>
        <ContentContainer>
          <CoverContainer>
            <CoverImage
              layoutId={sharedCoverLayoutId}
              initial={sharedCoverLayoutId ? false : reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : sharedCoverLayoutId
                    ? { type: 'spring', stiffness: 260, damping: 28, mass: 0.4 }
                    : { duration: 0.5 }
              }
            >
              <img
                src={anime.cover}
                alt={anime.title}
                loading="eager"
                decoding="async"
                width="400"
                height="600"
              />
            </CoverImage>
          </CoverContainer>

          <AnimeInfo>
            <AnimeTitle id={titleId}>{anime.title}</AnimeTitle>
            <AnimeOriginalTitle>{anime.originalTitle}</AnimeOriginalTitle>

            <MetaInfo>
              <MetaItem>
                <MetaLabel>
                  <FiStar /> 评分
                </MetaLabel>
                <MetaValue>{anime.rating}/5</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>
                  <FiCalendar /> 年份
                </MetaLabel>
                <MetaValue>{anime.releaseYear}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>
                  <FiFilm /> 集数
                </MetaLabel>
                <MetaValue>{anime.episodes}集</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>
                  <FiUsers /> 人气
                </MetaLabel>
                <MetaValue>{anime.popularity.toLocaleString()}</MetaValue>
              </MetaItem>
            </MetaInfo>

            <AnimeDescription id={descId}>{anime.description}</AnimeDescription>

            <ActionButtons>
              <WatchButton
                href={watchHref || undefined}
                target={isWatchDisabled ? undefined : '_blank'}
                rel={isWatchDisabled ? undefined : 'noopener noreferrer'}
                aria-disabled={isWatchDisabled}
                tabIndex={isWatchDisabled ? -1 : 0}
                onClick={(event) => {
                  if (!isWatchDisabled) {
                    handleProgressUpdate({
                      episode: safeProgress.episode,
                      progress: Math.max(safeProgress.progress, 5),
                    });
                    recordPlay({
                      animeId: anime.id,
                      title: anime.title,
                      platform: anime.watchLinks?.[0]?.platform,
                    });
                    trackEvent('anime.play', {
                      id: anime.id,
                      platform: anime.watchLinks?.[0]?.platform,
                    });
                    return;
                  }
                  event.preventDefault();
                  toast.info('暂无播放链接', '该作品暂未提供可用播放入口。');
                }}
              >
                <FiPlay /> 立即观看
              </WatchButton>
              <SecondaryButton type="button" onClick={handleDownload}>
                <FiDownload /> 下载
              </SecondaryButton>
              <SecondaryButton
                type="button"
                $active={favorited}
                aria-pressed={favorited}
                onClick={handleToggleFavorite}
              >
                <FiHeart /> {favorited ? '已收藏' : '收藏'}
              </SecondaryButton>
              <SecondaryButton
                type="button"
                $active={following}
                aria-pressed={following}
                onClick={handleToggleFollowing}
              >
                <FiBell /> {following ? '已追更' : '追更'}
              </SecondaryButton>
              <SecondaryButton type="button" onClick={handleShare}>
                <FiShare2 /> 分享
              </SecondaryButton>
              <SecondaryButton type="button" onClick={handlePoster}>
                <FiShare2 /> 生成海报
              </SecondaryButton>
            </ActionButtons>

            <ProgressCard>
              <ProgressTitle>观看进度</ProgressTitle>
              <ProgressRow>
                <ProgressLabel as="label" htmlFor={episodeInputId}>
                  当前集数
                </ProgressLabel>
                <ProgressInput
                  id={episodeInputId}
                  type="number"
                  min={1}
                  max={anime.episodes}
                  value={safeProgress.episode}
                  onChange={(event) =>
                    handleProgressUpdate({
                      episode: Number(event.target.value || 1),
                      progress: safeProgress.progress,
                    })
                  }
                />
              </ProgressRow>
              <ProgressRow>
                <ProgressLabel as="label" htmlFor={progressRangeId}>
                  本集进度
                </ProgressLabel>
                <div>
                  <ProgressRange
                    id={progressRangeId}
                    type="range"
                    min={0}
                    max={100}
                    value={safeProgress.progress}
                    aria-describedby={progressMetaId}
                    onChange={(event) =>
                      handleProgressUpdate({
                        episode: safeProgress.episode,
                        progress: Number(event.target.value || 0),
                      })
                    }
                  />
                  <ProgressMeta id={progressMetaId}>
                    <span>0%</span>
                    <span>{safeProgress.progress}%</span>
                    <span>100%</span>
                  </ProgressMeta>
                </div>
              </ProgressRow>
              <ProgressActions>
                <SecondaryButton
                  type="button"
                  onClick={() =>
                    handleProgressUpdate({
                      episode: safeProgress.episode,
                      progress: 50,
                    })
                  }
                >
                  先看到一半
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() =>
                    handleProgressUpdate({
                      episode: anime.episodes,
                      progress: 100,
                    })
                  }
                >
                  追到最新
                </SecondaryButton>
                <SecondaryButton type="button" onClick={handleClearProgress}>
                  清空进度
                </SecondaryButton>
              </ProgressActions>
            </ProgressCard>

            <TagsContainer>
              <TagsTitle>标签</TagsTitle>
              <Tags>
                {anime.tags.map((tag) => (
                  <Tag key={tag} to={`/tag/${encodeURIComponent(tag)}`}>
                    {tag}
                  </Tag>
                ))}
              </Tags>
            </TagsContainer>

            {anime.staff && anime.staff.length > 0 && (
              <StaffContainer>
                <SectionTitle>制作人员</SectionTitle>
                <StaffGrid>
                  {anime.staff.map((staff) => (
                    <StaffCard key={`${staff.role}:${staff.name}`}>
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
                  {anime.characters.map((character) => (
                    <CharacterCard key={character.name}>
                      <CharacterAvatar>{character.name.charAt(0)}</CharacterAvatar>
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
                        <img
                          src={relatedAnime.cover}
                          alt={relatedAnime.title}
                          loading="lazy"
                          decoding="async"
                          width="200"
                          height="280"
                        />
                      </RelatedImage>
                      <RelatedTitle>{relatedAnime.title}</RelatedTitle>
                    </RelatedCard>
                  ))}
                </RelatedGrid>
              </RelatedContainer>
            )}

            <ReviewsContainer>
              <SectionTitle>评论</SectionTitle>
              {mergedReviews.length > 0 ? (
                mergedReviews.map((review) => (
                  <ReviewCard key={`${review.user}:${review.comment}`}>
                    <ReviewHeader>
                      <ReviewUser>
                        {review.user}
                        {review.isLocal ? '（本地）' : ''}
                      </ReviewUser>
                      <ReviewRating>
                        {review.rating ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <FiStar
                              key={i}
                              style={{
                                fill: i < review.rating ? 'var(--secondary-color)' : 'none',
                              }}
                            />
                          ))
                        ) : (
                          <span style={{ color: 'var(--text-tertiary)' }}>暂无评分</span>
                        )}
                      </ReviewRating>
                    </ReviewHeader>
                    <ReviewComment>{review.comment}</ReviewComment>
                  </ReviewCard>
                ))
              ) : (
                <EmptyState
                  title="还没有评论"
                  description="写下你的观感，让更多人找到好作品。"
                  primaryAction={{ to: '/rankings', label: '看看排行榜' }}
                  secondaryAction={{ to: '/recommendations', label: '看看推荐' }}
                />
              )}

              <CommentForm onSubmit={handleCommentSubmit}>
                <CommentRow>
                  <CommentInput
                    type="text"
                    name="user"
                    placeholder="昵称（可选）"
                    value={commentUser}
                    onChange={(event) => setCommentUser(event.target.value)}
                  />
                  <CommentSelect
                    name="rating"
                    value={commentRating}
                    onChange={(event) => setCommentRating(Number(event.target.value || 0))}
                  >
                    {[5, 4, 3, 2, 1, 0].map((score) => (
                      <option key={score} value={score}>
                        {score === 0 ? '暂无评分' : `${score} 星`}
                      </option>
                    ))}
                  </CommentSelect>
                </CommentRow>
                <CommentTextarea
                  name="comment"
                  placeholder="说说你的看法..."
                  value={commentDraft}
                  onChange={(event) => setCommentDraft(event.target.value)}
                />
                <CommentActions>
                  <CommentButton type="submit">发布评论</CommentButton>
                  <CommentButton type="button" onClick={handleClearComments}>
                    清空本地评论
                  </CommentButton>
                </CommentActions>
              </CommentForm>
            </ReviewsContainer>
          </AnimeInfo>
        </ContentContainer>
      </DetailInner>
    </DetailContainer>
  );
}

export default AnimeDetail;
