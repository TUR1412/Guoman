import React from 'react';
import { motion } from 'framer-motion';
import Banner from '../components/Banner';
import AnimeList from '../components/AnimeList';
import Features from '../components/Features';
import About from '../components/About';

const pageMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.25 },
};

function HomePage() {
  return (
    <motion.div {...pageMotion}>
      <Banner />
      <AnimeList />
      <Features />
      <About cta={{ to: '/about', label: '了解更多' }} />
    </motion.div>
  );
}

export default HomePage;
