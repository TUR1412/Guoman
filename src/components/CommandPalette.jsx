import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { FiCornerDownLeft, FiSearch } from './icons/feather';

import { usePointerGlow } from './usePointerGlow';
import { useAppReducedMotion } from '../motion/useAppReducedMotion';
import { prefetchRoute } from '../utils/routePrefetch';
import Dialog from '../ui/Dialog';

const Header = styled.div`
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-subtle);
  display: grid;
  gap: var(--spacing-sm);
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const Title = styled.div`
  font-family: var(--font-display);
  font-size: var(--text-lg-plus);
  color: var(--text-primary);
  letter-spacing: 0.02em;
`;

const Hint = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
`;

const SearchRow = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
  display: grid;
  place-items: center;
`;

const SearchInput = styled.input.attrs({ 'data-focus-guide': true })`
  width: 100%;
  padding: 12px 14px 12px 42px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-subtle);
  background: var(--field-bg);
  color: var(--text-primary);
  outline: none;
  transition: var(--transition);

  &:focus {
    background: var(--field-bg-focus);
    border-color: var(--primary-soft-border);
    box-shadow: var(--shadow-ring);
  }
`;

const List = styled.div`
  max-height: min(56vh, 520px);
  overflow: auto;
`;

const Empty = styled.div`
  padding: var(--spacing-xl);
  color: var(--text-tertiary);
  text-align: center;
`;

const Item = styled.button.attrs({ type: 'button', 'data-pressable': true })`
  width: 100%;
  display: grid;
  grid-template-columns: 36px 1fr auto;
  gap: var(--spacing-md);
  align-items: center;
  padding: 12px var(--spacing-lg);
  border: none;
  background: transparent;
  color: var(--text-primary);
  text-align: left;
  border-bottom: 1px solid var(--border-subtle);

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background: var(--surface-soft-hover);
    }
  }

  &:focus-visible {
    outline: none;
    background: var(--surface-soft-hover);
    box-shadow: var(--shadow-ring);
  }

  &[aria-selected='true'] {
    background: var(--primary-soft);
  }
`;

const ItemIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  display: grid;
  place-items: center;
  color: var(--text-secondary);
`;

const ItemText = styled.div`
  display: grid;
  gap: 4px;
`;

const ItemTitle = styled.div`
  font-weight: 800;
  line-height: var(--leading-tight);
`;

const ItemDesc = styled.div`
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
`;

const ItemMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs-plus);
  padding: 6px 10px;
  border-radius: var(--border-radius-pill);
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  white-space: nowrap;
`;

const Footer = styled.div`
  padding: 10px var(--spacing-lg);
  border-top: 1px solid var(--border-subtle);
  color: var(--text-tertiary);
  font-size: var(--text-xs);
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .trim();

const scheduleIdle = (callback) => {
  if (typeof window === 'undefined') return () => undefined;

  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 800 });
    return () => window.cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(callback, 120);
  return () => window.clearTimeout(id);
};

const buildSearchAction = (query, onSearch) => {
  const trimmed = query.trim();
  if (!trimmed) return null;
  if (typeof onSearch !== 'function') return null;

  return {
    id: 'search.query',
    title: `搜索 “${trimmed}”`,
    description: '在站内搜索页打开结果',
    keywords: [trimmed],
    icon: <FiSearch />,
    meta: 'Enter',
    prefetchPath: '/search',
    run: () => onSearch(trimmed),
  };
};

export default function CommandPalette({ open, onClose, actions, onSearch }) {
  const reducedMotion = useAppReducedMotion();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  usePointerGlow(panelRef, { disabled: reducedMotion });

  const results = useMemo(() => {
    const normalizedQuery = normalize(query);
    const base = Array.isArray(actions) ? actions : [];
    const searchAction = buildSearchAction(query, onSearch);

    const filtered = normalizedQuery
      ? base.filter((action) => {
          const haystack = normalize(
            [action.title, action.description, ...(action.keywords || [])]
              .filter(Boolean)
              .join(' '),
          );
          return haystack.includes(normalizedQuery);
        })
      : base;

    if (!searchAction) {
      return filtered.slice(0, 12);
    }

    if (filtered.length === 0) {
      return [searchAction];
    }

    return [...filtered.slice(0, 11), searchAction];
  }, [actions, onSearch, query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const path = results[activeIndex]?.prefetchPath;
    if (!path) return undefined;

    return scheduleIdle(() => {
      prefetchRoute(path);
    });
  }, [activeIndex, open, results]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, Math.max(0, results.length - 1)));
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === 'Enter') {
        const action = results[activeIndex];
        if (!action) return;
        e.preventDefault();
        try {
          action.run?.();
        } finally {
          onClose?.();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, onClose, open, results]);

  const listId = 'guoman-command-list';
  const activeOptionId = results[activeIndex]?.id
    ? `guoman-command-${results[activeIndex].id}`
    : '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      ariaLabel="命令面板"
      initialFocusRef={inputRef}
      panelRef={panelRef}
      backdropProps={{
        style: {
          '--dialog-z': '10000',
          '--dialog-place-items': 'start center',
          '--dialog-padding':
            'calc(var(--header-height) + 18px) var(--spacing-lg) var(--spacing-lg)',
        },
      }}
      panelProps={{ 'data-pointer-glow': true }}
    >
      <Header>
        <TitleRow>
          <Title>命令面板</Title>
          <Hint>Ctrl/⌘ + K · Esc</Hint>
        </TitleRow>
        <SearchRow>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            ref={inputRef}
            type="search"
            placeholder="输入：作品名 / #标签 / 分类 / 页面 / 快捷动作"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            aria-controls={listId}
            aria-activedescendant={activeOptionId}
            aria-label="命令面板输入框"
          />
        </SearchRow>
      </Header>

      <List role="listbox" id={listId} aria-label="命令列表">
        {results.length > 0 ? (
          results.map((action, index) => {
            const selected = index === activeIndex;
            const optionId = `guoman-command-${action.id}`;

            return (
              <Item
                key={action.id}
                role="option"
                id={optionId}
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  try {
                    action.run?.();
                  } finally {
                    onClose?.();
                  }
                }}
              >
                <ItemIcon aria-hidden="true">{action.icon}</ItemIcon>
                <ItemText>
                  <ItemTitle>{action.title}</ItemTitle>
                  {action.description ? <ItemDesc>{action.description}</ItemDesc> : null}
                </ItemText>
                <ItemMeta aria-hidden="true">
                  <FiCornerDownLeft />
                  {action.meta || 'Enter'}
                </ItemMeta>
              </Item>
            );
          })
        ) : (
          <Empty>没有匹配的命令，换个关键词试试。</Empty>
        )}
      </List>

      <Footer>
        <span>↑↓ 选择 · Enter 执行 · Esc 关闭</span>
        <span>数据不出本地</span>
      </Footer>
    </Dialog>
  );
}
