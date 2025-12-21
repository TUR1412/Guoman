import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NetworkStatusBanner from './NetworkStatusBanner';

const setNavigatorOnline = (value) => {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    get: () => value,
  });
};

const setNavigatorConnection = (connection) => {
  Object.defineProperty(window.navigator, 'connection', {
    configurable: true,
    value: connection,
  });
};

describe('NetworkStatusBanner', () => {
  it('shows offline banner and cannot be dismissed', () => {
    setNavigatorOnline(false);
    setNavigatorConnection(null);

    render(<NetworkStatusBanner />);

    expect(screen.getByText('离线模式')).toBeInTheDocument();
    expect(screen.queryByLabelText('关闭提示')).not.toBeInTheDocument();
  });

  it('shows save-data banner and can be dismissed', async () => {
    const user = userEvent.setup();
    setNavigatorOnline(true);

    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    setNavigatorConnection({
      saveData: true,
      effectiveType: '4g',
      addEventListener,
      removeEventListener,
    });

    render(<NetworkStatusBanner />);

    expect(screen.getByText('省流模式已开启')).toBeInTheDocument();
    await user.click(screen.getByLabelText('关闭提示'));
    await waitFor(() => {
      expect(screen.queryByText('省流模式已开启')).not.toBeInTheDocument();
    });
  });

  it('resets dismissed state when going offline', async () => {
    const user = userEvent.setup();
    setNavigatorOnline(true);

    setNavigatorConnection({
      saveData: true,
      effectiveType: '4g',
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    render(<NetworkStatusBanner />);

    await user.click(screen.getByLabelText('关闭提示'));
    await waitFor(() => {
      expect(screen.queryByText('省流模式已开启')).not.toBeInTheDocument();
    });

    setNavigatorOnline(false);
    window.dispatchEvent(new Event('offline'));

    expect(await screen.findByText('离线模式')).toBeInTheDocument();
  });
});
