const prefetched = new Set();

const routes = {
  recommendations: () => import('../pages/RecommendationsPage'),
  rankings: () => import('../pages/RankingsPage'),
  news: () => import('../pages/NewsPage'),
  newsDetail: () => import('../pages/NewsDetailPage'),
  favorites: () => import('../pages/FavoritesPage'),
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
  if (path === '/') return null;
  if (path.startsWith('/recommendations')) return 'recommendations';
  if (path.startsWith('/rankings')) return 'rankings';
  if (path.startsWith('/news/')) return 'newsDetail';
  if (path.startsWith('/news')) return 'news';
  if (path.startsWith('/favorites')) return 'favorites';
  if (path.startsWith('/about')) return 'about';
  if (path.startsWith('/search')) return 'search';
  if (path.startsWith('/tag/')) return 'tag';
  if (path.startsWith('/category/')) return 'category';
  if (path.startsWith('/login')) return 'login';
  if (path.startsWith('/forgot-password')) return 'forgot';
  if (path.startsWith('/anime/')) return 'animeDetail';
  if (path.startsWith('/help') || path.startsWith('/faq') || path.startsWith('/contact'))
    return 'staticPage';
  if (path.startsWith('/feedback') || path.startsWith('/app')) return 'staticPage';
  if (path.startsWith('/terms') || path.startsWith('/privacy') || path.startsWith('/cookies'))
    return 'staticPage';
  if (path.startsWith('/accessibility')) return 'staticPage';
  if (path.startsWith('/profile')) return 'userCenter';
  return 'notFound';
};

export const prefetchRoute = (path) => {
  const key = matchRouteKey(path);
  if (!key) return;
  if (prefetched.has(key)) return;
  const importer = routes[key];
  if (!importer) return;
  prefetched.add(key);
  importer().catch(() => {
    prefetched.delete(key);
  });
};

export const prefetchRoutes = (paths = []) => {
  paths.forEach((path) => prefetchRoute(path));
};
