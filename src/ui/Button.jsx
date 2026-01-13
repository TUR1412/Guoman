import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';
import { MOTION_SPRINGS } from '../motion/tokens';

const ButtonRoot = styled(motion.button)`
  --btn-bg: var(--control-bg);
  --btn-bg-hover: var(--control-bg-hover);
  --btn-border: var(--control-border);
  --btn-text: var(--text-primary);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-phi-1);

  min-height: 40px;
  padding: 10px 14px;

  border-radius: var(--border-radius-md);
  border: 1px solid var(--btn-border);

  background: var(--btn-bg);
  color: var(--btn-text);
  font: inherit;
  line-height: 1;
  will-change: transform;

  cursor: pointer;
  user-select: none;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;

  transition:
    background 160ms var(--ease-out),
    border-color 160ms var(--ease-out),
    box-shadow 160ms var(--ease-out),
    color 160ms var(--ease-out),
    filter 160ms var(--ease-out);

  &[data-variant='primary'] {
    --btn-bg: var(--primary-color);
    --btn-bg-hover: var(--primary-color);
    --btn-border: transparent;
    --btn-text: var(--text-on-primary, var(--text-on-dark));
    box-shadow: var(--shadow-primary-soft);
  }

  &[data-variant='ghost'] {
    --btn-bg: transparent;
    --btn-bg-hover: var(--control-bg-hover);
    --btn-border: transparent;
    --btn-text: var(--text-primary);
  }

  &[data-size='sm'] {
    min-height: 34px;
    padding: 8px 12px;
    font-size: var(--text-sm);
    border-radius: var(--border-radius-sm);
  }

  &[data-size='lg'] {
    min-height: 48px;
    padding: 12px 16px;
    font-size: var(--text-lg);
    border-radius: var(--border-radius-lg);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:disabled) {
      background: var(--btn-bg-hover);
      box-shadow: var(--shadow-elev-2);
    }

    &[data-variant='primary']:hover:not(:disabled) {
      box-shadow: var(--shadow-primary-hover);
      filter: brightness(1.06) saturate(1.02);
    }
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-ring);
  }

  &:disabled {
    cursor: not-allowed;
    background: var(--button-disabled-bg);
    border-color: transparent;
    color: var(--button-disabled-text);
    transform: none !important;
  }
`;

export function Button({
  type = 'button',
  variant = 'secondary',
  size = 'md',
  disabled = false,
  className,
  ...props
}) {
  const reducedMotion = useAppReducedMotion();

  const forwardedProps = {};
  Object.keys(props).forEach((key) => {
    if (key.startsWith('$')) return;
    forwardedProps[key] = props[key];
  });

  const useCssPressable = Boolean(props['data-pressable']);
  const interactionMotion =
    reducedMotion || disabled || useCssPressable
      ? {}
      : {
          whileHover: { y: -1, scale: 1.01 },
          whileTap: { y: 0, scale: 0.985 },
          transition: MOTION_SPRINGS.pressable,
        };

  return (
    <ButtonRoot
      type={type}
      className={className}
      disabled={disabled}
      data-variant={variant}
      data-size={size}
      {...interactionMotion}
      {...forwardedProps}
    />
  );
}

export default Button;
