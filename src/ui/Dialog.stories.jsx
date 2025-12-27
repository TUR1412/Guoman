import React, { useRef, useState } from 'react';
import Dialog from './Dialog';
import Card from './Card';
import Stack from './Stack';

export default {
  title: 'UI/Dialog',
};

export function Basic() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  return (
    <>
      <button
        type="button"
        data-pressable
        onClick={() => setOpen(true)}
        style={{
          padding: '10px 14px',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--border-subtle)',
          background: 'var(--chip-bg)',
          color: 'var(--text-primary)',
        }}
      >
        打开 Dialog
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        ariaLabel="Dialog 示例"
        initialFocusRef={inputRef}
        backdropProps={{
          style: {
            '--dialog-backdrop-blur': '12px',
            '--dialog-panel-width': '560px',
          },
        }}
      >
        <Card $elev={0} style={{ padding: 'var(--spacing-lg)' }}>
          <Stack $gap="var(--spacing-md)">
            <div style={{ fontWeight: 900, fontSize: 'var(--text-lg-plus)' }}>Dialog / Modal</div>
            <div style={{ color: 'var(--text-secondary)' }}>
              统一遮罩层、基础焦点恢复、ESC 关闭、BackDrop 点击关闭。
            </div>
            <input
              ref={inputRef}
              placeholder="初始焦点（initialFocusRef）"
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--field-bg)',
                color: 'var(--text-primary)',
              }}
            />
            <Stack $direction="row" $gap="var(--spacing-md)" $wrap>
              <button
                type="button"
                data-pressable
                onClick={() => setOpen(false)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--border-radius-md)',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--chip-bg)',
                  color: 'var(--text-primary)',
                }}
              >
                关闭
              </button>
            </Stack>
          </Stack>
        </Card>
      </Dialog>
    </>
  );
}
