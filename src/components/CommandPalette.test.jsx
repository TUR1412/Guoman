import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommandPalette from './CommandPalette';

describe('CommandPalette', () => {
  it('locks body scroll while open', () => {
    const { rerender } = render(
      <CommandPalette
        open
        onClose={() => {}}
        actions={[
          {
            id: 'a',
            title: '前往首页',
            description: '回到首页',
            keywords: ['home'],
            icon: <span />,
            meta: 'Enter',
            run: () => {},
          },
        ]}
      />,
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <CommandPalette
        open={false}
        onClose={() => {}}
        actions={[
          {
            id: 'a',
            title: '前往首页',
            description: '回到首页',
            keywords: ['home'],
            icon: <span />,
            meta: 'Enter',
            run: () => {},
          },
        ]}
      />,
    );

    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('executes selected action with Enter and closes', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const run = vi.fn();

    render(
      <CommandPalette
        open
        onClose={onClose}
        actions={[
          {
            id: 'go-home',
            title: '前往首页',
            description: '回到首页',
            keywords: ['首页', 'home'],
            icon: <span />,
            meta: 'Enter',
            run,
          },
        ]}
      />,
    );

    expect(screen.getByRole('dialog', { name: '命令面板' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('命令面板输入框'), '首页');
    await user.keyboard('{Enter}');

    expect(run).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('offers search action when onSearch is provided', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSearch = vi.fn();

    render(
      <CommandPalette
        open
        onClose={onClose}
        onSearch={onSearch}
        actions={[
          {
            id: 'dummy',
            title: '其他命令',
            description: '',
            keywords: ['dummy'],
            icon: <span />,
            meta: 'Enter',
            run: () => {},
          },
        ]}
      />,
    );

    await user.type(screen.getByLabelText('命令面板输入框'), '  斗罗大陆  ');
    expect(screen.getByText('搜索 “斗罗大陆”')).toBeInTheDocument();

    await user.keyboard('{Enter}');
    expect(onSearch).toHaveBeenCalledWith('斗罗大陆');
    expect(onClose).toHaveBeenCalled();
  });
});
