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
  --btn-sheen-a: rgba(var(--primary-rgb), 0.18);
  --btn-sheen-b: rgba(var(--secondary-rgb), 0.12);
  --btn-sheen-c: rgba(255, 255, 255, 0.1);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-phi-1);

  position: relative;
  z-index: 0;

  min-height: 40px;
  padding: 10px 14px;

  border-radius: var(--border-radius-md);
  border: 1px solid var(--btn-border);

  background: var(--btn-bg);
  color: var(--btn-text);
  font: inherit;
  line-height: 1;
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    z-index: -1;
    opacity: 0;
    transform: translateY(10px);
    background:
      radial-gradient(180px 80px at 20% 0%, var(--btn-sheen-a), transparent 72%),
      radial-gradient(220px 120px at 85% 100%, var(--btn-sheen-b), transparent 70%),
      linear-gradient(120deg, transparent 0%, var(--btn-sheen-c) 45%, transparent 90%);
    transition:
      opacity 220ms var(--ease-out),
      transform 320ms var(--ease-soft);
  }

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
    --btn-sheen-a: rgba(255, 255, 255, 0.26);
    --btn-sheen-b: rgba(255, 255, 255, 0.1);
    --btn-sheen-c: rgba(255, 255, 255, 0.12);
    box-shadow: var(--shadow-primary-soft);
  }

  &[data-variant='ghost'] {
    --btn-bg: transparent;
    --btn-bg-hover: var(--control-bg-hover);
    --btn-border: transparent;
    --btn-text: var(--text-primary);
    --btn-sheen-a: rgba(var(--primary-rgb), 0.12);
    --btn-sheen-b: rgba(var(--secondary-rgb), 0.1);
    --btn-sheen-c: rgba(255, 255, 255, 0.08);
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

    &:hover:not(:disabled)::before {
      opacity: 1;
      transform: translateY(0);
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

  &:focus-visible::before {
    opacity: 0.85;
    transform: translateY(0);
  }

  &:active:not(:disabled) {
    filter: brightness(0.985) saturate(1.01);
  }

  &[data-variant='primary']:active:not(:disabled) {
    filter: brightness(0.98) saturate(1.02);
  }

  &:disabled {
    cursor: not-allowed;
    background: var(--button-disabled-bg);
    border-color: transparent;
    color: var(--button-disabled-text);
    transform: none !important;
  }

  &:disabled::before {
    opacity: 0;
    transform: translateY(10px);
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
