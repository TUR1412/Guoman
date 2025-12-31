import styled from 'styled-components';

export const RangeInput = styled.input.attrs({ type: 'range' })`
  width: 100%;
  accent-color: var(--primary-color);
  cursor: pointer;
`;

export default RangeInput;
