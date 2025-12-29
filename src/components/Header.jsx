import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence, LayoutGroup, motion, useScroll, useSpring } from 'framer-motion';
import {
  FiActivity,
  FiBell,
  FiAward,
  FiBookOpen,
  FiCommand,
  FiCompass,
  FiHeart,
  FiHome,
  FiInfo,
  FiLogIn,
  FiMenu,
  FiMoon,
  FiSearch,
  FiShare2,
  FiSun,
  FiTrendingUp,
  FiUser,
  FiX,
} from './icons/feather';
import logoSvg from '../assets/images/logo.svg';
import { getCurrentTheme, toggleTheme } from '../utils/theme';
import { usePersistedState } from '../utils/usePersistedState';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { useStorageSignal } from '../utils/useStorageSignal';
import { prefetchRoute } from '../utils/routePrefetch';
import { safeJsonParse } from '../utils/json';
import { useIsProEnabled } from '../utils/useProMembership';
import CommandPalette from './CommandPalette';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';
import { usePointerGlow } from './usePointerGlow';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background-color: ${(p) => (p.$scrolled ? 'var(--header-bg-scrolled)' : 'var(--header-bg)')};
  backdrop-filter: blur(8px);
  z-index: 100;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
  box-shadow: ${(p) => (p.$scrolled ? 'var(--shadow-md)' : 'none')};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      420px 120px at 20% 0%,
      rgba(var(--primary-rgb), 0.16),
      transparent 70%
    );
    opacity: ${(p) => (p.$scrolled ? 0.45 : 0.3)};
  }
`;

const HeaderInner = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
  align-items: center;
  height: 100%;
  padding: 0 var(--spacing-lg);
  max-width: var(--max-width);
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  grid-column: span 2;

  img {
    height: 32px;
  }

  .logo-title {
    font-weight: 800;
    letter-spacing: -0.02em;
    font-family: var(--font-display);
  }

  @media (max-width: 576px) {
    .logo-title {
      display: none;
    }
  }

  @media (max-width: 992px) {
    grid-column: span 2;
  }

  @media (max-width: 768px) {
    grid-column: 1 / span 10;
  }
`;

const ProBadge = styled(motion.span).attrs({ 'data-shimmer': true })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--primary-soft-border);
  background: rgba(var(--primary-rgb), 0.16);
  color: var(--primary-color);
  font-size: var(--text-xxs);
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  min-width: 0;
  grid-column: span 5;

  @media (max-width: 1200px) {
    grid-column: span 4;
  }

  @media (max-width: 992px) {
    grid-column: span 3;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinks = styled.ul.attrs({ 'data-divider': 'inline', role: 'list' })`
  display: flex;
  gap: var(--spacing-lg);
  row-gap: var(--spacing-sm);
  flex-wrap: wrap;
  align-items: center;
`;

const NavLink = styled(Link).attrs({ 'data-pressable': true })`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.45rem 0.8rem;
  border-radius: var(--border-radius-pill);
  overflow: hidden;
  font-weight: 500;
  color: ${(props) => (props.$active ? 'var(--text-on-primary)' : 'var(--text-secondary)')};
  transition: var(--transition);

  &:hover {
    color: ${(props) => (props.$active ? 'var(--text-on-primary)' : 'var(--primary-color)')};
    background: ${(props) => (props.$active ? 'transparent' : 'var(--surface-soft-hover)')};
  }
`;

const NavPill = styled(motion.span)`
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    120deg,
    rgba(var(--primary-rgb), 0.86),
    rgba(var(--secondary-rgb), 0.72)
  );
  box-shadow: var(--shadow-primary-soft);
  z-index: 0;
`;

const NavLabel = styled.span`
  position: relative;
  z-index: 1;
`;

const DesktopSearch = styled.div`
  grid-column: span 3;
  display: flex;
  justify-self: end;
  width: 100%;
  max-width: clamp(220px, 24vw, 340px);

  @media (max-width: 1200px) {
    grid-column: span 4;
    max-width: 100%;
  }

  @media (max-width: 992px) {
    grid-column: span 4;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionGroup = styled.div`
  grid-column: span 2;
  display: flex;
  align-items: center;
  justify-self: end;
  gap: var(--spacing-sm);

  @media (max-width: 992px) {
    grid-column: span 3;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchForm = styled.form`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  background-color: var(--field-bg);
  border: 1px solid var(--border-subtle);
  border-radius: var(--border-radius-pill);
  padding: var(--spacing-sm) var(--spacing-md);
  padding-left: 2.5rem;
  width: 100%;
  color: var(--text-primary);
  transition: var(--transition);

  &:focus {
    background-color: var(--field-bg-focus);
    border-color: var(--primary-color);
  }

  @media (max-width: 768px) {
    width: 100%;

    &:focus {
      width: 100%;
    }
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  top: 50%;
  left: var(--spacing-sm-plus);
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
`;

const ScrollProgress = styled(motion.div)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  transform-origin: 0 50%;
  background: var(--divider-gradient);
  opacity: 0;
  pointer-events: none;
`;

const LoginButton = styled(Link).attrs({
  'data-pressable': true,
})`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-color);
    color: var(--text-on-primary);
  }
`;

const ThemeButton = styled.button.attrs({ 'data-pressable': true, 'data-focus-guide': true })`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--control-border);
  background: var(--control-bg);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    background: var(--control-bg-hover);
  }

  &:active {
    transform: translateY(0px) scale(0.96);
  }
`;

const CommandButton = styled(ThemeButton)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button.attrs({ 'data-pressable': true })`
  display: none;
  font-size: var(--text-4xl);
  color: var(--text-primary);
  justify-self: end;

  @media (max-width: 768px) {
    display: flex;
    grid-column: 11 / -1;
  }
`;

const MobileMenu = styled(motion.nav)`
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--header-height));
  background: var(--surface-ink);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: var(--spacing-xl);
  z-index: 99;
  border-top: 1px solid var(--border-subtle);
  backdrop-filter: blur(16px);
`;

const MobileNavLinks = styled.ul.attrs({ 'data-divider': 'list', role: 'list' })`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  width: 100%;
`;

const MobileNavLink = styled(Link).attrs({ 'data-pressable': true })`
  font-size: var(--text-4xl);
  font-weight: 500;
  color: ${(props) => (props.$active ? 'var(--primary-color)' : 'var(--text-secondary)')};

  &:hover {
    color: var(--primary-color);
  }
`;

const MobileLoginButton = styled(Link).attrs({ 'data-pressable': true })`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 80%;
  padding: var(--spacing-sm-plus) 0;
  border-radius: var(--border-radius-md);
  background-color: var(--primary-color);
  color: var(--text-on-primary);
  font-weight: 500;
  margin-top: var(--spacing-xl);

  &:hover {
    background-color: var(--primary-color);
    filter: brightness(1.05);
  }
`;

const navItems = [
  { title: '首页', path: '/' },
  { title: '国漫推荐', path: '/recommendations' },
  { title: '收藏', path: '/favorites' },
  { title: '追更', path: '/following' },
  { title: '排行榜', path: '/rankings' },
  { title: '最新资讯', path: '/news' },
  { title: '关于我们', path: '/about' },
  { title: 'PRO', path: '/pro' },
  { title: '用户中心', path: '/profile' },
];

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => getCurrentTheme());
  const { signal: themeSignal } = useStorageSignal([STORAGE_KEYS.theme]);
  const proEnabled = useIsProEnabled();
  const reducedMotion = useAppReducedMotion();
  const { scrollYProgress } = useScroll();
  const springScrollProgress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 40,
    mass: 0.2,
  });
  const [shortcutSettings] = usePersistedState(
    STORAGE_KEYS.shortcuts,
    { enabled: true },
    {
      serialize: (value) => JSON.stringify(value),
      deserialize: (raw) => safeJsonParse(raw, { enabled: true }),
    },
  );
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navGlowRef = useRef(null);
  const desktopSearchId = useId();
  const mobileSearchId = useId();
  const location = useLocation();
  const navigate = useNavigate();

  usePointerGlow(navGlowRef, { disabled: reducedMotion });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // 关闭移动菜单当路由改变时
    setIsMobileMenuOpen(false);
    setIsPaletteOpen(false);
  }, [location]);

  useEffect(() => {
    if (!location.pathname.startsWith('/search')) return;
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const body = document.body;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;

      window.scrollTo(0, scrollY);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      setIsMobileMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);

    const timeoutId = window.setTimeout(() => {
      mobileSearchRef.current?.focus?.();
    }, 0);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(timeoutId);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const menu = mobileMenuRef.current;
    if (!menu) return undefined;

    const focusableSelector =
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(menu.querySelectorAll(focusableSelector)).filter(
        (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
      );

    const onKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const isInMenu = active instanceof HTMLElement ? menu.contains(active) : false;

      if (e.shiftKey) {
        if (!isInMenu || active === first) {
          e.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    menu.addEventListener('keydown', onKeyDown);
    return () => menu.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!shortcutSettings?.enabled) return undefined;
    const onKeyDown = (e) => {
      const key = String(e.key || '').toLowerCase();
      const modifier = e.ctrlKey || e.metaKey;

      if (!modifier || key !== 'k') return;

      const target = e.target;
      const tagName = target?.tagName?.toLowerCase?.();
      const isEditable =
        tagName === 'input' ||
        tagName === 'textarea' ||
        tagName === 'select' ||
        target?.isContentEditable;

      if (isEditable) return;

      e.preventDefault();

      if (isMobileMenuOpen) {
        mobileSearchRef.current?.focus?.();
        return;
      }

      const isMobile = window.matchMedia?.('(max-width: 768px)')?.matches;
      if (isMobile) {
        setIsMobileMenuOpen(true);
        return;
      }

      setIsPaletteOpen((prev) => !prev);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen, shortcutSettings?.enabled]);

  useEffect(() => {
    void themeSignal;
    setTheme(getCurrentTheme());
  }, [themeSignal]);

  const isRouteActive = (targetPath) => {
    if (targetPath === '/') return location.pathname === '/';
    return location.pathname === targetPath || location.pathname.startsWith(`${targetPath}/`);
  };

  const runSearch = () => {
    const q = searchQuery.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    runSearch();
  };

  const handleToggleTheme = useCallback(() => {
    const next = toggleTheme();
    setTheme(next);
  }, []);

  const paletteActions = useMemo(() => {
    const action = (id, title, description, keywords, icon, run) => ({
      id,
      title,
      description,
      keywords,
      icon,
      meta: 'Enter',
      run,
    });

    return [
      action('nav.home', '前往首页', '回到精选首页', ['首页', 'home', '/'], <FiHome />, () =>
        navigate('/'),
      ),
      action(
        'nav.recommendations',
        '国漫推荐',
        '打开推荐页面',
        ['推荐', 'recommendations'],
        <FiCompass />,
        () => navigate('/recommendations'),
      ),
      action('nav.favorites', '收藏', '查看我的收藏列表', ['收藏', 'favorites'], <FiHeart />, () =>
        navigate('/favorites'),
      ),
      action(
        'nav.following',
        '追更中心',
        '管理追更与提醒设置',
        ['追更', 'following', 'reminder', '通知'],
        <FiBell />,
        () => navigate('/following'),
      ),
      action(
        'nav.pro',
        '会员与赞助',
        '开启 PRO 视觉与权益模型（本地演示）',
        ['pro', '会员', '赞助', 'pricing', 'support'],
        <FiAward />,
        () => navigate('/pro'),
      ),
      action(
        'nav.insights',
        '足迹中心',
        '查看播放/下载/分享足迹与留存概览',
        ['足迹', 'insights', 'activity', '留存', '增长'],
        <FiActivity />,
        () => navigate('/insights'),
      ),
      action(
        'nav.posters',
        '海报工坊',
        '生成分享海报并管理历史（SVG）',
        ['海报', 'poster', 'share', 'svg', '裂变'],
        <FiShare2 />,
        () => navigate('/posters'),
      ),
      action(
        'nav.achievements',
        '成就中心',
        '查看成就进度条与解锁状态',
        ['成就', 'achievements', 'badge'],
        <FiAward />,
        () => navigate('/achievements'),
      ),
      action(
        'nav.rankings',
        '排行榜',
        '查看评分/人气排行',
        ['排行', 'rankings'],
        <FiTrendingUp />,
        () => navigate('/rankings'),
      ),
      action('nav.news', '最新资讯', '打开资讯列表', ['资讯', 'news'], <FiBookOpen />, () =>
        navigate('/news'),
      ),
      action(
        'nav.search',
        '打开搜索',
        '前往搜索页（也可直接输入关键词）',
        ['搜索', 'search'],
        <FiSearch />,
        () => navigate('/search'),
      ),
      action(
        'nav.profile',
        '用户中心',
        '管理本地数据与偏好',
        ['用户中心', 'profile', '设置', 'settings'],
        <FiUser />,
        () => navigate('/profile'),
      ),
      action(
        'nav.diagnostics',
        '诊断面板',
        '查看本地健康快照（性能/错误/存储/SW）',
        ['诊断', 'diagnostics', 'health', '性能', '错误', '存储'],
        <FiActivity />,
        () => navigate('/diagnostics'),
      ),
      action('nav.about', '关于我们', '项目介绍与设计理念', ['关于', 'about'], <FiInfo />, () =>
        navigate('/about'),
      ),
      action(
        'nav.login',
        '登录 / 注册',
        '进入账号页（占位）',
        ['登录', '注册', 'login'],
        <FiLogIn />,
        () => navigate('/login'),
      ),
      action(
        'theme.toggle',
        theme === 'dark' ? '切换到浅色主题' : '切换到深色主题',
        '立即切换主题并持久化',
        ['主题', 'theme', 'dark', 'light'],
        theme === 'dark' ? <FiSun /> : <FiMoon />,
        handleToggleTheme,
      ),
    ];
  }, [handleToggleTheme, navigate, theme]);

  return (
    <HeaderContainer
      $scrolled={isScrolled}
      aria-label="站点顶部导航"
      aria-describedby="guoman-header-desc"
    >
      <ScrollProgress
        aria-hidden="true"
        style={{ scaleX: reducedMotion ? scrollYProgress : springScrollProgress }}
        initial={false}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
      />
      <span id="guoman-header-desc" className="sr-only">
        包含主导航、站内搜索、登录入口与主题切换。
      </span>
      <HeaderInner>
        <Logo to="/">
          <img
            src={logoSvg}
            alt="国漫世界 Logo"
            decoding="async"
            loading="eager"
            width="40"
            height="40"
          />
          <span className="logo-title">国漫世界</span>
          {proEnabled ? (
            <ProBadge
              initial={reducedMotion ? false : { opacity: 0, y: -4 }}
              animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.25 }}
              aria-label="PRO 已启用"
              title="PRO 模式已启用"
            >
              PRO
            </ProBadge>
          ) : null}
        </Logo>

        <Nav ref={navGlowRef} data-pointer-glow aria-label="主导航">
          <LayoutGroup id="guoman-nav">
            <NavLinks>
              {navItems.map((item) => {
                const active = isRouteActive(item.path);

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      $active={active}
                      aria-current={active ? 'page' : undefined}
                      onMouseEnter={() => prefetchRoute(item.path)}
                      onFocus={() => prefetchRoute(item.path)}
                    >
                      {active ? (
                        <NavPill
                          layoutId="guoman-nav-pill"
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : { type: 'spring', stiffness: 560, damping: 46 }
                          }
                        />
                      ) : null}
                      <NavLabel>{item.title}</NavLabel>
                    </NavLink>
                  </li>
                );
              })}
            </NavLinks>
          </LayoutGroup>
        </Nav>

        <DesktopSearch>
          <SearchForm role="search" aria-label="站内搜索" onSubmit={handleSearchSubmit}>
            <label className="sr-only" htmlFor={desktopSearchId}>
              搜索国漫
            </label>
            <span id="guoman-search-hint-desktop" className="sr-only">
              快捷键 Ctrl/⌘ + K 打开命令面板，可快速搜索与跳转页面
            </span>
            <SearchInput
              ref={desktopSearchRef}
              id={desktopSearchId}
              type="search"
              name="q"
              placeholder="搜索国漫...（Ctrl/⌘ + K 命令面板）"
              aria-label="搜索国漫"
              aria-keyshortcuts="Control+K Meta+K"
              aria-describedby="guoman-search-hint-desktop"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon />
          </SearchForm>
        </DesktopSearch>

        <ActionGroup>
          <CommandButton
            type="button"
            onClick={() => setIsPaletteOpen(true)}
            aria-label="打开命令面板"
            title="命令面板（Ctrl/⌘ + K）"
            aria-pressed={isPaletteOpen}
          >
            <FiCommand />
          </CommandButton>

          <LoginButton
            to="/login"
            onMouseEnter={() => prefetchRoute('/login')}
            onFocus={() => prefetchRoute('/login')}
          >
            <FiUser />
            登录/注册
          </LoginButton>

          <ThemeButton
            type="button"
            onClick={handleToggleTheme}
            aria-label={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
            title={theme === 'dark' ? '浅色主题' : '深色主题'}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </ThemeButton>
        </ActionGroup>

        <MobileMenuButton
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={isMobileMenuOpen}
          aria-pressed={isMobileMenuOpen}
          aria-controls="guoman-mobile-menu"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
      </HeaderInner>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            id="guoman-mobile-menu"
            role="navigation"
            aria-label="移动端菜单"
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SearchForm
              role="search"
              aria-label="站内搜索"
              onSubmit={handleSearchSubmit}
              style={{ margin: '0 0 var(--spacing-xl) 0', width: '80%' }}
            >
              <label className="sr-only" htmlFor={mobileSearchId}>
                搜索国漫
              </label>
              <span id="guoman-search-hint-mobile" className="sr-only">
                快捷键 Ctrl/⌘ + K 打开命令面板，可快速搜索与跳转页面
              </span>
              <SearchInput
                ref={mobileSearchRef}
                id={mobileSearchId}
                type="search"
                name="q"
                placeholder="搜索国漫...（Ctrl/⌘ + K 命令面板）"
                aria-label="搜索国漫"
                aria-keyshortcuts="Control+K Meta+K"
                aria-describedby="guoman-search-hint-mobile"
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%' }}
              />
              <SearchIcon />
            </SearchForm>

            <ThemeButton
              type="button"
              onClick={handleToggleTheme}
              aria-label={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
              title={theme === 'dark' ? '浅色主题' : '深色主题'}
              aria-pressed={theme === 'dark'}
              style={{ marginLeft: 0, marginBottom: 'var(--spacing-lg-compact)' }}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </ThemeButton>

            <MobileNavLinks>
              {navItems.map((item) => {
                const active = isRouteActive(item.path);

                return (
                  <li key={item.path}>
                    <MobileNavLink
                      to={item.path}
                      $active={active}
                      aria-current={active ? 'page' : undefined}
                      onMouseEnter={() => prefetchRoute(item.path)}
                      onFocus={() => prefetchRoute(item.path)}
                    >
                      {item.title}
                    </MobileNavLink>
                  </li>
                );
              })}
            </MobileNavLinks>

            <MobileLoginButton
              to="/login"
              onMouseEnter={() => prefetchRoute('/login')}
              onFocus={() => prefetchRoute('/login')}
            >
              <FiUser />
              登录/注册
            </MobileLoginButton>
          </MobileMenu>
        )}
      </AnimatePresence>

      {isPaletteOpen ? (
        <CommandPalette
          open={isPaletteOpen}
          onClose={() => setIsPaletteOpen(false)}
          actions={paletteActions}
          onSearch={(q) => {
            const next = String(q || '').trim();
            setSearchQuery(next);
            navigate(next ? `/search?q=${encodeURIComponent(next)}` : '/search');
          }}
        />
      ) : null}
    </HeaderContainer>
  );
}

export default Header;
