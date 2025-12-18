import { beforeEach, describe, expect, it } from 'vitest';
import { applyTheme, THEMES, toggleTheme } from './theme';

describe('theme utils', () => {
  beforeEach(() => {
    document.documentElement.dataset.theme = '';
    document.head.innerHTML = '<meta name="theme-color" content="#0D1117" />';
    window.localStorage.clear();
  });

  it('applyTheme updates dataset + meta theme-color', () => {
    applyTheme(THEMES.light);

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe(
      '#F7F8FA',
    );
  });

  it('toggleTheme persists to localStorage', () => {
    applyTheme(THEMES.dark);

    const next = toggleTheme();
    expect(next).toBe(THEMES.light);
    expect(window.localStorage.getItem('guoman.theme')).toBe(THEMES.light);
  });
});
