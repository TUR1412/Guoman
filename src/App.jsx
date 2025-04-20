import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  useEffect(() => {
    // 模拟加载过程
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 检测路由变化，确保页面滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
          <Route path="/recommendations" element={
            <>
              <Banner />
              <AnimeList />
              <Features />
              <About />
            </>
          } />
          <Route path="/rankings" element={
            <>
              <Banner />
              <AnimeList title="国漫排行榜" />
              <Features />
            </>
          } />
          <Route path="/news" element={
            <>
              <Banner />
              <Features title="最新动漫资讯" />
            </>
          } />
          <Route path="/about" element={<About fullPage={true} />} />
          <Route path="*" element={
            <div style={{textAlign: 'center', padding: '100px 20px'}}>
              <h1>页面不存在</h1>
              <p>抱歉，您请求的页面不存在。</p>
            </div>
          } />
        </Routes>
      </MainContent>
      
      <Footer />
    </AppContainer>
  );
}

export default App; 