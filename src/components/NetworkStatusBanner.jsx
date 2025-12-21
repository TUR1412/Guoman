import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiAlertTriangle, FiWifiOff, FiX } from 'react-icons/fi';

const Wrap = styled(motion.div).attrs({ 'data-card': true, 'data-divider': 'card' })`
  position: fixed;
  top: calc(var(--header-height) + 12px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: min(760px, calc(100vw - 32px));
  padding: 12px 14px;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-subtle);
  background: var(--surface-glass);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(14px);
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 12px;
  align-items: center;
`;

const Icon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  display: grid;
  place-items: center;
  color: var(--text-secondary);
`;

const Text = styled.div`
  display: grid;
  gap: 2px;
`;

const Title = styled.div`
  font-weight: 900;
  color: var(--text-primary);
  line-height: var(--leading-tight);
`;

const Desc = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  line-height: var(--leading-snug-plus);
`;

const Close = styled.button.attrs({ type: 'button', 'data-pressable': true })`
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-secondary);

  &:hover {
    background: var(--chip-bg-hover);
    color: var(--text-primary);
  }
`;

const readConnection = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return {
    effectiveType: connection?.effectiveType || null,
    saveData: Boolean(connection?.saveData),
  };
};

export default function NetworkStatusBanner() {
  const reducedMotion = useReducedMotion();
  const [online, setOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [connection, setConnection] = useState(() =>
    typeof navigator !== 'undefined' ? readConnection() : { effectiveType: null, saveData: false },
  );
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const onOnline = () => setOnline(true);
    const onOffline = () => {
      setOnline(false);
      setDismissed(false);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    const connectionObj =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const onConnectionChange = () => setConnection(readConnection());
    connectionObj?.addEventListener?.('change', onConnectionChange);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      connectionObj?.removeEventListener?.('change', onConnectionChange);
    };
  }, []);

  const status = useMemo(() => {
    if (!online) {
      return {
        key: 'offline',
        icon: <FiWifiOff />,
        title: '离线模式',
        desc: '网络已断开：仍可浏览已缓存页面，但部分资源可能无法加载。',
        canDismiss: false,
      };
    }

    const effectiveType = connection.effectiveType;
    const saveData = connection.saveData;

    if (saveData) {
      return {
        key: 'saveData',
        icon: <FiAlertTriangle />,
        title: '省流模式已开启',
        desc: '已检测到省流设置：将减少预取与动效，以提升稳定性。',
        canDismiss: true,
      };
    }

    if (effectiveType && ['slow-2g', '2g'].includes(effectiveType)) {
      return {
        key: 'slow',
        icon: <FiAlertTriangle />,
        title: '弱网环境',
        desc: '当前网络较慢：建议稍后再尝试大图与海报生成。',
        canDismiss: true,
      };
    }

    return null;
  }, [connection.effectiveType, connection.saveData, online]);

  const show = Boolean(status) && (!status?.canDismiss || !dismissed);

  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: -6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.2 },
      };

  return (
    <AnimatePresence>
      {show ? (
        <Wrap {...motionProps} role="status" aria-live="polite" aria-label="网络状态提示">
          <Icon aria-hidden="true">{status.icon}</Icon>
          <Text>
            <Title>{status.title}</Title>
            <Desc>{status.desc}</Desc>
          </Text>
          {status.canDismiss ? (
            <Close aria-label="关闭提示" title="关闭提示" onClick={() => setDismissed(true)}>
              <FiX />
            </Close>
          ) : (
            <span />
          )}
        </Wrap>
      ) : null}
    </AnimatePresence>
  );
}
