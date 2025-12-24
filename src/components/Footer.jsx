import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiYoutube, FiMail } from './icons/feather';

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
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);

  & > :nth-child(1) {
    grid-column: span 5;
  }

  & > :nth-child(2) {
    grid-column: span 2;
  }

  & > :nth-child(3) {
    grid-column: span 2;
  }

  & > :nth-child(4) {
    grid-column: span 3;
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    & > * {
      grid-column: span 1;
    }
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

const FooterBrand = styled(FooterColumn).attrs({ 'data-card': true, 'data-divider': 'card' })`
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--surface-glass);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(200px 120px at 10% 0%, var(--primary-soft), transparent 70%);
    opacity: 0.6;
    pointer-events: none;
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const FooterLogo = styled(Link)`
  font-size: var(--text-4xl);
  font-weight: 700;
  color: var(--text-primary);
  display: inline-block;
  margin-bottom: var(--spacing-md);
  font-family: var(--font-display);

  span {
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const FooterDescription = styled.p`
  color: var(--text-tertiary);
  line-height: var(--leading-normal);
  margin-bottom: var(--spacing-lg);
`;

const SocialLinks = styled.div.attrs({ 'data-divider': 'inline', role: 'list' })`
  display: flex;
  gap: var(--spacing-md);
`;

const SocialLink = styled.a.attrs({ 'data-pressable': true, role: 'listitem' })`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--control-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-color);
    color: var(--text-on-primary);
    transform: translateY(-3px);
  }
`;

const FooterHeading = styled.h4`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-lg);
`;

const FooterLinks = styled.ul.attrs({ 'data-divider': 'list', role: 'list' })`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const FooterLink = styled(Link).attrs({ 'data-pressable': true })`
  color: var(--text-tertiary);
  transition: var(--transition);

  &:hover {
    color: var(--primary-color);
    padding-left: 5px;
  }
`;

const Copyright = styled.p`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const FooterNav = styled.nav.attrs({ 'data-divider': 'inline', role: 'list' })`
  display: flex;
  gap: var(--spacing-lg);

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--spacing-md) var(--spacing-lg);
  }
`;

const FooterNavLink = styled(Link).attrs({ 'data-pressable': true, role: 'listitem' })`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  transition: var(--transition);

  &:hover {
    color: var(--primary-color);
  }
`;

function Footer() {
  const titleId = 'footer-title';
  const descId = 'footer-desc';

  return (
    <FooterContainer aria-labelledby={titleId} aria-describedby={descId}>
      <span id={descId} className="sr-only">
        页脚包含品牌介绍、导航链接、分类入口与支持信息。
      </span>
      <FooterInner>
        <FooterTop>
          <FooterBrand>
            <FooterLogo to="/" id={titleId}>
              国漫<span>世界</span>
            </FooterLogo>
            <FooterDescription>
              中国最大的国产动漫内容平台，致力于推广优质国漫作品，
              为广大动漫爱好者提供优质的观影体验。
            </FooterDescription>
            <SocialLinks>
              <SocialLink
                href="https://github.com/TUR1412/Guoman"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <FiGithub />
              </SocialLink>
              <SocialLink
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                title="Twitter"
              >
                <FiTwitter />
              </SocialLink>
              <SocialLink
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
              >
                <FiInstagram />
              </SocialLink>
              <SocialLink
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                title="YouTube"
              >
                <FiYoutube />
              </SocialLink>
              <SocialLink
                href="mailto:contact@guoman.world"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="邮箱联系"
                title="邮箱联系"
              >
                <FiMail />
              </SocialLink>
            </SocialLinks>
          </FooterBrand>

          <FooterColumn>
            <FooterHeading>导航</FooterHeading>
            <FooterLinks>
              <li>
                <FooterLink to="/">首页</FooterLink>
              </li>
              <li>
                <FooterLink to="/recommendations">国漫推荐</FooterLink>
              </li>
              <li>
                <FooterLink to="/rankings">排行榜</FooterLink>
              </li>
              <li>
                <FooterLink to="/news">最新资讯</FooterLink>
              </li>
              <li>
                <FooterLink to="/about">关于我们</FooterLink>
              </li>
              <li>
                <FooterLink to="/profile">用户中心</FooterLink>
              </li>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterHeading>分类</FooterHeading>
            <FooterLinks>
              <li>
                <FooterLink to="/category/action">热血动作</FooterLink>
              </li>
              <li>
                <FooterLink to="/category/fantasy">奇幻玄幻</FooterLink>
              </li>
              <li>
                <FooterLink to="/category/ancient">古风仙侠</FooterLink>
              </li>
              <li>
                <FooterLink to="/category/scifi">科幻未来</FooterLink>
              </li>
              <li>
                <FooterLink to="/category/comedy">轻松搞笑</FooterLink>
              </li>
            </FooterLinks>
          </FooterColumn>

          <FooterColumn>
            <FooterHeading>支持</FooterHeading>
            <FooterLinks>
              <li>
                <FooterLink to="/help">帮助中心</FooterLink>
              </li>
              <li>
                <FooterLink to="/faq">常见问题</FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">联系我们</FooterLink>
              </li>
              <li>
                <FooterLink to="/feedback">意见反馈</FooterLink>
              </li>
              <li>
                <FooterLink to="/app">下载APP</FooterLink>
              </li>
            </FooterLinks>
          </FooterColumn>
        </FooterTop>

        <FooterBottom>
          <Copyright>&copy; {new Date().getFullYear()} 国漫世界. 保留所有权利.</Copyright>

          <FooterNav aria-label="页脚导航">
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
