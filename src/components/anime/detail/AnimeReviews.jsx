import React from 'react';
import { FiStar } from '../../icons/feather';
import EmptyState from '../../EmptyState';
import { TextField } from '../../../ui';
import {
  CommentActions,
  CommentButton,
  CommentForm,
  CommentRow,
  CommentSelect,
  CommentTextarea,
  ReviewCard,
  ReviewComment,
  ReviewHeader,
  ReviewRating,
  ReviewsContainer,
  ReviewUser,
  SectionTitle,
} from './styles';

function StarRating({ value }) {
  if (!value) {
    return <span style={{ color: 'var(--text-tertiary)' }}>暂无评分</span>;
  }

  return Array.from({ length: 5 }).map((_, i) => (
    <FiStar
      key={i}
      style={{
        fill: i < value ? 'var(--secondary-color)' : 'none',
      }}
    />
  ));
}

export function AnimeReviews({
  mergedReviews,
  commentUser,
  commentRating,
  commentDraft,
  onCommentUserChange,
  onCommentRatingChange,
  onCommentDraftChange,
  onSubmit,
  onClearComments,
}) {
  return (
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
                <StarRating value={review.rating} />
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

      <CommentForm onSubmit={onSubmit}>
        <CommentRow>
          <TextField
            type="text"
            name="user"
            placeholder="昵称（可选）"
            value={commentUser}
            onChange={(event) => onCommentUserChange(event.target.value)}
            style={{ flex: 1, minWidth: 180 }}
          />
          <CommentSelect
            name="rating"
            value={commentRating}
            onChange={(event) => onCommentRatingChange(Number(event.target.value || 0))}
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
          onChange={(event) => onCommentDraftChange(event.target.value)}
        />
        <CommentActions>
          <CommentButton type="submit">发布评论</CommentButton>
          <CommentButton type="button" onClick={onClearComments}>
            清空本地评论
          </CommentButton>
        </CommentActions>
      </CommentForm>
    </ReviewsContainer>
  );
}

export default AnimeReviews;
