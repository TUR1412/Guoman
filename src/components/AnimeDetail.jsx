// 详情页：展示作品信息、互动操作与口碑脉冲概览。
import React, { useId, useMemo, useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
} from './icons/feather';
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
import { useAppReducedMotion } from '../motion/useAppReducedMotion';
import AnimeProgressCard from './anime/detail/AnimeProgressCard';
import AnimeReviews from './anime/detail/AnimeReviews';
import AudiencePulse from './anime/detail/AudiencePulse';
import {
  clearWatchProgress,
  getWatchProgress,
  subscribeWatchProgressById,
  updateWatchProgress,
} from '../utils/watchProgress';
import { buildAudiencePulse } from '../utils/contentInsights';
import {
  DetailContainer,
  DetailInner,
  BannerContainer,
  BannerImage,
  ContentContainer,
  CoverContainer,
  CoverImage,
  AnimeInfo,
  AnimeTitle,
  AnimeOriginalTitle,
  MetaInfo,
  MetaItem,
  MetaLabel,
  MetaValue,
  AnimeDescription,
  ActionButtons,
  WatchButton,
  SecondaryButton,
  TagsContainer,
  TagsTitle,
  Tags,
  Tag,
  StaffContainer,
  CharactersContainer,
  SectionTitle,
  StaffGrid,
  StaffCard,
  StaffRole,
  StaffName,
  CharactersGrid,
  CharacterCard,
  CharacterAvatar,
  CharacterInfo,
  CharacterName,
  CharacterDetails,
  RelatedContainer,
  RelatedGrid,
  RelatedCard,
  RelatedImage,
  RelatedTitle,
} from './anime/detail/styles';

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
  const reducedMotion = useAppReducedMotion();
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

  const audiencePulse = useMemo(() => buildAudiencePulse(anime), [anime]);

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

            <AnimeProgressCard
              animeEpisodes={anime.episodes}
              episodeInputId={episodeInputId}
              progressMetaId={progressMetaId}
              progressRangeId={progressRangeId}
              safeProgress={safeProgress}
              onUpdate={handleProgressUpdate}
              onClear={handleClearProgress}
            />

            <AudiencePulse pulse={audiencePulse} />

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
                      <RelatedTitle title={relatedAnime.title}>{relatedAnime.title}</RelatedTitle>
                    </RelatedCard>
                  ))}
                </RelatedGrid>
              </RelatedContainer>
            )}

            <AnimeReviews
              mergedReviews={mergedReviews}
              commentUser={commentUser}
              commentRating={commentRating}
              commentDraft={commentDraft}
              onCommentUserChange={setCommentUser}
              onCommentRatingChange={setCommentRating}
              onCommentDraftChange={setCommentDraft}
              onSubmit={handleCommentSubmit}
              onClearComments={handleClearComments}
            />
          </AnimeInfo>
        </ContentContainer>
      </DetailInner>
    </DetailContainer>
  );
}

export default AnimeDetail;
