import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

// 导入本地图片
import placeholder1 from '../assets/images/placeholder-1.svg';
import placeholder2 from '../assets/images/placeholder-2.svg';
import placeholder3 from '../assets/images/placeholder-3.svg';
import placeholder4 from '../assets/images/placeholder-4.svg';
import bannerBackground from '../assets/images/banner-background.svg';

// 模拟数据
const bannerData = [
  {
    id: 1,
    title: '《斗罗大陆》最新季火热上线',
    subtitle: '唐三修炼之路，再创传奇',
    desc: '唐三携带着昊天锤和海神之力，能否在大陆上收获更强大的魂环？',
    buttonText: '立即观看',
    image: placeholder1,
    link: '/anime/1'
  },
  {
    id: 2,
    title: '《天官赐福》动画第二季',
    subtitle: '谢怜与花城的奇妙旅程',
    desc: '天官赐福第二季，还原原著精彩剧情，谢怜身世之谜即将揭晓',
    buttonText: '查看详情',
    image: placeholder2,
    link: '/anime/2'
  },
  {
    id: 3,
    title: '《魔道祖师》完结篇',
    subtitle: '蓝忘机与魏无羡再续前缘',
    desc: '仙子魏无羡的故事走向尾声，姑苏蓝氏与云梦江氏的千年情缘值得期待',
    buttonText: '了解更多',
    image: placeholder3,
    link: '/anime/3'
  },
  {
    id: 4,
    title: '《全职高手》最终决赛',
    subtitle: '叶修带领嘉世战队征战荣耀',
    desc: '全职高手系列最终篇章，荣耀职业联赛的巅峰对决',
    buttonText: '观看直播',
    image: placeholder4,
    link: '/anime/4'
  }
];

const BannerContainer = styled.section`
  width: 100%;
  height: calc(100vh - var(--header-height));
  height: calc(100svh - var(--header-height));
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${bannerBackground});
    background-size: cover;
    background-position: center;
    z-index: 0;
    opacity: 0.6;
  }
  
  @media (max-width: 768px) {
    height: calc(70svh - var(--header-height));
  }
  
  @media (max-width: 576px) {
    height: calc(60svh - var(--header-height));
  }
  
  .swiper {
    width: 100%;
    height: 100%;
  }
  
  .swiper-slide {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    background-color: rgba(255, 255, 255, 0.7);
    opacity: 0.7;
    
    &-active {
      background-color: var(--primary-color);
      opacity: 1;
    }
  }
  
  .swiper-button-prev,
  .swiper-button-next {
    color: var(--primary-color);
    background-color: rgba(0, 0, 0, 0.3);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: var(--transition);
    
    &::after {
      font-size: 1.2rem;
    }
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
`;

const BannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    0deg,
    rgba(13, 17, 23, 1) 0%,
    rgba(13, 17, 23, 0.7) 30%,
    rgba(13, 17, 23, 0.4) 60%,
    rgba(13, 17, 23, 0.1) 100%
  );
  z-index: 2;
`;

const BannerImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  z-index: 1;
  opacity: 0.9;
`;

const BannerContent = styled.div`
  position: absolute;
  bottom: 20%;
  left: 10%;
  z-index: 3;
  max-width: 600px;
  
  @media (max-width: 768px) {
    bottom: 15%;
    left: 5%;
    max-width: 90%;
  }
`;

const BannerTitle = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2rem;
  }
`;

const BannerSubtitle = styled(motion.h2)`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--primary-color);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 576px) {
    font-size: 1.25rem;
  }
`;

const BannerDescription = styled(motion.p)`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: var(--text-secondary);
  max-width: 90%;
  
  @media (max-width: 576px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const BannerButton = styled(motion.button)`
  padding: 0.75rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
  transition: var(--transition);
  
  &:hover {
    background-color: #e64545;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 77, 77, 0.4);
  }
`;

function Banner() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  return (
    <BannerContainer>
      <Swiper
        modules={[Pagination, Navigation, Autoplay, EffectFade]}
        slidesPerView={1}
        effect="fade"
        pagination={{ clickable: true }}
        navigation
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {bannerData.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <BannerImage $image={banner.image} />
            <BannerOverlay />
            <BannerContent>
              <BannerTitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: activeIndex === index ? 1 : 0, y: activeIndex === index ? 0 : 30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {banner.title}
              </BannerTitle>
              <BannerSubtitle
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: activeIndex === index ? 1 : 0, y: activeIndex === index ? 0 : 30 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {banner.subtitle}
              </BannerSubtitle>
              <BannerDescription
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: activeIndex === index ? 1 : 0, y: activeIndex === index ? 0 : 30 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {banner.desc}
              </BannerDescription>
              <Link to={banner.link}>
                <BannerButton
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: activeIndex === index ? 1 : 0, y: activeIndex === index ? 0 : 30 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {banner.buttonText}
                </BannerButton>
              </Link>
            </BannerContent>
          </SwiperSlide>
        ))}
      </Swiper>
    </BannerContainer>
  );
}

export default Banner; 
