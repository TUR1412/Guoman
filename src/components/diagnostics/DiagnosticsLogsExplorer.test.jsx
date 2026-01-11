import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DiagnosticsLogsExplorer from './DiagnosticsLogsExplorer';

describe('DiagnosticsLogsExplorer', () => {
  it('filters by level/keyword and downloads filtered list', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    const logs = [
      { id: '1', level: 'info', message: 'hello world', source: 'home', at: 1 },
      { id: '2', level: 'error', message: 'boom', source: 'api', at: 2 },
      {
        id: '3',
        level: 'warn',
        message: 'warn me',
        source: 'router',
        at: 3,
        context: { code: 42, note: 'threshold' },
      },
    ];

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DiagnosticsLogsExplorer logs={logs} onDownload={onDownload} />
      </MemoryRouter>,
    );

    expect(screen.getByText('hello world')).toBeInTheDocument();
    expect(screen.getByText('boom')).toBeInTheDocument();
    expect(screen.getByText('warn me')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('级别'), 'error');
    expect(screen.queryByText('hello world')).not.toBeInTheDocument();
    expect(screen.getByText('boom')).toBeInTheDocument();

    await user.type(screen.getByLabelText('关键词'), 'boom');
    await user.click(screen.getByRole('button', { name: '下载筛选结果' }));

    expect(onDownload).toHaveBeenCalledTimes(1);
    const [filtered] = onDownload.mock.calls[0];
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');

    await user.clear(screen.getByLabelText('关键词'));
    await user.selectOptions(screen.getByLabelText('级别'), 'all');
    await user.type(screen.getByLabelText('关键词'), '42');
    expect(screen.getByText('warn me')).toBeInTheDocument();
  });

  it('supports custom title and empty state overrides', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DiagnosticsLogsExplorer
          title="导入日志浏览器"
          logs={[]}
          emptyState={{
            title: '导入包暂无日志',
            description: '该诊断包未包含 logs 记录。',
            primaryAction: null,
            secondaryAction: null,
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('导入日志浏览器')).toBeInTheDocument();
    expect(screen.getByText('导入包暂无日志')).toBeInTheDocument();
  });
});
