import styled from 'styled-components';

export const AnimeGrid = styled.div.attrs({ role: 'list' })`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--spacing-md);
  }
`;
