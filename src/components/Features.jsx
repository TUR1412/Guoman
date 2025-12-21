import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FiActivity, FiAward, FiBell, FiHeart, FiShare2, FiStar } from 'react-icons/fi';
import featuresBackground from '../assets/images/features-background.svg';

const FeaturesContainer = styled.section`
  padding: var(--spacing-3xl) 0;
  background: var(--surface-ink);
  position: relative;
  overflow: hidden;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(${featuresBackground}) center/cover no-repeat;
    opacity: 0.1;
    z-index: -1;
  }
`;

const FeaturesInner = styled.div.attrs({ 'data-divider': 'list' })`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-2xl);
`;

const SectionSubtitle = styled.p`
  color: var(--text-tertiary);
  font-size: var(--text-lg);
  margin-top: var(--spacing-md);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 576px) {
    font-size: var(--text-base);
  }
`;

const FeaturesGrid = styled.div.attrs({ role: 'list', 'data-stagger': true })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-xl);

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div).attrs({
  role: 'listitem',
  'data-card': true,
  'data-divider': 'card',
})`
  background: var(--surface-glass);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-subtle);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  grid-column: span 4;
  backdrop-filter: blur(12px);

  &:nth-child(1) {
    grid-column: span 6;
  }

  &:nth-child(2) {
    grid-column: span 6;
  }

  &:nth-child(5) {
    grid-column: span 4;
  }

  &:nth-child(6) {
    grid-column: span 12;
  }

  @media (max-width: 992px) {
    grid-column: span 1;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: var(--chip-border-hover);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(180px 120px at 85% 0%, var(--primary-soft), transparent 70%);
    opacity: 0.6;
    pointer-events: none;
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--surface-paper);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  font-size: var(--text-4xl);
  color: var(--primary-color);
  box-shadow: var(--shadow-primary-soft);
`;

const FeatureTitle = styled.h3`
  font-size: var(--text-lg-plus);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`;

const FeatureDescription = styled.p`
  color: var(--text-tertiary);
  line-height: var(--leading-normal);
`;

const FeatureAction = styled(Link).attrs({ 'data-pressable': true })`
  width: fit-content;
  padding: 0.55rem 0.9rem;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  font-weight: 800;
  transition: var(--transition);
  margin-top: var(--spacing-md);

  &:hover {
    border-color: var(--chip-border-hover);
    background: var(--surface-soft-hover);
  }
`;

const features = [
  {
    icon: <FiHeart />,
    title: '本地收藏与分组',
    description: '收藏/分组/导入导出一体化：刷新不丢、离线可用。',
    to: '/favorites',
  },
  {
    icon: <FiBell />,
    title: '追更中心',
    description: '一键追更 + 提醒时间 + 通知中心：把追番变成习惯。',
    to: '/following',
  },
  {
    icon: <FiStar />,
    title: '口味画像推荐',
    description: '基于收藏/观看进度/搜索词构建 Taste Engine 并排序推荐。',
    to: '/recommendations',
  },
  {
    icon: <FiShare2 />,
    title: '海报工坊',
    description: '一键生成 SVG 分享海报 + 历史管理：把推荐做成传播。',
    to: '/posters',
  },
  {
    icon: <FiActivity />,
    title: '足迹中心',
    description: '播放/下载/分享行为的本地足迹与留存概览，支持一键清理。',
    to: '/insights',
  },
  {
    icon: <FiAward />,
    title: '成就系统',
    description: '进度条化反馈：让每一次互动都可见，让留存更有“可玩性”。',
    to: '/achievements',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

function Features() {
  const reducedMotion = useReducedMotion();
  const titleId = 'features-title';
  const subtitleId = 'features-subtitle';

  const containerMotionProps = reducedMotion
    ? {}
    : {
        variants: containerVariants,
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, amount: 0.1 },
      };

  return (
    <FeaturesContainer aria-labelledby={titleId} aria-describedby={subtitleId}>
      <FeaturesInner>
        <SectionHeader>
          <h2 className="section-title" id={titleId}>
            我们的特色
          </h2>
          <SectionSubtitle id={subtitleId}>
            国漫世界致力于为您提供最优质的国漫内容与服务体验，
            让每一位国漫爱好者都能尽情享受中国动漫的魅力
          </SectionSubtitle>
        </SectionHeader>

        <motion.div {...containerMotionProps}>
          <FeaturesGrid>
            {features.map((feature) => (
              <FeatureCard key={feature.title} variants={reducedMotion ? undefined : itemVariants}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
                {feature.to ? <FeatureAction to={feature.to}>打开</FeatureAction> : null}
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </motion.div>
      </FeaturesInner>
    </FeaturesContainer>
  );
}

export default Features;
