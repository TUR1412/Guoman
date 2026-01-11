// 主题切换与首帧主题色同步。
import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';
import { trackEvent } from './analytics';

const STORAGE_KEY = STORAGE_KEYS.theme;
const META_KEY = STORAGE_KEYS.themeMeta;

export const THEMES = Object.freeze({
  dark: 'dark',
  light: 'light',
});

let didBindSystemThemeListener = false;

const normalizeTheme = (value) => {
  if (value === THEMES.dark || value === THEMES.light) return value;
  return null;
};

export const getSystemTheme = () => {
  if (typeof window === 'undefined') return THEMES.dark;
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  return prefersDark ? THEMES.dark : THEMES.light;
};

export const getStoredTheme = () => {
  if (typeof window === 'undefined') return null;
  return normalizeTheme(safeLocalStorageGet(STORAGE_KEY));
};

export const getResolvedTheme = () => getStoredTheme() ?? getSystemTheme();

export const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;

  const normalized = normalizeTheme(theme) ?? THEMES.dark;
  document.documentElement.dataset.theme = normalized;

  // 同步浏览器 UI 颜色（移动端地址栏等）
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    // 与 index.html 的首帧主题色保持一致（避免切换时闪烁/色差）
    metaThemeColor.setAttribute('content', normalized === THEMES.dark ? '#05070D' : '#F5F7FB');
  }
};

export const setTheme = (theme) => {
  const normalized = normalizeTheme(theme);
  if (!normalized || typeof window === 'undefined') return;

  scheduleStorageWrite(STORAGE_KEY, normalized);
  scheduleStorageWrite(META_KEY, JSON.stringify({ value: normalized, updatedAt: Date.now() }));
  applyTheme(normalized);
  trackEvent('theme.change', { value: normalized });
};

export const getCurrentTheme = () => {
  if (typeof document === 'undefined') return THEMES.dark;
  return normalizeTheme(document.documentElement.dataset.theme) ?? getResolvedTheme();
};

export const toggleTheme = () => {
  const current = getCurrentTheme();
  const next = current === THEMES.dark ? THEMES.light : THEMES.dark;
  setTheme(next);
  return next;
};

export const initTheme = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const already = normalizeTheme(document.documentElement.dataset.theme);
  applyTheme(already ?? getResolvedTheme());

  // 环境自适应：当用户未显式选择主题时，跟随系统主题变化
  if (didBindSystemThemeListener) return;
  const media = window.matchMedia?.('(prefers-color-scheme: dark)');
  if (!media) return;

  const onChange = () => {
    if (getStoredTheme() != null) return;
    applyTheme(getSystemTheme());
  };

  try {
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange);
      didBindSystemThemeListener = true;
      return;
    }
  } catch {}

  // Safari 旧实现
  try {
    if (typeof media.addListener === 'function') {
      media.addListener(onChange);
      didBindSystemThemeListener = true;
    }
  } catch {}
};
