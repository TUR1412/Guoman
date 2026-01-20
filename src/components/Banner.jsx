import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from './icons/feather';
import { IconButton } from '../ui';
import { prefetchRoute } from '../utils/routePrefetch';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';
import { usePointerGlow } from './usePointerGlow';

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
  height: min(680px, calc(100vh - var(--header-height)));
  height: min(680px, calc(100svh - var(--header-height)));
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
    height: calc(82svh - var(--header-height));
  }
`;

const CarouselViewport = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Slide = styled(motion.div)`
  position: absolute;
  inset: 0;
`;

const ControlsLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
`;

const NavButton = styled(IconButton).attrs({
  type: 'button',
  variant: 'secondary',
  'data-pressable': true,
})`
  --pressable-offset-y: -50%;
  --pressable-scale-active: 0.975;

  pointer-events: auto;
  position: absolute;
  top: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid var(--control-border);
  background: var(--control-bg);
  color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: var(--control-bg-hover);
      box-shadow: var(--shadow-lg);
    }
  }
`;

const PrevButton = styled(NavButton)`
  left: 16px;

  @media (max-width: 576px) {
    display: none;
  }
`;

const NextButton = styled(NavButton)`
  right: 16px;

  @media (max-width: 576px) {
    display: none;
  }
`;

const PaginationRow = styled.div`
  pointer-events: auto;
  position: absolute;
  left: 50%;
  bottom: 18px;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--border-subtle);
  background: var(--surface-glass);
  backdrop-filter: blur(12px) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(12px) saturate(var(--glass-saturate));
  box-shadow: var(--shadow-elev-3);
`;

const Dot = styled.button.attrs({ type: 'button', 'data-pressable': true })`
  width: 12px;
  height: 12px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--control-border);
  background: ${(p) => (p.$active ? 'var(--primary-color)' : 'var(--control-bg)')};
  opacity: ${(p) => (p.$active ? 1 : 0.75)};
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 1;
      border-color: var(--chip-border-hover);
    }
  }
`;

const BannerOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    var(--hero-overlay),
    radial-gradient(720px 360px at 78% 0%, rgba(var(--primary-rgb), 0.22), transparent 60%),
    radial-gradient(520px 280px at 12% 12%, rgba(var(--secondary-rgb), 0.16), transparent 60%);
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
  opacity: 0.55;
  filter: saturate(1.05) blur(10px);
  transform: scale(1.04);
`;

const BannerContent = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  display: grid;
  align-items: center;
  padding: 0 var(--spacing-lg);
`;

const BannerGrid = styled.div`
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
  align-items: end;

  @media (max-width: 992px) {
    align-items: start;
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

const BannerMetaCard = styled(motion.div).attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '5',
})`
  grid-column: span 4;
  align-self: end;
  display: grid;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);

  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }

  @media (max-width: 576px) {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
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

  @media (max-width: 576px) {
    display: none;
  }
`;

const BannerMetaList = styled.div.attrs({ 'data-divider': 'list', role: 'list' })`
  display: grid;
  gap: var(--spacing-xs-wide);

  @media (max-width: 576px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--spacing-md);

    > * + * {
      margin-top: 0;
      padding-top: 0;
    }

    > * + *::before {
      content: none;
    }
  }
`;

const BannerMetaItem = styled.div.attrs({ role: 'listitem' })`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--text-secondary);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);

    strong {
      font-size: var(--text-base);
    }
  }

  strong {
    color: var(--text-primary);
  }
`;

const BannerTag = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  justify-self: start;
  width: fit-content;
  max-width: 100%;
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
  font-size: clamp(var(--text-6xl), 1.4rem + 1.4vw, var(--text-9xl));
  font-weight: 900;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  text-shadow: var(--text-shadow-hero);
  letter-spacing: 0.02em;
  font-family: var(--font-display);

  @supports (-webkit-background-clip: text) {
    background: linear-gradient(120deg, var(--text-primary), rgba(var(--primary-rgb), 0.85));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 576px) {
    margin-bottom: var(--spacing-sm);
  }
`;

const BannerSubtitle = styled(motion.h2)`
  font-size: clamp(var(--text-lg-plus), 1.1rem + 0.6vw, var(--text-3xl));
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--secondary-color);
  text-shadow: var(--text-shadow-hero-soft);
  font-family: var(--font-display);
`;

const BannerDescription = styled(motion.p)`
  font-size: var(--text-lg);
  margin-bottom: var(--spacing-xl);
  color: var(--text-secondary);
  max-width: 62ch;

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
  --pressable-hover-translate-y: -2px;

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

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      filter: brightness(1.05);
      box-shadow: var(--shadow-primary-hover);
    }
  }
`;

function Banner() {
  const reducedMotion = useAppReducedMotion();
  const metaGlowRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slideCount = bannerData.length;

  usePointerGlow(metaGlowRef, { disabled: reducedMotion });

  const active = useMemo(() => {
    if (slideCount <= 0) return null;
    const index = Math.min(Math.max(Number(activeIndex) || 0, 0), slideCount - 1);
    return bannerData[index];
  }, [activeIndex, slideCount]);

  const goTo = useCallback(
    (nextIndex) => {
      if (slideCount <= 0) return;
      const raw = Number(nextIndex) || 0;
      const normalized = ((raw % slideCount) + slideCount) % slideCount;
      setActiveIndex(normalized);
    },
    [slideCount],
  );

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (slideCount <= 0) return 0;
      return (prev - 1 + slideCount) % slideCount;
    });
  }, [slideCount]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (slideCount <= 0) return 0;
      return (prev + 1) % slideCount;
    });
  }, [slideCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (reducedMotion) return undefined;
    if (paused) return undefined;
    if (slideCount <= 1) return undefined;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    }, 5000);

    return () => window.clearInterval(id);
  }, [paused, reducedMotion, slideCount]);

  useEffect(() => {
    if (!active?.link) return;
    if (typeof window === 'undefined') return;

    const connection =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection?.saveData) return;
    if (connection?.effectiveType && ['slow-2g', '2g'].includes(connection.effectiveType)) return;

    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(() => prefetchRoute(active.link), {
        timeout: 1200,
      });
      return () => window.cancelIdleCallback?.(handle);
    }

    const timeoutId = window.setTimeout(() => prefetchRoute(active.link), 350);
    return () => window.clearTimeout(timeoutId);
  }, [active?.link]);

  const onKeyDownCapture = (event) => {
    if (!event) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrev();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  };

  return (
    <BannerContainer
      aria-label="首页精选轮播"
      aria-describedby="banner-desc"
      onKeyDownCapture={onKeyDownCapture}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <span id="banner-desc" className="sr-only">
        轮播展示国漫精选推荐与播放入口。
      </span>

      <CarouselViewport role="list" aria-label="精选轮播列表">
        <AnimatePresence mode="wait">
          {active ? (
            <Slide
              key={active.id}
              role="listitem"
              initial={false}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={
                reducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
              }
            >
              <BannerImage $image={active.image} />
              <BannerOverlay />
              <BannerContent>
                <BannerGrid>
                  <BannerMain>
                    <BannerTag
                      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                      }
                    >
                      {active.tag}
                    </BannerTag>
                    <BannerTitle
                      initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }
                      }
                    >
                      {active.title}
                    </BannerTitle>
                    <BannerSubtitle
                      initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }
                      }
                    >
                      {active.subtitle}
                    </BannerSubtitle>
                    <BannerDescription
                      initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }
                      }
                    >
                      {active.desc}
                    </BannerDescription>
                    <BannerActions
                      initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { duration: 0.6, delay: 0.42, ease: [0.22, 1, 0.36, 1] }
                      }
                    >
                      <BannerButton
                        to={active.link}
                        aria-label={active.buttonText}
                        whileHover={reducedMotion ? undefined : { scale: 1.05 }}
                        whileTap={reducedMotion ? undefined : { scale: 0.95 }}
                        onMouseEnter={() => prefetchRoute(active.link)}
                        onFocus={() => prefetchRoute(active.link)}
                      >
                        {active.buttonText}
                      </BannerButton>
                    </BannerActions>
                  </BannerMain>

                  <BannerMetaCard
                    ref={metaGlowRef}
                    data-pointer-glow
                    initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <BannerMetaBadge>
                      第 {activeIndex + 1} / {slideCount} 帧
                    </BannerMetaBadge>
                    <BannerMetaTitle>剧集速览</BannerMetaTitle>
                    <BannerMetaList>
                      {active.meta?.map((meta) => (
                        <BannerMetaItem key={`${active.id}-${meta.label}`}>
                          <span>{meta.label}</span>
                          <strong>{meta.value}</strong>
                        </BannerMetaItem>
                      ))}
                    </BannerMetaList>
                  </BannerMetaCard>
                </BannerGrid>
              </BannerContent>
            </Slide>
          ) : null}
        </AnimatePresence>

        <ControlsLayer>
          <PrevButton aria-label="上一帧" onClick={goPrev} title="上一帧">
            <FiChevronLeft />
          </PrevButton>
          <NextButton aria-label="下一帧" onClick={goNext} title="下一帧">
            <FiChevronRight />
          </NextButton>

          {slideCount > 1 ? (
            <PaginationRow aria-label="轮播分页">
              {bannerData.map((item, idx) => (
                <Dot
                  key={item.id}
                  $active={idx === activeIndex}
                  aria-label={`切换到第 ${idx + 1} 帧：${item.tag}`}
                  aria-pressed={idx === activeIndex}
                  tabIndex={idx === activeIndex ? 0 : -1}
                  onClick={() => goTo(idx)}
                />
              ))}
            </PaginationRow>
          ) : null}
        </ControlsLayer>
      </CarouselViewport>
    </BannerContainer>
  );
}

export default Banner;
