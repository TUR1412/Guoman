import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiYoutube, FiMail } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background-color: var(--darker-color);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-2xl) 0 var(--spacing-lg);
`;

const FooterInner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }
`;

const FooterColumn = styled.div``;

const FooterLogo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  display: inline-block;
  margin-bottom: var(--spacing-md);
  
  span {
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const FooterDescription = styled.p`
  color: var(--text-tertiary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const SocialLink = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: var(--transition);
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
    transform: translateY(-3px);
  }
`;

const FooterHeading = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
`;

const FooterLinks = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const FooterLink = styled(Link)`
  color: var(--text-tertiary);
  transition: var(--transition);
  
  &:hover {
    color: var(--primary-color);
    padding-left: 5px;
  }
`;

const Copyright = styled.p`
  color: var(--text-tertiary);
  font-size: 0.9rem;
`;

const FooterNav = styled.nav`
  display: flex;
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-md) var(--spacing-lg);
  }
`;

const FooterNavLink = styled(Link)`
  color: var(--text-tertiary);
  font-size: 0.9rem;
  transition: var(--transition);
  
  &:hover {
    color: var(--primary-color);
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterInner>
        <FooterTop>
          <FooterColumn>
            <FooterLogo to="/">
              国漫<span>世界</span>
            </FooterLogo>
            <FooterDescription>
              中国最大的国产动漫内容平台，致力于推广优质国漫作品，
              为广大动漫爱好者提供优质的观影体验。
            </FooterDescription>
            <SocialLinks>
              <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FiGithub />
              </SocialLink>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FiTwitter />
              </SocialLink>
              <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FiInstagram />
              </SocialLink>
              <SocialLink href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FiYoutube />
              </SocialLink>
              <SocialLink href="mailto:contact@guoman.world" target="_blank" rel="noopener noreferrer">
                <FiMail />
              </SocialLink>
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn>
            <FooterHeading>导航</FooterHeading>
            <FooterLinks>
              <li><FooterLink to="/">首页</FooterLink></li>
              <li><FooterLink to="/recommendations">国漫推荐</FooterLink></li>
              <li><FooterLink to="/rankings">排行榜</FooterLink></li>
              <li><FooterLink to="/news">最新资讯</FooterLink></li>
              <li><FooterLink to="/about">关于我们</FooterLink></li>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <FooterHeading>分类</FooterHeading>
            <FooterLinks>
              <li><FooterLink to="/category/action">热血动作</FooterLink></li>
              <li><FooterLink to="/category/fantasy">奇幻玄幻</FooterLink></li>
              <li><FooterLink to="/category/ancient">古风仙侠</FooterLink></li>
              <li><FooterLink to="/category/scifi">科幻未来</FooterLink></li>
              <li><FooterLink to="/category/comedy">轻松搞笑</FooterLink></li>
            </FooterLinks>
          </FooterColumn>
          
          <FooterColumn>
            <FooterHeading>支持</FooterHeading>
            <FooterLinks>
              <li><FooterLink to="/help">帮助中心</FooterLink></li>
              <li><FooterLink to="/faq">常见问题</FooterLink></li>
              <li><FooterLink to="/contact">联系我们</FooterLink></li>
              <li><FooterLink to="/feedback">意见反馈</FooterLink></li>
              <li><FooterLink to="/app">下载APP</FooterLink></li>
            </FooterLinks>
          </FooterColumn>
        </FooterTop>
        
        <FooterBottom>
          <Copyright>
            &copy; {new Date().getFullYear()} 国漫世界. 保留所有权利.
          </Copyright>
          
          <FooterNav>
            <FooterNavLink to="/terms">服务条款</FooterNavLink>
            <FooterNavLink to="/privacy">隐私政策</FooterNavLink>
            <FooterNavLink to="/cookies">Cookie 政策</FooterNavLink>
            <FooterNavLink to="/accessibility">无障碍声明</FooterNavLink>
          </FooterNav>
        </FooterBottom>
      </FooterInner>
    </FooterContainer>
  );
}

export default Footer; 