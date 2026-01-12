import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FiUpload } from '../icons/feather';

const DropZone = styled.button.attrs({ 'data-pressable': true })`
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  border: 1px dashed var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  transition: var(--transition);
  text-align: left;

  &[data-active='true'] {
    border-color: rgba(var(--primary-rgb), 0.7);
    background: var(--surface-soft-hover);
    box-shadow: var(--shadow-ring);
  }

  &:hover {
    background: var(--surface-soft-hover);
  }

  &:focus-visible {
    outline: none;
    box-shadow: var(--shadow-ring);
  }
`;

const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius-lg);
  display: grid;
  place-items: center;
  border: 1px solid var(--border-subtle);
  background: var(--control-bg);
  box-shadow: var(--shadow-elev-1);
  color: var(--primary-color);

  svg {
    width: 20px;
    height: 20px;
  }
`;

const TextStack = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const Title = styled.div`
  font-weight: 800;
  line-height: var(--leading-snug);
`;

const Hint = styled.div`
  color: var(--text-secondary);
  font-size: var(--text-sm);
  line-height: var(--leading-snug-plus);
`;

function getFirstFile(event) {
  const list = event?.dataTransfer?.files;
  if (!list || list.length === 0) return null;
  return list[0] || null;
}

export default function DiagnosticsBundleDropZone({
  onPick,
  onFile,
  disabled = false,
  title = '拖拽诊断包到这里，或点击选择文件',
  hint = '支持 .json / .json.gz（仅本地解析，不上传网络）',
  className,
}) {
  const [active, setActive] = useState(false);

  const canInteract = useMemo(() => !disabled, [disabled]);

  const stopEvent = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <DropZone
      type="button"
      className={className}
      disabled={!canInteract}
      data-active={active ? 'true' : undefined}
      aria-label={title}
      onClick={() => {
        if (!canInteract) return;
        onPick?.();
      }}
      onDragEnter={(event) => {
        if (!canInteract) return;
        stopEvent(event);
        setActive(true);
      }}
      onDragOver={(event) => {
        if (!canInteract) return;
        stopEvent(event);
        setActive(true);
      }}
      onDragLeave={(event) => {
        if (!canInteract) return;
        stopEvent(event);
        if (event.currentTarget === event.target) {
          setActive(false);
        }
      }}
      onDrop={(event) => {
        if (!canInteract) return;
        stopEvent(event);
        setActive(false);
        const file = getFirstFile(event);
        if (file) {
          onFile?.(file);
        }
      }}
    >
      <IconWrap aria-hidden="true">
        <FiUpload />
      </IconWrap>
      <TextStack>
        <Title>{title}</Title>
        {hint ? <Hint>{hint}</Hint> : null}
      </TextStack>
    </DropZone>
  );
}
