import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Banner from '../components/Banner';
import AnimeList from '../components/AnimeList';
import { usePageMeta } from '../utils/pageMeta';
import { getPageMotion } from '../motion/presets';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';

const HomeQuickHub = lazy(() => import('../components/HomeQuickHub'));
const ContinueWatching = lazy(() => import('../components/ContinueWatching'));
const RecentlyViewed = lazy(() => import('../components/RecentlyViewed'));
const PinnedTagsSection = lazy(() => import('../components/PinnedTagsSection'));
const Features = lazy(() => import('../components/Features'));
const About = lazy(() => import('../components/About'));

function HomePage() {
  const reducedMotion = useAppReducedMotion();

  const pageMotion = getPageMotion(reducedMotion, { y: 10 });

  usePageMeta();

  return (
    <motion.div {...pageMotion} data-stagger layout>
      <Banner />
      <Suspense fallback={null}>
        <HomeQuickHub />
      </Suspense>
      <Suspense fallback={null}>
        <ContinueWatching />
      </Suspense>
      <Suspense fallback={null}>
        <RecentlyViewed />
      </Suspense>
      <Suspense fallback={null}>
        <PinnedTagsSection />
      </Suspense>
      <AnimeList />
      <Suspense fallback={null}>
        <Features />
      </Suspense>
      <Suspense fallback={null}>
        <About cta={{ to: '/about', label: '了解更多' }} />
      </Suspense>
    </motion.div>
  );
}

export default HomePage;
