import styled from 'styled-components';

const toCssSize = (value, fallback) => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'number') return `${value}px`;
  return String(value);
};

const Grid = styled.div.attrs((p) => ({
  'data-divider': p.$divider ? 'grid' : p['data-divider'],
}))`
  display: grid;
  grid-template-columns: repeat(${(p) => Math.max(1, Number(p.$columns) || 12)}, minmax(0, 1fr));
  gap: ${(p) => toCssSize(p.$gap, 'var(--spacing-lg)')};
  align-items: ${(p) => p.$align || 'stretch'};
`;

export default Grid;
