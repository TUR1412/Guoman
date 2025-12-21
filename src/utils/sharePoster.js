import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';

const STORAGE_KEY = STORAGE_KEYS.sharePoster;

const readStore = () => {
  const raw = hasPendingStorageWrite(STORAGE_KEY)
    ? getPendingStorageWriteValue(STORAGE_KEY)
    : safeLocalStorageGet(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStore = (list) => {
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify(list));
};

export const recordSharePoster = ({ title, subtitle }) => {
  const list = readStore();
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    title,
    subtitle,
    createdAt: Date.now(),
  };
  writeStore([entry, ...list].slice(0, 20));
  return entry;
};

export const getSharePosters = () => readStore();

export const clearSharePosters = () => {
  writeStore([]);
  return [];
};

export const buildPosterSvg = ({ title, subtitle, rating }) => {
  const safeTitle = String(title || '').slice(0, 18);
  const safeSubtitle = String(subtitle || '').slice(0, 28);
  const safeRating = rating ? `评分 ${rating}` : '国漫世界';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1440" viewBox="0 0 1080 1440" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B0F14"/>
      <stop offset="100%" stop-color="#1A232E"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#E85445"/>
      <stop offset="100%" stop-color="#CAA45A"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1440" fill="url(#bg)"/>
  <circle cx="180" cy="200" r="180" fill="rgba(232,84,69,0.22)"/>
  <circle cx="940" cy="120" r="120" fill="rgba(202,164,90,0.18)"/>
  <circle cx="820" cy="1200" r="240" fill="rgba(31,143,122,0.18)"/>
  <text x="120" y="220" font-size="42" fill="#F4F2EE" font-family="Noto Sans SC, sans-serif">国漫世界</text>
  <text x="120" y="520" font-size="86" fill="#F4F2EE" font-family="ZCOOL XiaoWei, serif">${safeTitle}</text>
  <text x="120" y="620" font-size="36" fill="#D5D0C7" font-family="Noto Sans SC, sans-serif">${safeSubtitle}</text>
  <rect x="120" y="700" width="360" height="64" rx="32" fill="url(#accent)"/>
  <text x="160" y="742" font-size="28" fill="#FFFFFF" font-family="Noto Sans SC, sans-serif">${safeRating}</text>
  <text x="120" y="1240" font-size="28" fill="#B1A79C" font-family="Noto Sans SC, sans-serif">扫码访问：tur1412.github.io/Guoman</text>
  <text x="120" y="1300" font-size="24" fill="#B1A79C" font-family="Noto Sans SC, sans-serif">分享你的国漫推荐</text>
</svg>`;
};

export const SHARE_POSTER_STORAGE_KEY = STORAGE_KEY;
