import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

const loadBanner = async ({ reducedMotion = false, activateOk = true } = {}) => {
  vi.resetModules();
  vi.doMock('../motion/useAppReducedMotion', () => ({
    useAppReducedMotion: () => reducedMotion,
  }));

  const activateServiceWorkerUpdate = vi.fn(() => activateOk);
  vi.doMock('../utils/serviceWorker', () => ({
    SERVICE_WORKER_EVENTS: { update: 'guoman:sw:update' },
    activateServiceWorkerUpdate,
  }));

  const module = await import('./NetworkStatusBanner');
  return { Banner: module.default, activateServiceWorkerUpdate };
};

const stubLocationReload = () => {
  const original = window.location.reload;
  const spy = vi.fn();
  let restored = false;

  const restore = () => {
    if (restored) return;
    restored = true;
    try {
      Object.defineProperty(window.location, 'reload', {
        configurable: true,
        writable: true,
        value: original,
      });
      return;
    } catch {}

    try {
      window.location.reload = original;
    } catch {}
  };

  try {
    Object.defineProperty(window.location, 'reload', {
      configurable: true,
      writable: true,
      value: spy,
    });
    return { spy, restore };
  } catch {}

  try {
    const spyOn = vi.spyOn(window.location, 'reload').mockImplementation(spy);
    return { spy: spyOn, restore };
  } catch {}

  try {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: spy },
    });
  } catch {}

  return { spy, restore };
};

describe('NetworkStatusBanner', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    delete document.documentElement.dataset.lowData;
  });

  it('renders nothing when online and connection is normal', async () => {
    const { Banner } = await loadBanner();
    setNavigatorOnline(true);
    setNavigatorConnection(null);

    render(<Banner />);
    expect(screen.queryByLabelText('网络状态提示')).not.toBeInTheDocument();
    expect(document.documentElement.dataset.lowData).toBeUndefined();
  });

  it('shows offline banner and cannot be dismissed', async () => {
    const { Banner } = await loadBanner();
    setNavigatorOnline(false);
    setNavigatorConnection(null);

    render(<Banner />);

    expect(screen.getByText('离线模式')).toBeInTheDocument();
    expect(screen.queryByLabelText('关闭提示')).not.toBeInTheDocument();
  });

  it('shows save-data banner and can be dismissed', async () => {
    const { Banner } = await loadBanner();
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

    render(<Banner />);

    expect(screen.getByText('省流模式已开启')).toBeInTheDocument();
    await user.click(screen.getByLabelText('关闭提示'));
    await waitFor(() => {
      expect(screen.queryByText('省流模式已开启')).not.toBeInTheDocument();
    });
  });

  it('shows slow network banner when effectiveType is 2g and can be dismissed', async () => {
    const { Banner } = await loadBanner();
    const user = userEvent.setup();
    setNavigatorOnline(true);

    setNavigatorConnection({
      saveData: false,
      effectiveType: '2g',
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    render(<Banner />);
    expect(screen.getByText('弱网环境')).toBeInTheDocument();
    expect(document.documentElement.dataset.lowData).toBe('true');

    await user.click(screen.getByLabelText('关闭提示'));
    await waitFor(() => {
      expect(screen.queryByText('弱网环境')).not.toBeInTheDocument();
    });
  });

  it('removes lowData dataset when connection improves', async () => {
    const { Banner } = await loadBanner();
    setNavigatorOnline(true);

    const listeners = new Map();
    const connection = {
      saveData: false,
      effectiveType: '2g',
      addEventListener: (type, cb) => listeners.set(type, cb),
      removeEventListener: vi.fn((type) => listeners.delete(type)),
    };
    setNavigatorConnection(connection);

    render(<Banner />);
    expect(document.documentElement.dataset.lowData).toBe('true');
    expect(screen.getByText('弱网环境')).toBeInTheDocument();

    connection.effectiveType = '4g';
    listeners.get('change')?.();

    await waitFor(() => {
      expect(document.documentElement.dataset.lowData).toBeUndefined();
      expect(screen.queryByText('弱网环境')).not.toBeInTheDocument();
    });
  });

  it('shows update banner and triggers activation (reload fallback when activation fails)', async () => {
    const { restore: restoreReload } = stubLocationReload();

    const { Banner, activateServiceWorkerUpdate } = await loadBanner({
      reducedMotion: true,
      activateOk: false,
    });

    setNavigatorOnline(true);
    setNavigatorConnection(null);

    render(<Banner />);
    expect(screen.queryByText('发现新版本')).not.toBeInTheDocument();

    const registration = { waiting: { postMessage: vi.fn() } };
    window.dispatchEvent(
      new CustomEvent('guoman:sw:update', {
        detail: { registration },
      }),
    );

    expect(await screen.findByText('发现新版本')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByLabelText('立即更新'));
    expect(activateServiceWorkerUpdate).toHaveBeenCalledWith(registration);

    restoreReload();
  });

  it('dismisses update banner and does not reload when activation succeeds', async () => {
    const { restore: restoreReload } = stubLocationReload();

    const { Banner } = await loadBanner({ activateOk: true });
    const user = userEvent.setup();

    setNavigatorOnline(true);
    setNavigatorConnection(null);

    render(<Banner />);

    const registration = { waiting: { postMessage: vi.fn() } };
    window.dispatchEvent(new CustomEvent('guoman:sw:update', { detail: { registration } }));

    expect(await screen.findByText('发现新版本')).toBeInTheDocument();
    await user.click(screen.getByLabelText('关闭提示'));
    await waitFor(() => {
      expect(screen.queryByText('发现新版本')).not.toBeInTheDocument();
    });

    restoreReload();
  });

  it('resets dismissed state when going offline', async () => {
    const { Banner } = await loadBanner();
    const user = userEvent.setup();
    setNavigatorOnline(true);

    setNavigatorConnection({
      saveData: true,
      effectiveType: '4g',
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    render(<Banner />);

    await user.click(screen.getByLabelText('关闭提示'));
    await waitFor(() => {
      expect(screen.queryByText('省流模式已开启')).not.toBeInTheDocument();
    });

    setNavigatorOnline(false);
    window.dispatchEvent(new Event('offline'));

    expect(await screen.findByText('离线模式')).toBeInTheDocument();
  });
});
