import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Banner from '../components/Banner';
import AnimeList from '../components/AnimeList';
import Features from '../components/Features';
import About from '../components/About';
import RecentlyViewed from '../components/RecentlyViewed';
import ContinueWatching from '../components/ContinueWatching';
import { usePageMeta } from '../utils/pageMeta';

function HomePage() {
  const reducedMotion = useReducedMotion();

  const pageMotion = reducedMotion
    ? { initial: false, animate: false, exit: false }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.25 },
      };

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



