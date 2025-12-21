import React, { useId } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Wrap = styled.div`
  display: grid;
  place-items: center;
  padding: var(--spacing-3xl) 0;
`;

const Card = styled.div.attrs({ 'data-card': true, 'data-divider': 'card' })`
  width: min(680px, 100%);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--surface-glass);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-2xl);
  backdrop-filter: blur(14px);
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
  text-align: left;
`;

const Icon = styled.div`
  width: 56px;
  height: 56px;
  margin: 0;
  border-radius: var(--border-radius-lg);
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--primary-soft), var(--accent-soft));
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  grid-column: span 3;
  justify-self: start;
  align-self: start;

  @media (max-width: 576px) {
    grid-column: 1 / -1;
    justify-self: center;
  }
`;

const CardContent = styled.div`
  grid-column: span 9;
  display: grid;
  gap: var(--spacing-md);

  @media (max-width: 576px) {
    grid-column: 1 / -1;
  }
`;

const Title = styled.h2`
  font-size: var(--text-3xl);
`;

const Desc = styled.p`
  color: var(--text-secondary);
`;

const Actions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

const PrimaryLink = styled.a.attrs({
  'data-pressable': true,
  'data-focus-guide': true,
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm-plus) var(--spacing-lg-compact);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--primary-soft-border);
  background: var(--primary-soft);
  color: var(--text-primary);
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    background: var(--primary-soft-hover);
    box-shadow: var(--shadow-glow);
  }
`;

const SecondaryLink = styled.a.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm-plus) var(--spacing-lg-compact);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    transform: translateY(-1px);
    background: var(--surface-soft-hover);
  }
`;

function EmptyState({ icon, title, description, primaryAction, secondaryAction }) {
  const titleId = useId();
  const descId = useId();

  return (
    <Wrap>
      <Card
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
      >
        {icon && <Icon>{icon}</Icon>}
        <CardContent>
          {title && <Title id={titleId}>{title}</Title>}
          {description && <Desc id={descId}>{description}</Desc>}
          {(primaryAction || secondaryAction) && (
            <Actions>
              {primaryAction && (
                <PrimaryLink
                  as={primaryAction.to ? Link : 'a'}
                  to={primaryAction.to}
                  href={primaryAction.href}
                >
                  {primaryAction.label}
                </PrimaryLink>
              )}
              {secondaryAction && (
                <SecondaryLink
                  as={secondaryAction.to ? Link : 'a'}
                  to={secondaryAction.to}
                  href={secondaryAction.href}
                >
                  {secondaryAction.label}
                </SecondaryLink>
              )}
            </Actions>
          )}
        </CardContent>
      </Card>
    </Wrap>
  );
}

export default EmptyState;
