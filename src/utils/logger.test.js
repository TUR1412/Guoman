import { describe, expect, it, vi } from 'vitest';

describe('logger', () => {
  it('stores log entries and can clear them', async () => {
    vi.resetModules();
    const { flushStorageQueue } = await import('./storageQueue');
    window.localStorage.clear();
    flushStorageQueue();

    const { getLogs, logInfo, logWarn, logError, clearLogs } = await import('./logger');

    logInfo('hello', { a: 1 }, 'unit');
    logWarn('careful');
    logError('boom', null, 'test');

    flushStorageQueue();

    const logs = getLogs();
    expect(logs.length).toBeGreaterThanOrEqual(3);
    expect(logs[0]).toEqual(
      expect.objectContaining({
        level: 'error',
        message: 'boom',
        source: 'test',
        at: expect.any(Number),
      }),
    );

    clearLogs();
    flushStorageQueue();
    expect(getLogs()).toEqual([]);
  });

  it('normalizes levels and ignores empty messages', async () => {
    vi.resetModules();
    const { flushStorageQueue } = await import('./storageQueue');
    window.localStorage.clear();
    flushStorageQueue();

    const { getLogs, logMessage } = await import('./logger');

    logMessage({ level: 'WARNING', message: 'warned' });
    logMessage({ level: 'unknown', message: 'fallback' });
    logMessage({ level: 'info', message: '' });

    flushStorageQueue();
    const logs = getLogs();
    expect(logs.map((l) => l.level)).toEqual(['info', 'warn']);
  });
});
