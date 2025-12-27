import styled from 'styled-components';

const toCssSize = (value, fallback) => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'number') return `${value}px`;
  return String(value);
};

const Stack = styled.div`
  display: ${(p) => (p.$inline ? 'inline-flex' : 'flex')};
  flex-direction: ${(p) => p.$direction || 'column'};
  align-items: ${(p) => p.$align || 'stretch'};
  justify-content: ${(p) => p.$justify || 'flex-start'};
  flex-wrap: ${(p) => (p.$wrap ? 'wrap' : 'nowrap')};
  gap: ${(p) => toCssSize(p.$gap, 'var(--spacing-md)')};
`;

export default Stack;
