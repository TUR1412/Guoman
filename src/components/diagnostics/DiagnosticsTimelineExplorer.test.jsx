import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DiagnosticsTimelineExplorer from './DiagnosticsTimelineExplorer';

describe('DiagnosticsTimelineExplorer', () => {
  it('filters by kind/keyword and downloads filtered list', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    const logs = [{ id: 'l1', level: 'info', message: 'route enter', source: 'router', at: 3 }];
    const errors = [
      { id: 'e1', message: 'TypeError: boom', source: 'app', stack: 'at foo', at: 2 },
    ];
    const events = [{ id: 'a1', name: 'anime.play', payload: { id: 42 }, at: 1 }];

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DiagnosticsTimelineExplorer
          logs={logs}
          errors={errors}
          events={events}
          onDownload={onDownload}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('route enter')).toBeInTheDocument();
    expect(screen.getByText('TypeError: boom')).toBeInTheDocument();
    expect(screen.getByText('anime.play')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('类型'), 'error');
    expect(screen.queryByText('route enter')).not.toBeInTheDocument();
    expect(screen.getByText('TypeError: boom')).toBeInTheDocument();

    await user.type(screen.getByLabelText('关键词'), 'boom');
    await user.click(screen.getByRole('button', { name: '下载筛选结果' }));

    expect(onDownload).toHaveBeenCalledTimes(1);
    const [filtered] = onDownload.mock.calls[0];
    expect(filtered).toHaveLength(1);
    expect(filtered[0].kind).toBe('error');
  });

  it('supports drilldown via onJump', async () => {
    const user = userEvent.setup();
    const onJump = vi.fn();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DiagnosticsTimelineExplorer
          logs={[{ id: 'l1', level: 'warn', message: 'route enter', source: 'router', at: 3 }]}
          errors={[]}
          events={[]}
          onJump={onJump}
        />
      </MemoryRouter>,
    );

    await user.click(screen.getByText('route enter'));
    await user.click(screen.getByRole('button', { name: '定位到日志浏览器' }));

    expect(onJump).toHaveBeenCalledTimes(1);
    expect(onJump.mock.calls[0][0].kind).toBe('log');
  });

  it('supports empty state overrides', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DiagnosticsTimelineExplorer
          logs={[]}
          errors={[]}
          events={[]}
          emptyState={{
            title: '暂无导入时间线',
            description: '请先导入诊断包。',
            primaryAction: null,
            secondaryAction: null,
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('暂无导入时间线')).toBeInTheDocument();
  });
});
