import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiStar, FiTrash2 } from './icons/feather';
import { useToast } from './ToastProvider';
import { trackEvent } from '../utils/analytics';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { useStorageSignal } from '../utils/useStorageSignal';
import { clearPinnedTags, getPinnedTags } from '../utils/pinnedTags';

const Card = styled.section.attrs({
  'data-card': true,
  'data-divider': 'card',
  'data-elev': '3',
})`
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  display: grid;
  gap: var(--spacing-md);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      260px 180px at 10% 0%,
      rgba(var(--primary-rgb), 0.16),
      transparent 62%
    );
    opacity: 0.8;
    pointer-events: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--text-3xl);
  letter-spacing: 0.01em;
`;

const Meta = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const Actions = styled.div.attrs({ 'data-divider': 'inline' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  align-items: center;
`;

const ActionButton = styled.button.attrs({
  type: 'button',
  'data-pressable': true,
  'data-shimmer': true,
  'data-focus-guide': true,
})`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0.55rem 0.85rem;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--border-subtle);
  background: var(--surface-soft);
  color: var(--text-primary);
  font-weight: 800;
  font-size: var(--text-xs);
  transition: var(--transition);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: var(--surface-soft-hover);
      border-color: var(--chip-border-hover);
      box-shadow: var(--shadow-glow);
    }
  }
`;

const DangerButton = styled(ActionButton)`
  border-color: var(--danger-border);
  background: rgba(var(--danger-rgb), 0.1);
`;

const TagRow = styled.div.attrs({ role: 'list' })`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 1;
`;

const TagChip = styled(Link).attrs({ role: 'listitem', 'data-pressable': true })`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: var(--spacing-xs-plus) var(--spacing-md-compact);
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  transition: var(--transition);

  svg {
    width: 16px;
    height: 16px;
    color: rgba(var(--secondary-rgb), 0.9);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      border-color: var(--chip-border-hover);
      background: var(--chip-bg-hover);
      color: var(--text-primary);
    }
  }
`;

const Hint = styled.p`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  position: relative;
  z-index: 1;
`;

export default function PinnedTagsSection() {
  const toast = useToast();
  const { bump } = useStorageSignal([STORAGE_KEYS.pinnedTags]);
  const pinnedTags = getPinnedTags();

  if (!Array.isArray(pinnedTags) || pinnedTags.length === 0) return null;

  return (
    <Card aria-label="常用标签">
      <Header>
        <div>
          <Title>
            <FiStar /> 常用标签
          </Title>
          <Meta>已钉住 {pinnedTags.length} 个标签 · 首页快捷入口</Meta>
        </div>
        <Actions>
          <DangerButton
            onClick={() => {
              clearPinnedTags();
              bump();
              toast.info('已清空常用标签', '你可以随时重新钉住。');
              trackEvent('pinnedTags.clear');
            }}
            title="清空所有常用标签"
          >
            <FiTrash2 />
            清空
          </DangerButton>
        </Actions>
      </Header>

      <TagRow aria-label="常用标签列表">
        {pinnedTags.map((tag) => (
          <TagChip
            key={tag}
            to={`/tag/${encodeURIComponent(tag)}`}
            onClick={() => trackEvent('pinnedTags.open', { tag })}
            title={`打开标签：${tag}`}
          >
            <FiStar aria-hidden="true" />
            {tag}
          </TagChip>
        ))}
      </TagRow>

      <Hint>提示：进入任意标签页，点击“钉住”即可把标签固定到首页。</Hint>
    </Card>
  );
}
