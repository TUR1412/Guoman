import styled from 'styled-components';

export const DiagnosticsGrid = styled.div.attrs({ 'data-divider': 'grid' })`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--spacing-lg);
`;

export const DiagnosticsCard = styled.div.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  grid-column: span 6;
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  display: grid;
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    grid-column: 1 / -1;
  }
`;

export const DiagnosticsWideCard = styled(DiagnosticsCard)`
  grid-column: 1 / -1;
`;

export const DiagnosticsCardTitle = styled.h3`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-lg-plus);
  font-family: var(--font-display);
`;

export const DiagnosticsList = styled.div.attrs({ 'data-divider': 'list' })`
  display: grid;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
`;

export const DiagnosticsStatRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
  flex-wrap: wrap;
`;

export const DiagnosticsStatKey = styled.span`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

export const DiagnosticsStatValue = styled.span`
  color: var(--text-primary);
  font-weight: 700;
  font-size: var(--text-sm);
`;

export const DiagnosticsActions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

export const DiagnosticsActionButton = styled.button.attrs({ 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  transition: var(--transition);

  &:hover {
    background: var(--surface-soft-hover);
  }
`;

export const DiagnosticsProgressRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--spacing-md);
  align-items: center;
`;

export const DiagnosticsProgressTrack = styled.div`
  height: 10px;
  border-radius: 999px;
  border: 1px solid var(--border-subtle);
  background: var(--progress-track);
  overflow: hidden;
`;

export const DiagnosticsProgressFill = styled.div`
  height: 100%;
  width: var(--progress);
  background: linear-gradient(
    90deg,
    rgba(var(--primary-rgb), 0.58),
    rgba(var(--secondary-rgb), 0.58)
  );
`;
