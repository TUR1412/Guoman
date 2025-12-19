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

const Header = styled.div`
  display: grid;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  background: var(--surface-glass);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-lg);

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  max-width: 70ch;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const Content = styled.div`
  display: grid;
  gap: var(--spacing-2xl);
`;

function PageShell({ title, subtitle, actions, children }) {
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
      role="region"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={subtitle ? subtitleId : undefined}
    >
      <Inner>
        {(title || subtitle || actions) && (
          <Header>
            <TitleRow>
              <div>
                {title && <Title id={titleId}>{title}</Title>}
                {subtitle && <Subtitle id={subtitleId}>{subtitle}</Subtitle>}
              </div>
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
