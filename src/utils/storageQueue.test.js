import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('storageQueue', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('ignores empty keys', async () => {
    vi.resetModules();
    const { getPendingStorageWriteValue, scheduleStorageWrite, hasPendingStorageWrite } =
      await import('./storageQueue');
    scheduleStorageWrite('', 'v');
    expect(hasPendingStorageWrite('')).toBe(false);
    expect(getPendingStorageWriteValue('')).toBeUndefined();
  });

  it('flushes via window.setTimeout when requestIdleCallback is unavailable', async () => {
    vi.resetModules();
    vi.useFakeTimers();
    delete window.requestIdleCallback;
    delete window.cancelIdleCallback;

    const { scheduleStorageWrite, hasPendingStorageWrite } = await import('./storageQueue');
    scheduleStorageWrite('k', 'v', { delay: 10 });
    expect(hasPendingStorageWrite('k')).toBe(true);

    vi.advanceTimersByTime(20);
    expect(hasPendingStorageWrite('k')).toBe(false);
    expect(window.localStorage.getItem('k')).toBe('v');
    vi.useRealTimers();
  });

  it('cancels idle callback when manually flushing', async () => {
    vi.resetModules();
    vi.useFakeTimers();

    const cancelIdleCallback = vi.fn();
    window.requestIdleCallback = vi.fn((cb) => {
      setTimeout(() => cb(), 0);
      return 123;
    });
    window.cancelIdleCallback = cancelIdleCallback;

    const { flushStorageQueue, hasPendingStorageWrite, scheduleStorageWrite } =
      await import('./storageQueue');
    scheduleStorageWrite('k', 'v', { delay: 50 });
    expect(hasPendingStorageWrite('k')).toBe(true);

    flushStorageQueue();
    expect(cancelIdleCallback).toHaveBeenCalledWith(123);
    expect(window.localStorage.getItem('k')).toBe('v');
    vi.useRealTimers();
  });

  it('removes keys when value is null', async () => {
    vi.resetModules();
    const { flushStorageQueue, scheduleStorageWrite } = await import('./storageQueue');
    window.localStorage.setItem('k', 'v');

    scheduleStorageWrite('k', null);
    flushStorageQueue();
    expect(window.localStorage.getItem('k')).toBeNull();
  });

  it('exposes queued values for read-after-write', async () => {
    vi.resetModules();
    const {
      flushStorageQueue,
      getPendingStorageWriteValue,
      hasPendingStorageWrite,
      scheduleStorageWrite,
    } = await import('./storageQueue');

    scheduleStorageWrite('k', 'v');
    expect(hasPendingStorageWrite('k')).toBe(true);
    expect(getPendingStorageWriteValue('k')).toBe('v');

    flushStorageQueue();
    expect(hasPendingStorageWrite('k')).toBe(false);
    expect(getPendingStorageWriteValue('k')).toBeUndefined();
  });

  it('swallows dispatchEvent failures when broadcasting storage events', async () => {
    vi.resetModules();
    const { flushStorageQueue, scheduleStorageWrite } = await import('./storageQueue');

    const spy = vi.spyOn(window, 'dispatchEvent').mockImplementation(() => {
      throw new Error('boom');
    });

    scheduleStorageWrite('k', 'v');
    expect(() => flushStorageQueue()).not.toThrow();
    spy.mockRestore();
  });

  it('flushes on visibilitychange when document becomes hidden', async () => {
    vi.resetModules();
    vi.useFakeTimers();
    const addSpy = vi.spyOn(window, 'addEventListener');
    const { hasPendingStorageWrite, scheduleStorageWrite } = await import('./storageQueue');

    scheduleStorageWrite('k', 'v', { delay: 10000 });
    expect(hasPendingStorageWrite('k')).toBe(true);
    expect(addSpy).toHaveBeenCalled();

    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    window.dispatchEvent(new Event('visibilitychange'));

    expect(hasPendingStorageWrite('k')).toBe(false);
    expect(window.localStorage.getItem('k')).toBe('v');
    vi.useRealTimers();
  });

  it('flushes on beforeunload/pagehide lifecycle events', async () => {
    vi.resetModules();
    const { hasPendingStorageWrite, scheduleStorageWrite } = await import('./storageQueue');

    scheduleStorageWrite('k', 'v', { delay: 10000 });
    expect(hasPendingStorageWrite('k')).toBe(true);

    window.dispatchEvent(new Event('pagehide'));
    expect(hasPendingStorageWrite('k')).toBe(false);
    expect(window.localStorage.getItem('k')).toBe('v');
  });

  it('can flush without window (server-like environment)', async () => {
    vi.resetModules();
    vi.useFakeTimers();
    vi.stubGlobal('window', undefined);

    const { hasPendingStorageWrite, scheduleStorageWrite } = await import('./storageQueue');
    scheduleStorageWrite('k', 'v', { delay: 5 });
    expect(hasPendingStorageWrite('k')).toBe(true);

    vi.advanceTimersByTime(10);
    expect(hasPendingStorageWrite('k')).toBe(false);
    vi.useRealTimers();
  });
});
