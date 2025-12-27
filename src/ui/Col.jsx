import styled from 'styled-components';

const Col = styled.div`
  grid-column: span ${(p) => Math.max(1, Math.min(12, Number(p.$span) || 12))};
`;

export default Col;
