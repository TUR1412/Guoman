// 视觉设置（Visual Settings）：将用户可调的“墨韵参数”持久化到本地，并映射为全局 CSS Variables / dataset。
// 该模块仅影响展示层，不涉及任何远程同步或敏感信息。

import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';
import { safeJsonParse } from './json';
import { trackEvent } from './analytics';

const STORAGE_KEY = STORAGE_KEYS.visualSettings;
export const VISUAL_SETTINGS_EVENT = 'guoman:visual-settings';

export const VISUAL_SETTINGS_DEFAULTS = Object.freeze({
  schemaVersion: 1,
  updatedAt: 0,
  paperNoiseOpacity: 0.08,
  auroraOpacity: 0.9,
  fontScale: 1,
  disableBlur: false,
  forceReducedMotion: false,
});

const clampNumber = (value, { min, max, fallback }) => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return fallback;
  if (num < min) return min;
  if (num > max) return max;
  return num;
};

const normalizeVisualSettings = (raw) => {
  if (!raw || typeof raw !== 'object') return VISUAL_SETTINGS_DEFAULTS;

  return {
    ...VISUAL_SETTINGS_DEFAULTS,
    schemaVersion: 1,
    updatedAt: clampNumber(raw.updatedAt, {
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      fallback: 0,
    }),
    paperNoiseOpacity: clampNumber(raw.paperNoiseOpacity, {
      min: 0,
      max: 0.14,
      fallback: VISUAL_SETTINGS_DEFAULTS.paperNoiseOpacity,
    }),
    auroraOpacity: clampNumber(raw.auroraOpacity, {
      min: 0,
      max: 1,
      fallback: VISUAL_SETTINGS_DEFAULTS.auroraOpacity,
    }),
    fontScale: clampNumber(raw.fontScale, {
      min: 0.85,
      max: 1.25,
      fallback: VISUAL_SETTINGS_DEFAULTS.fontScale,
    }),
    disableBlur: Boolean(raw.disableBlur),
    forceReducedMotion: Boolean(raw.forceReducedMotion),
  };
};

export const getStoredVisualSettings = () => {
  if (typeof window === 'undefined') return VISUAL_SETTINGS_DEFAULTS;
  const raw = safeLocalStorageGet(STORAGE_KEY);
  const parsed = safeJsonParse(raw, null);
  return normalizeVisualSettings(parsed);
};

export const applyVisualSettings = (settings) => {
  if (typeof document === 'undefined') return;
  const normalized = normalizeVisualSettings(settings);
  const root = document.documentElement;

  // CSS Variables：用于全局背景/噪点/字号策略（尽量避免触发 React 重渲染）
  try {
    root.style.setProperty('--paper-noise-opacity', String(normalized.paperNoiseOpacity));
    root.style.setProperty('--aurora-opacity', String(normalized.auroraOpacity));
    root.style.setProperty('--font-scale', String(normalized.fontScale));
  } catch {}

  // dataset：用于全局策略开关（CSS 与 MotionConfig 均可读取）
  if (normalized.disableBlur) {
    root.dataset.noBlur = 'true';
  } else {
    delete root.dataset.noBlur;
  }

  if (normalized.forceReducedMotion) {
    root.dataset.reducedMotion = 'true';
  } else {
    delete root.dataset.reducedMotion;
  }
};

export const setVisualSettings = (nextOrPatch, { replace = false, silent = false } = {}) => {
  if (typeof window === 'undefined') return VISUAL_SETTINGS_DEFAULTS;

  const current = getStoredVisualSettings();
  const patch = nextOrPatch && typeof nextOrPatch === 'object' ? nextOrPatch : {};
  const base = replace ? VISUAL_SETTINGS_DEFAULTS : current;
  const next = normalizeVisualSettings({ ...base, ...patch, updatedAt: Date.now() });

  scheduleStorageWrite(STORAGE_KEY, JSON.stringify(next));
  applyVisualSettings(next);

  try {
    window.dispatchEvent(new CustomEvent(VISUAL_SETTINGS_EVENT, { detail: { settings: next } }));
  } catch {}

  if (!silent) {
    trackEvent('visual.settings.update', {
      disableBlur: next.disableBlur,
      forceReducedMotion: next.forceReducedMotion,
      paperNoiseOpacity: next.paperNoiseOpacity,
      auroraOpacity: next.auroraOpacity,
      fontScale: next.fontScale,
    });
  }

  return next;
};

export const resetVisualSettings = () => setVisualSettings({}, { replace: true });

export const initVisualSettings = () => {
  if (typeof window === 'undefined') return;
  applyVisualSettings(getStoredVisualSettings());
};
