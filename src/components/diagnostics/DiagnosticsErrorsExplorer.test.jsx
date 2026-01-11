import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DiagnosticsErrorsExplorer from './DiagnosticsErrorsExplorer';

describe('DiagnosticsErrorsExplorer', () => {
  it('filters by keyword and downloads filtered list', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    const errors = [
      {
        id: 'e1',
        message: 'TypeError: boom',
        source: 'app',
        stack: 'at foo (index.js:1:1)',
        at: 1,
      },
      {
        id: 'e2',
        message: 'NetworkError: failed to fetch',
        source: 'fetch',
        stack: 'at bar (api.js:2:2)',
        at: 2,
      },
    ];

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DiagnosticsErrorsExplorer errors={errors} onDownload={onDownload} />
      </MemoryRouter>,
    );

    expect(screen.getByText('TypeError: boom')).toBeInTheDocument();
    expect(screen.getByText('NetworkError: failed to fetch')).toBeInTheDocument();

    await user.type(screen.getByLabelText('关键词'), 'api.js');
    expect(screen.queryByText('TypeError: boom')).not.toBeInTheDocument();
    expect(screen.getByText('NetworkError: failed to fetch')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '下载筛选结果' }));

    expect(onDownload).toHaveBeenCalledTimes(1);
    const [filtered] = onDownload.mock.calls[0];
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('e2');
  });
});
