import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertTriangle, FiDownload, FiWifiOff, FiX } from './icons/feather';
import { Button, IconButton } from '../ui';
import { activateServiceWorkerUpdate, SERVICE_WORKER_EVENTS } from '../utils/serviceWorker';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';

const Wrap = styled(motion.div).attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '4',
})`
  position: fixed;
  top: calc(var(--header-height) + 12px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: min(760px, calc(100vw - 32px));
  padding: 12px 14px;
  border-radius: var(--border-radius-lg);
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

const Close = styled(IconButton).attrs({
  type: 'button',
  variant: 'ghost',
  'data-pressable': true,
})`
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

const Actions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const ActionButton = styled(Button).attrs({
  type: 'button',
  variant: 'ghost',
  'data-pressable': true,
})`
  height: 32px;
  padding: 0 var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--primary-soft-border);
  background: rgba(var(--primary-rgb), 0.18);
  color: var(--text-primary);
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  transition: var(--transition);

  &:hover {
    background: rgba(var(--primary-rgb), 0.26);
    box-shadow: var(--shadow-glow);
  }

  &:active {
    transform: scale(0.98);
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
  const reducedMotion = useAppReducedMotion();
  const [online, setOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  );
  const [connection, setConnection] = useState(() =>
    typeof navigator !== 'undefined' ? readConnection() : { effectiveType: null, saveData: false },
  );
  const [dismissedKey, setDismissedKey] = useState(null);
  const [swRegistration, setSwRegistration] = useState(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const lowData =
      connection.saveData ||
      (connection.effectiveType && ['slow-2g', '2g'].includes(connection.effectiveType));

    if (lowData) {
      document.documentElement.dataset.lowData = 'true';
    } else {
      delete document.documentElement.dataset.lowData;
    }
  }, [connection.effectiveType, connection.saveData]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const onOnline = () => setOnline(true);
    const onOffline = () => {
      setOnline(false);
      setDismissedKey(null);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    const connectionObj =
      navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const onConnectionChange = () => setConnection(readConnection());
    connectionObj?.addEventListener?.('change', onConnectionChange);

    const onSwUpdate = (event) => {
      const registration = event?.detail?.registration;
      if (!registration) return;
      setSwRegistration(registration);
      setDismissedKey(null);
    };

    window.addEventListener(SERVICE_WORKER_EVENTS.update, onSwUpdate);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      connectionObj?.removeEventListener?.('change', onConnectionChange);
      window.removeEventListener(SERVICE_WORKER_EVENTS.update, onSwUpdate);
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

    const updateAvailable = Boolean(swRegistration?.waiting);
    if (updateAvailable) {
      return {
        key: 'update',
        icon: <FiDownload />,
        title: '发现新版本',
        desc: '已检测到更新：点击更新后将刷新页面并应用最新资源。',
        canDismiss: true,
        actionLabel: '更新',
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
  }, [connection.effectiveType, connection.saveData, online, swRegistration]);

  const show = Boolean(status) && (!status?.canDismiss || dismissedKey !== status.key);

  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: -6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
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
          {status.key === 'update' ? (
            <Actions>
              <ActionButton
                aria-label="立即更新"
                title="立即更新"
                onClick={() => {
                  const ok = activateServiceWorkerUpdate(swRegistration);
                  if (!ok) window.location.reload();
                }}
              >
                <span aria-hidden="true">
                  <FiDownload />
                </span>
                {status.actionLabel}
              </ActionButton>
              <Close
                aria-label="关闭提示"
                title="关闭提示"
                onClick={() => setDismissedKey(status.key)}
              >
                <FiX />
              </Close>
            </Actions>
          ) : status.canDismiss ? (
            <Close
              aria-label="关闭提示"
              title="关闭提示"
              onClick={() => setDismissedKey(status.key)}
            >
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
