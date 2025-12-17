import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

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

const ToastCard = styled(motion.div)`
  pointer-events: auto;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--surface-glass);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(14px);
  padding: 12px 12px;
  display: grid;
  grid-template-columns: 28px 1fr 28px;
  gap: 10px;
  align-items: start;
`;

const IconWrap = styled.div`
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

const Title = styled.div`
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
`;

const Message = styled.div`
  margin-top: 4px;
  color: var(--text-secondary);
  line-height: 1.4;
`;

const CloseButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.10);
  color: var(--text-secondary);
  transition: var(--transition);

  &:hover {
    background: rgba(0, 0, 0, 0.18);
    color: var(--text-primary);
  }

  &:active {
    transform: scale(0.96);
  }
`;

const VARIANTS = {
  success: { icon: <FiCheckCircle />, color: 'rgba(34, 197, 94, 0.55)' },
  info: { icon: <FiInfo />, color: 'rgba(59, 130, 246, 0.55)' },
  warning: { icon: <FiAlertTriangle />, color: 'rgba(245, 158, 11, 0.65)' },
};

const motionProps = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.98 },
  transition: { duration: 0.22 },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextIdRef = useRef(1);
  const timeoutIdsRef = useRef(new Map());

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      timeoutIdsRef.current.clear();
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
    ({ title, message, variant = 'info', durationMs = 2400 }) => {
      const id = nextIdRef.current++;
      const toast = { id, title, message, variant };

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
      success: (title, message) => push({ title, message, variant: 'success' }),
      info: (title, message) => push({ title, message, variant: 'info' }),
      warning: (title, message) => push({ title, message, variant: 'warning' }),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Host aria-live="polite" aria-relevant="additions removals" role="status">
        <AnimatePresence>
          {toasts.map((t) => {
            const meta = VARIANTS[t.variant] || VARIANTS.info;

            return (
              <ToastCard key={t.id} {...motionProps} style={{ borderColor: meta.color }}>
                <IconWrap style={{ borderColor: meta.color, color: meta.color }}>
                  {meta.icon}
                </IconWrap>
                <div>
                  <Title>{t.title}</Title>
                  {t.message ? <Message>{t.message}</Message> : null}
                </div>
                <CloseButton type="button" aria-label="关闭提示" onClick={() => remove(t.id)}>
                  <FiX />
                </CloseButton>
              </ToastCard>
            );
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

