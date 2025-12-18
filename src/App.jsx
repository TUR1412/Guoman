import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { FavoritesProvider } from './components/FavoritesProvider';
import { ToastProvider } from './components/ToastProvider';
import { safeSessionStorageGet, safeSessionStorageSet } from './utils/storage';

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
const StaticPage = lazy(() => import('./pages/StaticPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const Login = lazy(() => import('./components/Login'));
const AnimeDetail = lazy(() => import('./components/AnimeDetail'));

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
  text-shadow: 0 0 10px rgba(255, 77, 77, 0.35);
`;

const RouteFallback = styled.div`
  min-height: calc(100vh - var(--header-height));
  display: grid;
  place-items: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  color: var(--text-secondary);
`;

const INTRO_KEY = 'guoman.introSeen';

function App() {
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !safeSessionStorageGet(INTRO_KEY);
  });
  const location = useLocation();

  useEffect(() => {
    if (!loading) return undefined;

    // 首次进入展示品牌开屏（短、可跳过、仅一次）
    const timer = setTimeout(() => {
      setLoading(false);
      safeSessionStorageSet(INTRO_KEY, '1');
    }, 900);

    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <MotionConfig reducedMotion="user">
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
                  <LoadingLogo
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    国漫世界
                  </LoadingLogo>
                </LoadingScreen>
              )}
            </AnimatePresence>

            <Header />
            <ScrollToTop />

            <MainContent id="main" tabIndex={-1}>
              <Suspense fallback={<RouteFallback>加载中...</RouteFallback>}>
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/recommendations" element={<RecommendationsPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
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

                    <Route path="/help" element={<StaticPage page="help" />} />
                    <Route path="/faq" element={<StaticPage page="faq" />} />
                    <Route path="/contact" element={<StaticPage page="contact" />} />
                    <Route path="/feedback" element={<StaticPage page="feedback" />} />
                    <Route path="/app" element={<StaticPage page="app" />} />

                    <Route path="/terms" element={<StaticPage page="terms" />} />
                    <Route path="/privacy" element={<StaticPage page="privacy" />} />
                    <Route path="/cookies" element={<StaticPage page="cookies" />} />
                    <Route path="/accessibility" element={<StaticPage page="accessibility" />} />

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AnimatePresence>
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
