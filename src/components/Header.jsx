import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX, FiSearch, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import logoSvg from '../assets/images/logo.svg';
import { getCurrentTheme, toggleTheme } from '../utils/theme';

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
`;

const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--spacing-lg);
  max-width: var(--max-width);
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    height: 32px;
  }

  span {
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  @media (max-width: 576px) {
    span {
      display: none;
    }
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  gap: var(--spacing-lg);
`;

const NavLink = styled(Link)`
  position: relative;
  font-weight: 500;
  color: ${(props) => (props.$active ? 'var(--primary-color)' : 'var(--text-secondary)')};

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${(props) => (props.$active ? '100%' : '0')};
    height: 2px;
    background-color: var(--primary-color);
    transition: var(--transition);
  }

  &:hover {
    color: var(--primary-color);

    &::after {
      width: 100%;
    }
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-left: var(--spacing-lg);
`;

const SearchInput = styled.input`
  background-color: var(--field-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  padding-left: 2.5rem;
  width: 200px;
  color: var(--text-primary);
  transition: var(--transition);

  &:focus {
    background-color: var(--field-bg-focus);
    border-color: var(--primary-color);
    width: 250px;
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
  left: 0.75rem;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
`;

const LoginButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-md);
  background-color: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
  margin-left: var(--spacing-lg);
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
`;

const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  margin-left: var(--spacing-md);
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: translateY(0px) scale(0.96);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  font-size: 1.5rem;
  color: var(--text-primary);

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--header-height));
  background-color: var(--dark-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: var(--spacing-xl);
  z-index: 99;
`;

const MobileNavLinks = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  width: 100%;
`;

const MobileNavLink = styled(Link)`
  font-size: 1.5rem;
  font-weight: 500;
  color: ${(props) => (props.$active ? 'var(--primary-color)' : 'var(--text-secondary)')};

  &:hover {
    color: var(--primary-color);
  }
`;

const MobileLoginButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 80%;
  padding: 0.75rem 0;
  border-radius: var(--border-radius-md);
  background-color: var(--primary-color);
  color: white;
  font-weight: 500;
  margin-top: var(--spacing-xl);

  &:hover {
    background-color: #e64545;
  }
`;

const navItems = [
  { title: '首页', path: '/' },
  { title: '国漫推荐', path: '/recommendations' },
  { title: '收藏', path: '/favorites' },
  { title: '排行榜', path: '/rankings' },
  { title: '最新资讯', path: '/news' },
  { title: '关于我们', path: '/about' },
];

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => getCurrentTheme());
  const location = useLocation();
  const navigate = useNavigate();

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
  }, [location]);

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== 'guoman.theme') return;
      setTheme(getCurrentTheme());
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isRouteActive = (targetPath) => {
    if (targetPath === '/') return location.pathname === '/';
    return location.pathname === targetPath || location.pathname.startsWith(`${targetPath}/`);
  };

  const runSearch = () => {
    const q = searchQuery.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runSearch();
    }
  };

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setTheme(next);
  };

  return (
    <HeaderContainer $scrolled={isScrolled}>
      <HeaderInner>
        <Logo to="/">
          <img src={logoSvg} alt="国漫世界 Logo" />
          <span>国漫世界</span>
        </Logo>

        <Nav>
          <NavLinks>
            {navItems.map((item) => {
              const active = isRouteActive(item.path);

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    $active={active}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.title}
                  </NavLink>
                </li>
              );
            })}
          </NavLinks>

          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="搜索国漫..."
              aria-label="搜索国漫"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <SearchIcon />
          </SearchContainer>

          <LoginButton to="/login">
            <FiUser />
            登录/注册
          </LoginButton>

          <ThemeButton
            type="button"
            onClick={handleToggleTheme}
            aria-label={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
            title={theme === 'dark' ? '浅色主题' : '深色主题'}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </ThemeButton>
        </Nav>

        <MobileMenuButton
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? '关闭菜单' : '打开菜单'}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
      </HeaderInner>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SearchContainer style={{ margin: '0 0 2rem 0', width: '80%' }}>
              <SearchInput
                type="text"
                placeholder="搜索国漫..."
                aria-label="搜索国漫"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                style={{ width: '100%' }}
              />
              <SearchIcon />
            </SearchContainer>

            <ThemeButton
              type="button"
              onClick={handleToggleTheme}
              aria-label={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
              title={theme === 'dark' ? '浅色主题' : '深色主题'}
              style={{ marginLeft: 0, marginBottom: '1.25rem' }}
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
                    >
                      {item.title}
                    </MobileNavLink>
                  </li>
                );
              })}
            </MobileNavLinks>

            <MobileLoginButton to="/login">
              <FiUser />
              登录/注册
            </MobileLoginButton>
          </MobileMenu>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
}

export default Header;
