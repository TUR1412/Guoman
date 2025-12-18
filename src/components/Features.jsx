import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlay, FiDownload, FiWifi, FiMonitor, FiHeart, FiUsers } from 'react-icons/fi';
import featuresBackground from '../assets/images/features-background.svg';

const FeaturesContainer = styled.section`
  padding: var(--spacing-3xl) 0;
  background-color: rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;

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

const FeaturesInner = styled.div`
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
  font-size: 1.1rem;
  margin-top: var(--spacing-md);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(motion.div)`
  background: var(--surface-glass);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-subtle);
  transition: var(--transition);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(255, 77, 77, 0.3);
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  font-size: 1.5rem;
  color: white;
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.2);
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
`;

const FeatureDescription = styled.p`
  color: var(--text-tertiary);
  line-height: 1.6;
`;

const features = [
  {
    icon: <FiPlay />,
    title: '高清播放',
    description: '支持最高4K超清画质，流畅播放无卡顿，享受震撼视听盛宴',
  },
  {
    icon: <FiDownload />,
    title: '离线观看',
    description: '下载喜爱的国漫作品，随时随地无网络也能尽情观看',
  },
  {
    icon: <FiWifi />,
    title: '免流量服务',
    description: '与多家运营商合作，观看国漫世界的内容不消耗您的流量',
  },
  {
    icon: <FiMonitor />,
    title: '多端同步',
    description: '手机、平板、电脑、电视多端账号同步，记录您的观看进度',
  },
  {
    icon: <FiHeart />,
    title: '个性化推荐',
    description: '基于您的观看习惯和偏好，智能推荐符合您口味的国漫作品',
  },
  {
    icon: <FiUsers />,
    title: '互动社区',
    description: '与其他国漫爱好者一起讨论、分享，结交志同道合的朋友',
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
  return (
    <FeaturesContainer>
      <FeaturesInner>
        <SectionHeader>
          <h2 className="section-title">我们的特色</h2>
          <SectionSubtitle>
            国漫世界致力于为您提供最优质的国漫内容与服务体验，
            让每一位国漫爱好者都能尽情享受中国动漫的魅力
          </SectionSubtitle>
        </SectionHeader>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <FeaturesGrid>
            {features.map((feature) => (
              <FeatureCard key={feature.title} variants={itemVariants}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </motion.div>
      </FeaturesInner>
    </FeaturesContainer>
  );
}

export default Features;
