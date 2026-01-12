import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from './icons/feather';

import ConfettiBurst from './ConfettiBurst';
import { getToastMotion } from '../motion/presets';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';

const ToastContext = createContext(null);

const Host = styled.div`
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 10001;
  display: grid;
  gap: 10px;
  width: min(380px, calc(100vw - 32px));
  pointer-events: none;
`;

const ToastCard = styled(motion.div).attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '6',
})`
  pointer-events: auto;
  border-radius: var(--border-radius-lg);
  padding: 12px 12px;
  position: relative;
  overflow: visible;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 10px;
  align-items: start;
`;

const IconWrap = styled.div`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: var(--border-radius-md);
  background: var(--chip-bg);
  border: 1px solid var(--chip-border);
  grid-column: span 1;
`;

const ToastContent = styled.div`
  grid-column: span 10;
`;

const Title = styled.div`
  font-weight: 800;
  color: var(--text-primary);
  line-height: var(--leading-tight);
`;

const Message = styled.div`
  margin-top: 4px;
  color: var(--text-secondary);
  line-height: var(--leading-snug-plus);
`;

const CloseButton = styled.button.attrs({ 'data-pressable': true })`
  --pressable-scale-active: 0.96;

  width: 28px;
  height: 28px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-secondary);
  transition: var(--transition);
  grid-column: span 1;
  justify-self: end;

  &:hover {
    background: var(--chip-bg-hover);
    color: var(--text-primary);
  }
`;

const VARIANTS = {
  success: { icon: <FiCheckCircle />, color: 'var(--success-color)' },
  info: { icon: <FiInfo />, color: 'var(--info-color)' },
  warning: { icon: <FiAlertTriangle />, color: 'var(--warning-color)' },
};

function ToastItem({ toast, meta, onRemove }) {
  const reducedMotion = useAppReducedMotion();
  const [burstKey, setBurstKey] = useState(null);
  const motionProps = getToastMotion(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return undefined;
    if (toast.variant !== 'success') return undefined;
    if (!toast.celebrate) return undefined;

    setBurstKey(`${toast.id}:${Date.now()}`);
    const t = window.setTimeout(() => setBurstKey(null), 900);
    return () => window.clearTimeout(t);
  }, [reducedMotion, toast.celebrate, toast.id, toast.variant]);

  return (
    <ToastCard {...motionProps} style={{ borderColor: meta.color }}>
      {burstKey ? <ConfettiBurst seed={toast.id} /> : null}
      <IconWrap style={{ borderColor: meta.color, color: meta.color }}>{meta.icon}</IconWrap>
      <ToastContent>
        <Title>{toast.title}</Title>
        {toast.message ? <Message>{toast.message}</Message> : null}
      </ToastContent>
      <CloseButton type="button" aria-label="关闭提示" onClick={() => onRemove(toast.id)}>
        <FiX />
      </CloseButton>
    </ToastCard>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextIdRef = useRef(1);
  const timeoutIdsRef = useRef(new Map());

  useEffect(() => {
    const timeouts = timeoutIdsRef.current;
    return () => {
      timeouts.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeouts.clear();
    };
  }, []);

  const remove = useCallback((id) => {
    const timeoutId = timeoutIdsRef.current.get(id);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutIdsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    ({ title, message, variant = 'info', durationMs = 2400, celebrate = false } = {}) => {
      if (!title) return;
      const id = nextIdRef.current++;
      const toast = { id, title, message, variant, celebrate: Boolean(celebrate) };

      setToasts((prev) => {
        const next = [toast, ...prev];
        const kept = next.slice(0, 3);
        const removed = next.slice(3);

        removed.forEach((t) => {
          const timeoutId = timeoutIdsRef.current.get(t.id);
          if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutIdsRef.current.delete(t.id);
          }
        });

        return kept;
      });

      const timeoutId = window.setTimeout(() => remove(id), durationMs);
      timeoutIdsRef.current.set(id, timeoutId);
    },
    [remove],
  );

  const api = useMemo(
    () => ({
      push,
      success: (title, message, options) =>
        push({ title, message, variant: 'success', ...(options || {}) }),
      info: (title, message, options) =>
        push({ title, message, variant: 'info', ...(options || {}) }),
      warning: (title, message, options) =>
        push({ title, message, variant: 'warning', ...(options || {}) }),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Host
        aria-live="polite"
        aria-relevant="additions removals"
        aria-atomic="true"
        role="status"
        aria-label="全局提示"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const meta = VARIANTS[t.variant] || VARIANTS.info;

            return <ToastItem key={t.id} toast={t} meta={meta} onRemove={remove} />;
          })}
        </AnimatePresence>
      </Host>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast 必须在 <ToastProvider> 内使用');
  }
  return ctx;
}
