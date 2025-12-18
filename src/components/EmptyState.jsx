import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  display: grid;
  place-items: center;
  padding: var(--spacing-3xl) 0;
`;

const Card = styled.div`
  width: min(680px, 100%);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--surface-glass);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-2xl);
  backdrop-filter: blur(14px);
  text-align: center;
`;

const Icon = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto var(--spacing-lg);
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(255, 77, 77, 0.18), rgba(126, 34, 206, 0.14));
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-primary);
`;

const Title = styled.h2`
  font-size: 1.4rem;
  margin-bottom: var(--spacing-sm);
`;

const Desc = styled.p`
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const PrimaryLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--primary-color);
  background: rgba(255, 77, 77, 0.12);
  color: var(--text-primary);
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 77, 77, 0.16);
    box-shadow: var(--shadow-glow);
  }
`;

const SecondaryLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.1);
  }
`;

function EmptyState({ icon, title, description, primaryAction, secondaryAction }) {
  return (
    <Wrap>
      <Card>
        {icon && <Icon>{icon}</Icon>}
        {title && <Title>{title}</Title>}
        {description && <Desc>{description}</Desc>}
        {(primaryAction || secondaryAction) && (
          <Actions>
            {primaryAction && (
              <PrimaryLink href={primaryAction.href}>{primaryAction.label}</PrimaryLink>
            )}
            {secondaryAction && (
              <SecondaryLink href={secondaryAction.href}>{secondaryAction.label}</SecondaryLink>
            )}
          </Actions>
        )}
      </Card>
    </Wrap>
  );
}

export default EmptyState;
