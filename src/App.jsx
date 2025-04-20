import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// 组件导入
import Header from './components/Header';
import Banner from './components/Banner';
import AnimeList from './components/AnimeList';
import Features from './components/Features';
import About from './components/About';
import Footer from './components/Footer';
import Login from './components/Login';
import AnimeDetail from './components/AnimeDetail';

// 样式
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0D1117 0%, #161B22 100%);
  color: #e6e6e6;
`;

const MainContent = styled.main`
  flex: 1;
`;

const LoadingScreen = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0D1117;
  z-index: 1000;
`;

const LoadingLogo = styled(motion.div)`
  font-size: 2.5rem;
  font-weight: bold;
  color: #ff4d4d;
  font-family: 'Noto Sans SC', sans-serif;
  text-shadow: 0 0 10px rgba(255, 77, 77, 0.5);
`;

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载过程
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContainer>
      <AnimatePresence>
        {loading && (
          <LoadingScreen
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
      
      <MainContent>
        <Routes>
          <Route path="/" element={
            <>
              <Banner />
              <AnimeList />
              <Features />
              <About />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="recommendations" element={
            <>
              <Banner />
              <AnimeList />
              <Features />
              <About />
            </>
          } />
        </Routes>
      </MainContent>
      
      <Footer />
    </AppContainer>
  );
}

export default App; 