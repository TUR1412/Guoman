// 观影计划器：汇总追更与观看进度，生成时间预算与优先队列。
import { getContinueWatchingList } from './watchProgress';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const estimateEpisodeMinutes = (anime) => {
  const episodes = toNumber(anime?.episodes, 0);
  const type = String(anime?.type || '');
  if (type.includes('电影')) return 95;
  if (episodes > 0 && episodes <= 6) return 38;
  if (episodes >= 40) return 20;
  return 24;
};

export const formatMinutes = (minutes) => {
  const total = Math.max(0, Math.round(toNumber(minutes, 0)));
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (hours <= 0) return `${mins}分钟`;
  return `${hours}小时${mins}分`;
};

export const buildWatchPlan = ({ animeList = [], dailyMinutes = 60 } = {}) => {
  const normalizedDaily = clamp(Math.round(toNumber(dailyMinutes, 60)), 15, 240);
  const progressEntries = getContinueWatchingList({ limit: 999 });
  const progressMap = new Map(progressEntries.map((entry) => [entry.id, entry]));

  const items = (animeList || [])
    .map((anime) => {
      if (!anime?.id) return null;
      const totalEpisodes = Math.max(0, toNumber(anime.episodes, 0));
      if (!totalEpisodes) return null;

      const progress = progressMap.get(anime.id) || { episode: 1, progress: 0 };
      const episodeIndex = Math.max(1, toNumber(progress.episode, 1));
      const episodeProgress = clamp(toNumber(progress.progress, 0) / 100, 0, 1);
      const completed = clamp(episodeIndex - 1 + episodeProgress, 0, totalEpisodes);
      const remainingEpisodes = Math.max(totalEpisodes - completed, 0);
      const minutesPerEpisode = estimateEpisodeMinutes(anime);
      const remainingMinutes = Math.round(remainingEpisodes * minutesPerEpisode);

      return {
        anime,
        totalEpisodes,
        completedEpisodes: completed,
        remainingEpisodes,
        minutesPerEpisode,
        remainingMinutes,
      };
    })
    .filter(Boolean);

  const totalMinutes = items.reduce((sum, item) => sum + item.remainingMinutes, 0);
  const totalEpisodes = items.reduce((sum, item) => sum + item.remainingEpisodes, 0);
  const daysNeeded = totalMinutes > 0 ? Math.ceil(totalMinutes / normalizedDaily) : 0;
  const finishDate = daysNeeded ? new Date(Date.now() + daysNeeded * 24 * 60 * 60 * 1000) : null;

  const priority = [...items].sort((a, b) => b.remainingMinutes - a.remainingMinutes).slice(0, 3);

  return {
    dailyMinutes: normalizedDaily,
    totalMinutes,
    totalEpisodes,
    daysNeeded,
    finishDate,
    items,
    priority,
  };
};
