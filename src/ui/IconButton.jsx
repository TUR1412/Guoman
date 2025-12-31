import React from 'react';
import styled from 'styled-components';

import Button from './Button';

const IconButtonRoot = styled(Button)`
  min-width: 0;
  padding: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-pill);

  &[data-size='sm'] {
    width: 34px;
    height: 34px;
  }

  &[data-size='lg'] {
    width: 48px;
    height: 48px;
  }

  & > svg {
    display: block;
  }
`;

export function IconButton({ label, title, variant = 'ghost', size = 'md', ...props }) {
  const accessibleLabel = props['aria-label'] ?? label;
  const accessibleTitle = title ?? label;

  return (
    <IconButtonRoot
      aria-label={accessibleLabel}
      title={accessibleTitle}
      variant={variant}
      size={size}
      {...props}
    />
  );
}

export default IconButton;
