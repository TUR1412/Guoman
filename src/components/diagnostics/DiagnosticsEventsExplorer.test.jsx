import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DiagnosticsEventsExplorer from './DiagnosticsEventsExplorer';

describe('DiagnosticsEventsExplorer', () => {
  it('filters by name/keyword and downloads filtered list', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    const events = [
      { id: '1', name: 'page.view', payload: { path: '/' }, at: 1 },
      { id: '2', name: 'anime.view', payload: { id: 42 }, at: 2 },
      { id: '3', name: 'anime.play', payload: { id: 42, episode: 1 }, at: 3 },
    ];

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DiagnosticsEventsExplorer events={events} onDownload={onDownload} />
      </MemoryRouter>,
    );

    expect(screen.getByText('page.view')).toBeInTheDocument();
    expect(screen.getByText('anime.view')).toBeInTheDocument();
    expect(screen.getByText('anime.play')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('事件名'), 'anime.view');
    expect(screen.queryByText('page.view')).not.toBeInTheDocument();
    expect(screen.getByText('anime.view')).toBeInTheDocument();

    await user.clear(screen.getByLabelText('关键词'));
    await user.type(screen.getByLabelText('关键词'), '42');
    await user.click(screen.getByRole('button', { name: '下载筛选结果' }));

    expect(onDownload).toHaveBeenCalledTimes(1);
    const [filtered] = onDownload.mock.calls[0];
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('2');
  });

  it('supports custom title and empty state overrides', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DiagnosticsEventsExplorer
          title="导入事件浏览器"
          events={[]}
          emptyState={{
            title: '导入包暂无事件',
            description: '该诊断包未包含 events 记录。',
            primaryAction: null,
            secondaryAction: null,
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('导入事件浏览器')).toBeInTheDocument();
    expect(screen.getByText('导入包暂无事件')).toBeInTheDocument();
  });
});
