import React from 'react';
import { motion } from 'framer-motion';
import Banner from '../components/Banner';
import AnimeList from '../components/AnimeList';
import Features from '../components/Features';
import About from '../components/About';
import RecentlyViewed from '../components/RecentlyViewed';
import ContinueWatching from '../components/ContinueWatching';
import { usePageMeta } from '../utils/pageMeta';
import { getPageMotion } from '../motion/presets';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';

function HomePage() {
  const reducedMotion = useAppReducedMotion();

  const pageMotion = getPageMotion(reducedMotion, { y: 10 });

  usePageMeta();

  return (
    <motion.div {...pageMotion} data-stagger layout>
      <Banner />
      <ContinueWatching />
      <RecentlyViewed />
      <AnimeList />
      <Features />
      <About cta={{ to: '/about', label: '了解更多' }} />
    </motion.div>
  );
}

export default HomePage;
