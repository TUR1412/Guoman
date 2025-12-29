import { describe, expect, it, vi } from 'vitest';

describe('routePrefetch', () => {
  it('prefetchRoute ignores empty and root paths', async () => {
    vi.resetModules();
    const { prefetchRoute } = await import('./routePrefetch');
    expect(prefetchRoute('')).toBeUndefined();
    expect(prefetchRoute('/')).toBeUndefined();
  });

  it('prefetchRoute maps paths to modules and de-dupes per route key', async () => {
    vi.resetModules();

    const loads = new Map();
    const mockModule = (path) => {
      vi.doMock(path, () => {
        loads.set(path, (loads.get(path) || 0) + 1);
        return { default: () => null };
      });
    };

    [
      '../pages/RecommendationsPage',
      '../pages/RankingsPage',
      '../pages/NewsPage',
      '../pages/NewsDetailPage',
      '../pages/FavoritesPage',
      '../pages/FollowingPage',
      '../pages/PricingPage',
      '../pages/InsightsPage',
      '../pages/PostersPage',
      '../pages/AchievementsPage',
      '../pages/AboutPage',
      '../pages/SearchPage',
      '../pages/TagPage',
      '../pages/CategoryPage',
      '../components/Login',
      '../pages/ForgotPasswordPage',
      '../components/AnimeDetail',
      '../pages/StaticPage',
      '../pages/NotFoundPage',
      '../pages/UserCenterPage',
      '../pages/DiagnosticsPage',
    ].forEach(mockModule);

    const { prefetchRoute, prefetchRoutes } = await import('./routePrefetch');

    await prefetchRoute('/recommendations');
    await prefetchRoute('/rankings');
    await prefetchRoute('/news');
    await prefetchRoute('/news/123');
    await prefetchRoute('/favorites');
    await prefetchRoute('/following');
    await prefetchRoute('/pro');
    await prefetchRoute('/insights');
    await prefetchRoute('/posters');
    await prefetchRoute('/achievements');
    await prefetchRoute('/about');
    await prefetchRoute('/search');
    await prefetchRoute('/tag/%E7%83%AD%E8%A1%80');
    await prefetchRoute('/category/action');
    await prefetchRoute('/login');
    await prefetchRoute('/forgot-password');
    await prefetchRoute('/anime/1');
    await prefetchRoute('/help');
    await prefetchRoute('/profile');
    await prefetchRoute('/diagnostics');
    await prefetchRoute('/some-unknown');

    // De-dupe (same route key should not re-import)
    await prefetchRoute('/favorites');
    await prefetchRoute('/favorites?x=1');

    prefetchRoutes(['/about', '/about', '/news/999']);

    expect(loads.get('../pages/FavoritesPage')).toBe(1);
    expect(loads.get('../pages/AboutPage')).toBe(1);
    expect(loads.get('../pages/NewsDetailPage')).toBe(1);
    expect(loads.get('../pages/NotFoundPage')).toBe(1);
    expect(loads.get('../pages/StaticPage')).toBe(1);
    expect(loads.get('../pages/UserCenterPage')).toBe(1);
    expect(loads.get('../pages/DiagnosticsPage')).toBe(1);
  });
});
