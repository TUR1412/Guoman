import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  useReducedMotion,
} from 'framer-motion';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import NetworkStatusBanner from './components/NetworkStatusBanner';
import PathLoader from './components/PathLoader';
import { FavoritesProvider } from './components/FavoritesProvider';
import { ToastProvider } from './components/ToastProvider';
import { safeSessionStorageGet, safeSessionStorageSet } from './utils/storage';
import { prefetchRoutes } from './utils/routePrefetch';
import { trackEvent } from './utils/analytics';
import { useIsProEnabled } from './utils/useProMembership';
import {
  applyVisualSettings,
  getStoredVisualSettings,
  VISUAL_SETTINGS_EVENT,
} from './utils/visualSettings';
import { useStorageSignal } from './utils/useStorageSignal';
import { STORAGE_KEYS } from './utils/dataKeys';

// 页面
import HomePage from './pages/HomePage';
const RecommendationsPage = lazy(() => import('./pages/RecommendationsPage'));
const RankingsPage = lazy(() => import('./pages/RankingsPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const TagPage = lazy(() => import('./pages/TagPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const FollowingPage = lazy(() => import('./pages/FollowingPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const PostersPage = lazy(() => import('./pages/PostersPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const StaticPage = lazy(() => import('./pages/StaticPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const Login = lazy(() => import('./components/Login'));
const AnimeDetail = lazy(() => import('./components/AnimeDetail'));
const UserCenterPage = lazy(() => import('./pages/UserCenterPage'));

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: var(--text-primary);
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: var(--header-height);
`;

const LoadingScreen = styled(motion.button)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--dark-color);
  z-index: 1000;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const LoadingLogo = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
  font-family: 'Noto Sans SC', sans-serif;
  text-shadow: var(--text-glow-primary);
`;

const LoadingStack = styled.div`
  display: grid;
  place-items: center;
  gap: var(--spacing-md);
  text-align: center;
`;

const LoadingHint = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const RouteFallback = styled(motion.div)`
  min-height: calc(100vh - var(--header-height));
  display: grid;
  place-items: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  color: var(--text-secondary);
`;

const RouteFallbackStack = styled.div`
  display: grid;
  place-items: center;
  gap: var(--spacing-md);
  text-align: center;
`;

const RouteCurtain = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 5000;
  pointer-events: none;
  background:
    radial-gradient(900px 380px at 12% 0%, rgba(var(--primary-rgb), 0.22), transparent 60%),
    radial-gradient(900px 420px at 88% 100%, rgba(var(--secondary-rgb), 0.18), transparent 65%),
    linear-gradient(120deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.45) 50%, rgba(0, 0, 0, 0) 100%);
  mix-blend-mode: screen;
  will-change: transform, opacity;
`;

const INTRO_KEY = 'guoman.introSeen';

function App() {
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !safeSessionStorageGet(INTRO_KEY);
  });
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const proEnabled = useIsProEnabled();
  const { signal: visualSignal } = useStorageSignal([STORAGE_KEYS.visualSettings]);
  const [visualSettings, setVisualSettings] = useState(() => getStoredVisualSettings());

  useEffect(() => {
    const next = getStoredVisualSettings();
    setVisualSettings(next);
    applyVisualSettings(next);
  }, [visualSignal]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const onUpdate = (event) => {
      const next = event?.detail?.settings;
      if (!next) return;
      setVisualSettings(next);
      applyVisualSettings(next);
    };

    window.addEventListener(VISUAL_SETTINGS_EVENT, onUpdate);
    return () => window.removeEventListener(VISUAL_SETTINGS_EVENT, onUpdate);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.pro = proEnabled ? 'true' : 'false';
  }, [proEnabled]);

  useEffect(() => {
    if (!loading) return undefined;

    // 首次进入展示品牌开屏（短、可跳过、仅一次）
    const timer = setTimeout(() => {
      setLoading(false);
      safeSessionStorageSet(INTRO_KEY, '1');
    }, 900);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection?.saveData) return undefined;
    if (connection?.effectiveType && ['slow-2g', '2g'].includes(connection.effectiveType)) {
      return undefined;
    }

    const prefetch = () => {
      prefetchRoutes([
        '/recommendations',
        '/rankings',
        '/news',
        '/favorites',
        '/following',
        '/pro',
        '/search',
        '/about',
        '/login',
        '/profile',
        '/insights',
        '/posters',
        '/achievements',
      ]);
    };

    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(prefetch, { timeout: 2000 });
      return () => window.cancelIdleCallback?.(handle);
    }

    const timeoutId = window.setTimeout(prefetch, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    trackEvent('page.view', { path: location.pathname });
  }, [location.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let rafId = null;
    const update = () => {
      rafId = null;
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY || 0}px`);
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const markLoaded = (img) => {
      if (!img || img.dataset.loaded === 'true') return;
      img.dataset.loaded = 'true';
    };

    const onLoad = (event) => {
      const target = event.target;
      if (target && target.tagName === 'IMG') {
        markLoaded(target);
      }
    };

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (img.complete) {
        markLoaded(img);
      }
    });

    document.addEventListener('load', onLoad, true);
    return () => document.removeEventListener('load', onLoad, true);
  }, []);

  return (
    <MotionConfig reducedMotion={visualSettings.forceReducedMotion ? 'always' : 'user'}>
      <ToastProvider>
        <FavoritesProvider>
          <AppContainer>
            <a
              className="skip-link"
              href="#main"
              aria-hidden={loading}
              tabIndex={loading ? -1 : 0}
              onClick={(e) => {
                e.preventDefault();
                const main = document.getElementById('main');
                if (!main) return;

                try {
                  main.focus({ preventScroll: true });
                } catch {
                  main.focus();
                }
              }}
            >
              跳到主要内容
            </a>

            <AnimatePresence>
              {loading && (
                <LoadingScreen
                  type="button"
                  aria-label="跳过开屏"
                  title="点击跳过开屏"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => {
                    setLoading(false);
                    safeSessionStorageSet(INTRO_KEY, '1');
                  }}
                >
                  <LoadingStack>
                    <LoadingLogo
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      国漫世界
                    </LoadingLogo>
                    <PathLoader size={74} label="开屏加载中…" showLabel={false} />
                    <LoadingHint aria-hidden="true">点击任意位置跳过</LoadingHint>
                  </LoadingStack>
                </LoadingScreen>
              )}
            </AnimatePresence>

            <Header />
            <NetworkStatusBanner />
            <ScrollToTop />

            <MainContent id="main" tabIndex={-1} role="main">
              <Suspense
                fallback={
                  <RouteFallback
                    data-skeleton
                    role="status"
                    aria-live="polite"
                    initial={{ opacity: 0.6, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <RouteFallbackStack>
                      <PathLoader size={62} label="正在加载页面…" showLabel={false} />
                      <div aria-hidden="true">正在加载页面...</div>
                    </RouteFallbackStack>
                  </RouteFallback>
                }
              >
                <LayoutGroup id="guoman-routes">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={location.pathname}
                      initial={
                        reducedMotion
                          ? { opacity: 1, y: 0, scale: 1 }
                          : { opacity: 0, y: 14, scale: 0.985 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={
                        reducedMotion
                          ? { opacity: 1, y: 0, scale: 1 }
                          : { opacity: 0, y: -12, scale: 0.985 }
                      }
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 420, damping: 42, mass: 0.8 }
                      }
                    >
                      <Routes location={location}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/recommendations" element={<RecommendationsPage />} />
                        <Route path="/favorites" element={<FavoritesPage />} />
                        <Route path="/following" element={<FollowingPage />} />
                        <Route path="/pro" element={<PricingPage />} />
                        <Route path="/insights" element={<InsightsPage />} />
                        <Route path="/posters" element={<PostersPage />} />
                        <Route path="/achievements" element={<AchievementsPage />} />
                        <Route path="/rankings" element={<RankingsPage />} />
                        <Route path="/news" element={<NewsPage />} />
                        <Route path="/news/:id" element={<NewsDetailPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/tag/:tag" element={<TagPage />} />
                        <Route path="/category/:category" element={<CategoryPage />} />

                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/anime/:id" element={<AnimeDetail />} />
                        <Route path="/profile" element={<UserCenterPage />} />

                        <Route path="/help" element={<StaticPage page="help" />} />
                        <Route path="/faq" element={<StaticPage page="faq" />} />
                        <Route path="/contact" element={<StaticPage page="contact" />} />
                        <Route path="/feedback" element={<StaticPage page="feedback" />} />
                        <Route path="/app" element={<StaticPage page="app" />} />

                        <Route path="/terms" element={<StaticPage page="terms" />} />
                        <Route path="/privacy" element={<StaticPage page="privacy" />} />
                        <Route path="/cookies" element={<StaticPage page="cookies" />} />
                        <Route
                          path="/accessibility"
                          element={<StaticPage page="accessibility" />}
                        />

                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </motion.div>
                  </AnimatePresence>
                </LayoutGroup>

                {!loading && !reducedMotion ? (
                  <RouteCurtain
                    key={`curtain:${location.pathname}`}
                    initial={{ opacity: 0, y: -18, scale: 1.02 }}
                    animate={{ opacity: [0, 0.9, 0], y: [-18, 0, 18], scale: [1.02, 1, 0.99] }}
                    transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1], times: [0, 0.45, 1] }}
                    aria-hidden="true"
                  />
                ) : null}
              </Suspense>
            </MainContent>

            <Footer />
          </AppContainer>
        </FavoritesProvider>
      </ToastProvider>
    </MotionConfig>
  );
}

export default App;
