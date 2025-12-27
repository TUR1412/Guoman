import styled from 'styled-components';

const Card = styled.div.attrs((p) => ({
  'data-card': true,
  'data-divider': p.$divider || p['data-divider'] || 'card',
  'data-elev': p.$elev === null || p.$elev === undefined ? p['data-elev'] : String(p.$elev),
  'data-parallax': p.$parallax ? true : p['data-parallax'],
}))`
  border-radius: var(--border-radius-lg);
  position: relative;
  overflow: hidden;
`;

export default Card;
