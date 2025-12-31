import React from 'react';
import { TextField } from '../../../ui';
import {
  ProgressActions,
  ProgressCard,
  ProgressLabel,
  ProgressMeta,
  ProgressRange,
  ProgressRow,
  ProgressTitle,
  SecondaryButton,
} from './styles';

export function AnimeProgressCard({
  animeEpisodes,
  episodeInputId,
  progressMetaId,
  progressRangeId,
  safeProgress,
  onUpdate,
  onClear,
}) {
  return (
    <ProgressCard>
      <ProgressTitle>观看进度</ProgressTitle>
      <ProgressRow>
        <ProgressLabel as="label" htmlFor={episodeInputId}>
          当前集数
        </ProgressLabel>
        <TextField
          id={episodeInputId}
          type="number"
          min={1}
          max={animeEpisodes}
          value={safeProgress.episode}
          onChange={(event) =>
            onUpdate({
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
              onUpdate({
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
            onUpdate({
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
            onUpdate({
              episode: animeEpisodes,
              progress: 100,
            })
          }
        >
          追到最新
        </SecondaryButton>
        <SecondaryButton type="button" onClick={onClear}>
          清空进度
        </SecondaryButton>
      </ProgressActions>
    </ProgressCard>
  );
}

export default AnimeProgressCard;
