import React, { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { getModalBackdropMotion, getModalPanelMotion } from '../motion/presets';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';

export const DialogBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: var(--dialog-z, 10000);
  background: var(--overlay-strong);
  backdrop-filter: blur(var(--dialog-backdrop-blur, 10px));
  display: grid;
  place-items: var(--dialog-place-items, center);
  padding: var(--dialog-padding, var(--spacing-lg));
`;

export const DialogPanel = styled(motion.div).attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '8',
})`
  width: min(var(--dialog-panel-width, 720px), 100%);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  background: var(--surface-ink);
  box-shadow: var(--shadow-lg);
  outline: none;
`;

function tryFocus(el) {
  if (!el) return;
  if (!(el instanceof HTMLElement)) return;
  try {
    el.focus({ preventScroll: true });
  } catch {
    el.focus();
  }
}

function assignRef(ref, value) {
  if (!ref) return;
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  if (typeof ref === 'object') {
    ref.current = value;
  }
}

export default function Dialog({
  open,
  onClose,
  ariaLabel,
  children,
  closeOnBackdrop = true,
  restoreFocus = true,
  initialFocusRef,
  backdropProps,
  panelProps,
  panelRef: externalPanelRef,
}) {
  const reducedMotion = useAppReducedMotion();
  const localPanelRef = useRef(null);
  const lastActiveRef = useRef(null);

  const motionBackdrop = useMemo(() => getModalBackdropMotion(reducedMotion), [reducedMotion]);
  const motionPanel = useMemo(() => getModalPanelMotion(reducedMotion), [reducedMotion]);

  useEffect(() => {
    if (!open) return undefined;
    if (typeof document === 'undefined') return undefined;

    lastActiveRef.current = document.activeElement;
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const focusTarget = initialFocusRef?.current || localPanelRef.current;
    const t = window.setTimeout(() => tryFocus(focusTarget), 0);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(t);
      body.style.overflow = prevOverflow;
    };
  }, [initialFocusRef, onClose, open]);

  const onExitComplete = () => {
    if (!restoreFocus) return;
    tryFocus(lastActiveRef.current);
  };

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open ? (
        <DialogBackdrop
          {...motionBackdrop}
          {...(backdropProps || {})}
          role="presentation"
          onMouseDown={(event) => {
            backdropProps?.onMouseDown?.(event);
            if (!closeOnBackdrop) return;
            if (event.target === event.currentTarget) {
              onClose?.();
            }
          }}
        >
          <DialogPanel
            {...motionPanel}
            {...(panelProps || {})}
            ref={(node) => {
              localPanelRef.current = node;
              assignRef(externalPanelRef, node);
            }}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            tabIndex={-1}
            onMouseDown={(event) => {
              panelProps?.onMouseDown?.(event);
              event.stopPropagation();
            }}
          >
            {children}
          </DialogPanel>
        </DialogBackdrop>
      ) : null}
    </AnimatePresence>
  );
}
