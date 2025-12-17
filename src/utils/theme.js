const STORAGE_KEY = 'guoman.theme';

export const THEMES = Object.freeze({
  dark: 'dark',
  light: 'light',
});

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
  return normalizeTheme(window.localStorage?.getItem(STORAGE_KEY));
};

export const getResolvedTheme = () => getStoredTheme() ?? getSystemTheme();

export const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;

  const normalized = normalizeTheme(theme) ?? THEMES.dark;
  document.documentElement.dataset.theme = normalized;

  // 同步浏览器 UI 颜色（移动端地址栏等）
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', normalized === THEMES.dark ? '#0D1117' : '#F7F8FA');
  }
};

export const setTheme = (theme) => {
  const normalized = normalizeTheme(theme);
  if (!normalized || typeof window === 'undefined') return;

  window.localStorage?.setItem(STORAGE_KEY, normalized);
  applyTheme(normalized);
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
};

