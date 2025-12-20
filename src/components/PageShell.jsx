import React, { useId } from 'react';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import { usePageMeta } from '../utils/pageMeta';

const Page = styled(motion.section)`
  padding: var(--spacing-3xl) 0;
  min-height: calc(100vh - var(--header-height));
`;

const Inner = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
`;

const Header = styled.div.attrs({ 'data-parallax': true })`
  display: grid;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      240px 160px at 10% 0%,
      var(--primary-soft),
      transparent 60%
    );
    opacity: 0.6;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--divider-gradient);
    opacity: 0.9;
  }
`;

const TitleRow = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const TitleStack = styled.div`
  display: grid;
  gap: var(--spacing-sm);
  grid-column: span 8;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

const Title = styled.h1`
  font-size: var(--text-8xl);
  line-height: var(--leading-tight);
  letter-spacing: 0.02em;

  @media (max-width: 768px) {
    font-size: var(--text-5xl);
  }
`;

const HeaderBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-wide);
  padding: var(--spacing-xs-plus) 0.85rem;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--stamp-border);
  background: var(--stamp-bg);
  color: var(--stamp-text);
  font-size: var(--text-xs);
  font-weight: 700;
  box-shadow: var(--shadow-stamp);
  width: fit-content;
  margin-bottom: var(--spacing-sm);
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  max-width: 70ch;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  grid-column: span 4;

  & > *:first-child {
    animation: focusPulse 2.4s ease-out 1;
  }

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
`;

const Content = styled.div.attrs({ 'data-stagger': true, 'data-divider': 'list' })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-2xl);

  & > * {
    grid-column: 1 / -1;
  }
`;

function PageShell({ title, subtitle, actions, badge, meta, children }) {
  const reducedMotion = useReducedMotion();
  const titleId = useId();
  const subtitleId = useId();
  usePageMeta({ title, description: subtitle });

  const pageMotion = reducedMotion
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 1, y: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.25 },
      };

  return (
    <Page
      {...pageMotion}
      layout
      role="region"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      <Inner>
        {(title || subtitle || actions) && (
          <Header>
            <TitleRow>
              <TitleStack>
                {badge ? <HeaderBadge>{badge}</HeaderBadge> : null}
                {title && <Title id={titleId}>{title}</Title>}
                {subtitle && <Subtitle id={subtitleId}>{subtitle}</Subtitle>}
                {meta ? <MetaRow>{meta}</MetaRow> : null}
              </TitleStack>
              {actions && <Actions>{actions}</Actions>}
            </TitleRow>
          </Header>
        )}
        <Content>{children}</Content>
      </Inner>
    </Page>
  );
}

export default PageShell;



