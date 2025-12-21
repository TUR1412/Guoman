import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
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
    tag: '热播推荐',
    meta: [
      { label: '热度', value: '9.6' },
      { label: '更新', value: '每周五' },
      { label: '评分', value: '4.9' },
    ],
    image: placeholder1,
    link: '/anime/1',
  },
  {
    id: 2,
    title: '《天官赐福》动画第二季',
    subtitle: '谢怜与花城的奇妙旅程',
    desc: '天官赐福第二季，还原原著精彩剧情，谢怜身世之谜即将揭晓',
    buttonText: '查看详情',
    tag: '国风仙侠',
    meta: [
      { label: '热度', value: '9.4' },
      { label: '更新', value: '每周六' },
      { label: '评分', value: '4.8' },
    ],
    image: placeholder2,
    link: '/anime/2',
  },
  {
    id: 3,
    title: '《魔道祖师》完结篇',
    subtitle: '蓝忘机与魏无羡再续前缘',
    desc: '仙子魏无羡的故事走向尾声，姑苏蓝氏与云梦江氏的千年情缘值得期待',
    buttonText: '了解更多',
    tag: '终章上线',
    meta: [
      { label: '热度', value: '9.3' },
      { label: '进度', value: '完结' },
      { label: '评分', value: '4.7' },
    ],
    image: placeholder3,
    link: '/anime/3',
  },
  {
    id: 4,
    title: '《全职高手》最终决赛',
    subtitle: '叶修带领嘉世战队征战荣耀',
    desc: '全职高手系列最终篇章，荣耀职业联赛的巅峰对决',
    buttonText: '观看直播',
    tag: '电竞热血',
    meta: [
      { label: '热度', value: '9.2' },
      { label: '赛事', value: '决赛周' },
      { label: '评分', value: '4.6' },
    ],
    image: placeholder4,
    link: '/anime/4',
  },
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
    background-color: var(--control-bg);
    border: 1px solid var(--control-border);
    opacity: 0.7;

    &-active {
      background-color: var(--primary-color);
      opacity: 1;
    }
  }

  .swiper-button-prev,
  .swiper-button-next {
    color: var(--primary-color);
    background-color: var(--control-bg);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: var(--transition);

    &::after {
      font-size: var(--text-lg-plus);
    }

    &:hover {
      background-color: var(--control-bg-hover);
    }
  }
`;

const BannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--hero-overlay);
  z-index: 2;
`;

const BannerImage = styled.div.attrs({ 'data-parallax': true })`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.$image});
  background-size: cover;
  background-position: center;
  z-index: 1;
  opacity: 0.9;
`;

const BannerContent = styled.div`
  position: absolute;
  bottom: 12%;
  left: 8%;
  right: 8%;
  z-index: 3;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
  align-items: end;

  @media (max-width: 1200px) {
    left: 6%;
    right: 6%;
  }

  @media (max-width: 992px) {
    bottom: 10%;
  }

  @media (max-width: 768px) {
    left: 5%;
    right: 5%;
  }
`;

const BannerMain = styled.div`
  grid-column: span 8;
  display: grid;
  gap: var(--spacing-md);
  align-content: start;

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const BannerMetaCard = styled(motion.div).attrs({ 'data-card': true, 'data-divider': 'card' })`
  grid-column: span 4;
  align-self: end;
  display: grid;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--surface-glass);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(14px);

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }
`;

const BannerMetaBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-wide);
  padding: var(--spacing-xs-plus) var(--spacing-md-compact);
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--stamp-border);
  background: var(--stamp-bg);
  color: var(--stamp-text);
  font-weight: 700;
  font-size: var(--text-xs);
  box-shadow: var(--shadow-stamp);
  width: fit-content;
`;

const BannerMetaTitle = styled.div`
  font-weight: 700;
  color: var(--text-primary);
`;

const BannerMetaList = styled.div.attrs({ 'data-divider': 'list', role: 'list' })`
  display: grid;
  gap: var(--spacing-xs-wide);
`;

const BannerMetaItem = styled.div.attrs({ role: 'listitem' })`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--text-secondary);

  strong {
    color: var(--text-primary);
  }
`;

const BannerTag = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs-plus) var(--spacing-md-tight);
  border-radius: var(--border-radius-pill);
  background: var(--stamp-bg);
  border: 1px solid var(--stamp-border);
  color: var(--stamp-text);
  font-size: var(--text-xs);
  font-weight: 600;
  backdrop-filter: blur(6px);
`;

const BannerTitle = styled(motion.h1)`
  font-size: var(--text-10xl);
  font-weight: 900;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  text-shadow: var(--text-shadow-hero);
  letter-spacing: 0.02em;

  @media (max-width: 768px) {
    font-size: var(--text-9xl);
  }

  @media (max-width: 576px) {
    font-size: var(--text-8xl);
  }
`;

const BannerSubtitle = styled(motion.h2)`
  font-size: var(--text-4xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--secondary-color);
  text-shadow: var(--text-shadow-hero-soft);

  @media (max-width: 576px) {
    font-size: var(--text-xl);
  }
`;

const BannerDescription = styled(motion.p)`
  font-size: var(--text-lg);
  margin-bottom: var(--spacing-xl);
  color: var(--text-secondary);
  max-width: 90%;

  @media (max-width: 576px) {
    font-size: var(--text-base);
    margin-bottom: var(--spacing-lg);
  }
`;

const BannerActions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
`;

const BannerButton = styled(motion(Link)).attrs({
  'data-shimmer': true,
  'data-pressable': true,
  'data-focus-guide': true,
})`
  padding: var(--spacing-sm-plus) var(--spacing-xl);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: var(--text-on-primary);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: var(--text-base);
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-primary);
  transition: var(--transition);

  &:hover {
    filter: brightness(1.05);
    transform: translateY(-2px);
    box-shadow: var(--shadow-primary-hover);
  }
`;

function Banner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const swiperModules = reducedMotion
    ? [Pagination, Navigation]
    : [Pagination, Navigation, Autoplay, EffectFade];

  return (
    <BannerContainer aria-label="首页精选轮播" aria-describedby="banner-desc">
      <span id="banner-desc" className="sr-only">
        轮播展示国漫精选推荐与播放入口。
      </span>
      <Swiper
        modules={swiperModules}
        slidesPerView={1}
        effect={reducedMotion ? 'slide' : 'fade'}
        pagination={{ clickable: true }}
        navigation
        autoplay={
          reducedMotion
            ? false
            : {
                delay: 5000,
                disableOnInteraction: false,
              }
        }
        loop={true}
        role="list"
        aria-label="精选轮播列表"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {bannerData.map((banner, index) => (
          <SwiperSlide key={banner.id} role="listitem">
            <BannerImage $image={banner.image} />
            <BannerOverlay />
            <BannerContent>
              <BannerMain>
                <BannerTag
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    y: reducedMotion ? 0 : activeIndex === index ? 0 : 20,
                  }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
                >
                  {banner.tag}
                </BannerTag>
                <BannerTitle
                  initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    y: reducedMotion ? 0 : activeIndex === index ? 0 : 30,
                  }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
                >
                  {banner.title}
                </BannerTitle>
                <BannerSubtitle
                  initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    y: reducedMotion ? 0 : activeIndex === index ? 0 : 30,
                  }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.4 }}
                >
                  {banner.subtitle}
                </BannerSubtitle>
                <BannerDescription
                  initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    y: reducedMotion ? 0 : activeIndex === index ? 0 : 30,
                  }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.6 }}
                >
                  {banner.desc}
                </BannerDescription>
                <BannerActions
                  initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    y: reducedMotion ? 0 : activeIndex === index ? 0 : 30,
                  }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.8 }}
                >
                  <BannerButton
                    to={banner.link}
                    aria-label={banner.buttonText}
                    whileHover={reducedMotion ? undefined : { scale: 1.05 }}
                    whileTap={reducedMotion ? undefined : { scale: 0.95 }}
                  >
                    {banner.buttonText}
                  </BannerButton>
                </BannerActions>
              </BannerMain>

              <BannerMetaCard
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{
                  opacity: activeIndex === index ? 1 : 0,
                  y: reducedMotion ? 0 : activeIndex === index ? 0 : 20,
                }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.4 }}
              >
                <BannerMetaBadge>
                  第 {index + 1} / {bannerData.length} 帧
                </BannerMetaBadge>
                <BannerMetaTitle>剧集速览</BannerMetaTitle>
                <BannerMetaList>
                  {banner.meta?.map((meta) => (
                    <BannerMetaItem key={`${banner.id}-${meta.label}`}>
                      <span>{meta.label}</span>
                      <strong>{meta.value}</strong>
                    </BannerMetaItem>
                  ))}
                </BannerMetaList>
              </BannerMetaCard>
            </BannerContent>
          </SwiperSlide>
        ))}
      </Swiper>
    </BannerContainer>
  );
}

export default Banner;
