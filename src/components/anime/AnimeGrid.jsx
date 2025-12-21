import styled, { css } from 'styled-components';

export const AnimeGrid = styled.div.attrs({
  role: 'list',
  'data-stagger': true,
  'data-divider': 'grid',
  'aria-label': '作品列表',
})`
  display: grid;
  gap: var(--spacing-lg);
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));

  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--spacing-md);
  }

  ${(props) =>
    props.$bento &&
    css`
      grid-template-columns: repeat(12, minmax(0, 1fr));
      grid-auto-flow: dense;
      grid-auto-rows: minmax(220px, auto);

      & > * {
        grid-column: span 3;
      }

      & > *:nth-child(1) {
        grid-column: span 6;
        grid-row: span 2;
        box-shadow: var(--shadow-lg), var(--shadow-glow);
        border-color: var(--primary-soft-border);
      }

      & > *:nth-child(2) {
        grid-column: span 6;
      }

      & > *:nth-child(3),
      & > *:nth-child(4),
      & > *:nth-child(5) {
        grid-column: span 4;
      }

      @media (max-width: 992px) {
        grid-template-columns: repeat(6, minmax(0, 1fr));

        & > * {
          grid-column: span 3;
        }

        & > *:nth-child(1) {
          grid-column: span 6;
          grid-row: span 1;
        }

        & > *:nth-child(2) {
          grid-column: span 6;
        }
      }

      @media (max-width: 576px) {
        grid-template-columns: 1fr;
        grid-auto-rows: auto;

        & > * {
          grid-column: span 1;
          grid-row: auto;
        }
      }
    `}
`;
