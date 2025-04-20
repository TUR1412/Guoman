import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import teamImage from '../assets/images/team-image.svg';

const AboutContainer = styled.section`
  padding: var(--spacing-3xl) 0;
`;

const AboutInner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
`;

const AboutContent = styled.div`
  @media (max-width: 992px) {
    order: 2;
  }
`;

const AboutTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const AboutDescription = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
`;

const StatItem = styled(motion.div)`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StatTitle = styled.div`
  font-size: 1rem;
  color: var(--text-tertiary);
`;

const AboutImage = styled(motion.div)`
  position: relative;
  
  @media (max-width: 992px) {
    order: 1;
  }
  
  img {
    width: 100%;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid var(--primary-color);
    border-radius: var(--border-radius-lg);
    top: 20px;
    left: 20px;
    z-index: -1;
    
    @media (max-width: 768px) {
      top: 10px;
      left: 10px;
    }
  }
`;

const ContactButton = styled(Link)`
  display: inline-block;
  margin-top: var(--spacing-lg);
  padding: 0.75rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
  
  &:hover {
    background-color: #e64545;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(255, 77, 77, 0.4);
  }
`;

function About() {
  return (
    <AboutContainer>
      <AboutInner>
        <AboutContent>
          <AboutTitle>关于国漫世界</AboutTitle>
          <AboutDescription>
            国漫世界是中国最大的国产动漫内容平台，致力于推广优质国漫作品，为广大动漫爱好者提供优质的观影体验。
          </AboutDescription>
          <AboutDescription>
            自2018年成立以来，我们与国内顶尖动画工作室深度合作，独家引进多部精品国漫，持续为用户呈现高品质的国漫内容。我们相信，中国动漫正处于蓬勃发展的黄金时期，国漫世界愿与每一位国漫爱好者共同见证这个伟大的时代。
          </AboutDescription>
          
          <Stats>
            <StatItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <StatNumber>500+</StatNumber>
              <StatTitle>优质国漫</StatTitle>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <StatNumber>2000万+</StatNumber>
              <StatTitle>注册用户</StatTitle>
            </StatItem>
            <StatItem
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <StatNumber>50+</StatNumber>
              <StatTitle>合作工作室</StatTitle>
            </StatItem>
          </Stats>
          
          <ContactButton to="/about">了解更多</ContactButton>
        </AboutContent>
        
        <AboutImage
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img 
            src={teamImage}
            alt="国漫世界团队" 
          />
        </AboutImage>
      </AboutInner>
    </AboutContainer>
  );
}

export default About; 