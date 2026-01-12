import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { LayoutGroup, motion } from 'framer-motion';
import { FiBell, FiHeart, FiHome, FiSearch, FiUser } from './icons/feather';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';
import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_SPRINGS } from '../motion/tokens';

const Dock = styled(motion.nav)`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  z-index: 120;
  width: min(var(--max-width), calc(100% - 24px));
  padding: 8px 10px calc(8px + env(safe-area-inset-bottom));
  border-radius: calc(var(--border-radius-lg) + 8px);
  border: 1px solid var(--border-subtle);
  background: var(--surface-glass);
  box-shadow: var(--shadow-elev-6);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));

  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const DockList = styled.ul.attrs({ role: 'list' })`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
`;

const DockLink = styled(Link).attrs({ 'data-pressable': true })`
  position: relative;
  display: grid;
  place-items: center;
  gap: 4px;
  padding: 8px 6px;
  border-radius: var(--border-radius-lg);
  color: ${(p) => (p.$active ? 'var(--text-on-primary)' : 'var(--text-tertiary)')};
  transition: var(--transition);
  min-width: 0;

  &:hover {
    color: ${(p) => (p.$active ? 'var(--text-on-primary)' : 'var(--text-primary)')};
    background: ${(p) => (p.$active ? 'transparent' : 'var(--surface-soft-hover)')};
  }
`;

const ActivePill = styled(motion.span)`
  position: absolute;
  inset: 3px;
  border-radius: inherit;
  background: linear-gradient(
    120deg,
    rgba(var(--primary-rgb), 0.9),
    rgba(var(--secondary-rgb), 0.75)
  );
  box-shadow: var(--shadow-primary-soft);
  z-index: 0;
`;

const DockInner = styled.span`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  gap: 4px;
  min-width: 0;
`;

const DockIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-4xl);
  line-height: 1;
`;

const DockLabel = styled.span`
  font-size: var(--text-xxs);
  font-weight: 700;
  letter-spacing: 0.02em;
  opacity: 0.92;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const shouldTreatAsActive = (pathname, targetPath) => {
  if (targetPath === '/') return pathname === '/';
  return pathname === targetPath || pathname.startsWith(`${targetPath}/`);
};

function BottomNav() {
  const location = useLocation();
  const reducedMotion = useAppReducedMotion();

  const items = useMemo(
    () => [
      { title: '首页', path: '/', icon: FiHome },
      { title: '搜索', path: '/search', icon: FiSearch },
      { title: '收藏', path: '/favorites', icon: FiHeart },
      { title: '追更', path: '/following', icon: FiBell },
      { title: '我的', path: '/profile', icon: FiUser },
    ],
    [],
  );

  const hidden = useMemo(() => {
    const path = location.pathname || '/';
    return path.startsWith('/login') || path.startsWith('/forgot-password');
  }, [location.pathname]);

  const motionProps = useMemo(() => {
    if (reducedMotion) return { initial: false, animate: { opacity: 1, y: 0 } };
    return {
      initial: { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 14 },
      transition: { duration: MOTION_DURATIONS.base, ease: MOTION_EASINGS.out },
    };
  }, [reducedMotion]);

  if (hidden) return null;

  return (
    <Dock aria-label="底部导航" {...motionProps}>
      <LayoutGroup>
        <DockList>
          {items.map((item) => {
            const active = shouldTreatAsActive(location.pathname, item.path);
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <DockLink
                  to={item.path}
                  $active={active}
                  aria-current={active ? 'page' : undefined}
                >
                  {active ? (
                    <ActivePill
                      layoutId="guoman:bottom-nav:pill"
                      transition={reducedMotion ? { duration: 0 } : MOTION_SPRINGS.pressable}
                    />
                  ) : null}
                  <DockInner>
                    <DockIcon aria-hidden="true">
                      <Icon />
                    </DockIcon>
                    <DockLabel>{item.title}</DockLabel>
                  </DockInner>
                </DockLink>
              </li>
            );
          })}
        </DockList>
      </LayoutGroup>
    </Dock>
  );
}

export default BottomNav;
