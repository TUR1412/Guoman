import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Dialog from '../ui/Dialog';
import Button from '../ui/Button';
import TextAreaField from '../ui/TextAreaField';

const Body = styled.div`
  padding: var(--spacing-xl);
  display: grid;
  gap: var(--spacing-md);
`;

const Title = styled.h3`
  font-size: var(--text-lg-plus);
  font-family: var(--font-display);
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
`;

const Actions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  flex-wrap: wrap;
`;

function selectTextarea(textarea) {
  if (!textarea) return;
  try {
    textarea.focus({ preventScroll: true });
  } catch {
    textarea.focus();
  }

  try {
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
  } catch {}
}

export default function ManualCopyDialog({
  open,
  onClose,
  title = '手动复制',
  description,
  text,
  label = '内容',
  helperText,
  panelWidth = 760,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const t = window.setTimeout(() => selectTextarea(textareaRef.current), 0);
    return () => window.clearTimeout(t);
  }, [open, text]);

  const hint =
    helperText ||
    '自动复制不可用时，可点击文本框后按 Ctrl/⌘+A 再按 Ctrl/⌘+C（如有需要可先脱敏后再分享）。';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      ariaLabel={title}
      initialFocusRef={textareaRef}
      panelProps={{
        style: { '--dialog-panel-width': `${panelWidth}px` },
      }}
    >
      <Body>
        <Title>{title}</Title>
        {description ? <Description>{description}</Description> : null}
        <TextAreaField
          label={label}
          textareaRef={textareaRef}
          value={text || ''}
          readOnly
          helperText={hint}
          spellCheck={false}
        />
        <Actions>
          <Button type="button" variant="ghost" onClick={() => selectTextarea(textareaRef.current)}>
            全选
          </Button>
          <Button type="button" variant="primary" onClick={onClose}>
            关闭
          </Button>
        </Actions>
      </Body>
    </Dialog>
  );
}
