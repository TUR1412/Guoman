const prefetched = new Set();

const routes = {
  recommendations: () => import('../pages/RecommendationsPage'),
  rankings: () => import('../pages/RankingsPage'),
  news: () => import('../pages/NewsPage'),
  newsDetail: () => import('../pages/NewsDetailPage'),
  favorites: () => import('../pages/FavoritesPage'),
  following: () => import('../pages/FollowingPage'),
  pro: () => import('../pages/PricingPage'),
  insights: () => import('../pages/InsightsPage'),
  posters: () => import('../pages/PostersPage'),
  achievements: () => import('../pages/AchievementsPage'),
  about: () => import('../pages/AboutPage'),
  search: () => import('../pages/SearchPage'),
  tag: () => import('../pages/TagPage'),
  category: () => import('../pages/CategoryPage'),
  login: () => import('../components/Login'),
  forgot: () => import('../pages/ForgotPasswordPage'),
  animeDetail: () => import('../components/AnimeDetail'),
  staticPage: () => import('../pages/StaticPage'),
  notFound: () => import('../pages/NotFoundPage'),
  userCenter: () => import('../pages/UserCenterPage'),
};

const matchRouteKey = (path = '') => {
  if (!path) return null;
  const clean = String(path).split('#')[0].split('?')[0];
  if (clean === '/') return null;
  if (clean.startsWith('/recommendations')) return 'recommendations';
  if (clean.startsWith('/rankings')) return 'rankings';
  if (clean.startsWith('/news/')) return 'newsDetail';
  if (clean.startsWith('/news')) return 'news';
  if (clean.startsWith('/favorites')) return 'favorites';
  if (clean.startsWith('/following')) return 'following';
  if (clean === '/pro' || clean.startsWith('/pro/')) return 'pro';
  if (clean.startsWith('/insights')) return 'insights';
  if (clean.startsWith('/posters')) return 'posters';
  if (clean.startsWith('/achievements')) return 'achievements';
  if (clean.startsWith('/about')) return 'about';
  if (clean.startsWith('/search')) return 'search';
  if (clean.startsWith('/tag/')) return 'tag';
  if (clean.startsWith('/category/')) return 'category';
  if (clean.startsWith('/login')) return 'login';
  if (clean.startsWith('/forgot-password')) return 'forgot';
  if (clean.startsWith('/anime/')) return 'animeDetail';
  if (clean.startsWith('/help') || clean.startsWith('/faq') || clean.startsWith('/contact'))
    return 'staticPage';
  if (clean.startsWith('/feedback') || clean.startsWith('/app')) return 'staticPage';
  if (clean.startsWith('/terms') || clean.startsWith('/privacy') || clean.startsWith('/cookies'))
    return 'staticPage';
  if (clean.startsWith('/accessibility')) return 'staticPage';
  if (clean.startsWith('/profile')) return 'userCenter';
  return 'notFound';
};

export const prefetchRoute = (path) => {
  const key = matchRouteKey(path);
  if (!key) return;
  if (prefetched.has(key)) return;
  const importer = routes[key];
  if (!importer) return;
  prefetched.add(key);
  return importer().catch(() => {
    prefetched.delete(key);
  });
};

export const prefetchRoutes = (paths = []) => {
  paths.forEach((path) => prefetchRoute(path));
};
