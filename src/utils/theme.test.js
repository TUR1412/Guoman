import { beforeEach, describe, expect, it, vi } from 'vitest';

const loadTheme = async () => {
  vi.resetModules();
  vi.doMock('./analytics', () => ({ trackEvent: vi.fn() }));

  const theme = await import('./theme');
  const storageQueue = await import('./storageQueue');
  return { ...theme, flushStorageQueue: storageQueue.flushStorageQueue };
};

describe('theme utils', () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = '';
    document.head.innerHTML = '<meta name="theme-color" content="#0D1117" />';
    window.localStorage.clear();
  });

  it('applyTheme updates dataset + meta theme-color', async () => {
    const { applyTheme, THEMES } = await loadTheme();

    applyTheme(THEMES.light);
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe(
      '#F7F8FA',
    );
  });

  it('applyTheme no-ops without meta[name="theme-color"]', async () => {
    const { applyTheme, THEMES } = await loadTheme();
    document.head.innerHTML = '';

    applyTheme(THEMES.dark);
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('applyTheme is safe when document is missing', async () => {
    const { applyTheme, THEMES } = await loadTheme();
    vi.stubGlobal('document', undefined);
    expect(() => applyTheme(THEMES.dark)).not.toThrow();
    vi.unstubAllGlobals();
  });

  it('getSystemTheme respects matchMedia', async () => {
    const { getSystemTheme, THEMES } = await loadTheme();

    const original = window.matchMedia;
    window.matchMedia = () => ({ matches: true });
    expect(getSystemTheme()).toBe(THEMES.dark);

    window.matchMedia = () => ({ matches: false });
    expect(getSystemTheme()).toBe(THEMES.light);

    window.matchMedia = original;
  });

  it('getSystemTheme defaults to dark without window', async () => {
    const { getSystemTheme, THEMES } = await loadTheme();
    vi.stubGlobal('window', undefined);
    expect(getSystemTheme()).toBe(THEMES.dark);
    vi.unstubAllGlobals();
  });

  it('setTheme persists + applies theme', async () => {
    const { flushStorageQueue, setTheme, THEMES } = await loadTheme();

    setTheme(THEMES.light);
    flushStorageQueue();
    expect(window.localStorage.getItem('guoman.theme')).toBe(THEMES.light);
    expect(document.documentElement.dataset.theme).toBe(THEMES.light);
  });

  it('setTheme ignores invalid theme', async () => {
    const { flushStorageQueue, setTheme } = await loadTheme();

    setTheme('bad');
    flushStorageQueue();
    expect(window.localStorage.getItem('guoman.theme')).toBeNull();
  });

  it('toggleTheme returns next value and persists', async () => {
    const { applyTheme, flushStorageQueue, THEMES, toggleTheme } = await loadTheme();
    applyTheme(THEMES.dark);

    const next = toggleTheme();
    flushStorageQueue();
    expect(next).toBe(THEMES.light);
    expect(window.localStorage.getItem('guoman.theme')).toBe(THEMES.light);
  });

  it('initTheme uses stored theme when dataset is empty', async () => {
    const { initTheme } = await loadTheme();
    window.localStorage.setItem('guoman.theme', 'light');

    initTheme();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('getStoredTheme returns null for invalid stored values', async () => {
    const { getStoredTheme } = await loadTheme();
    window.localStorage.setItem('guoman.theme', 'invalid');
    expect(getStoredTheme()).toBeNull();
  });

  it('initTheme respects already-applied dataset theme', async () => {
    const { initTheme } = await loadTheme();
    document.documentElement.dataset.theme = 'light';
    window.localStorage.setItem('guoman.theme', 'dark');

    initTheme();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('covers remaining guard branches (window/document missing + invalid theme)', async () => {
    const { applyTheme, getCurrentTheme, getStoredTheme, initTheme, THEMES, toggleTheme } =
      await loadTheme();

    vi.stubGlobal('window', undefined);
    expect(getStoredTheme()).toBeNull();
    expect(() => initTheme()).not.toThrow();
    vi.unstubAllGlobals();

    // invalid theme falls back to dark
    applyTheme('bad');
    expect(document.documentElement.dataset.theme).toBe(THEMES.dark);

    // toggle from light -> dark (covers the other branch)
    applyTheme(THEMES.light);
    expect(toggleTheme()).toBe(THEMES.dark);

    vi.stubGlobal('document', undefined);
    expect(getCurrentTheme()).toBe(THEMES.dark);
    vi.unstubAllGlobals();
  });
});
