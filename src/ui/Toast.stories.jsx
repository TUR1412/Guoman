import React from 'react';
import { ToastProvider, useToast } from '../components/ToastProvider';
import Card from './Card';
import Stack from './Stack';

export default {
  title: 'UI/Toast',
};

function ToastDemo() {
  const toast = useToast();

  return (
    <Card $elev={3} style={{ padding: 'var(--spacing-lg)' }}>
      <Stack $gap="var(--spacing-md)">
        <div style={{ fontWeight: 900 }}>Toast 全局反馈</div>
        <div style={{ color: 'var(--text-secondary)' }}>
          复用站内 ToastProvider（带动效与 reduced motion 兼容）。
        </div>
        <Stack $direction="row" $gap="var(--spacing-md)" $wrap>
          <button
            type="button"
            data-pressable
            onClick={() => toast.info('提示', '这是一条 info 消息')}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--chip-bg)',
              color: 'var(--text-primary)',
            }}
          >
            Info
          </button>
          <button
            type="button"
            data-pressable
            onClick={() => toast.success('成功', '收藏已更新', { celebrate: true })}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--chip-bg)',
              color: 'var(--text-primary)',
            }}
          >
            Success
          </button>
          <button
            type="button"
            data-pressable
            onClick={() => toast.warning('警告', '网络波动，已启用重试')}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--chip-bg)',
              color: 'var(--text-primary)',
            }}
          >
            Warning
          </button>
        </Stack>
      </Stack>
    </Card>
  );
}

export function Demo() {
  return (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  );
}
