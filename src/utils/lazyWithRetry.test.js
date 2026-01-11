import { describe, expect, it, vi } from 'vitest';

describe('lazyWithRetry', () => {
  it('retryImport returns resolved module', async () => {
    vi.resetModules();
    vi.doMock('./logger', () => ({ logWarn: vi.fn(), logError: vi.fn() }));

    const { retryImport } = await import('./lazyWithRetry');
    const importer = vi.fn().mockResolvedValue({ default: 'ok' });

    const result = await retryImport(importer, { retries: 2, delayMs: 0, source: 'unit' });
    expect(result).toEqual({ default: 'ok' });
    expect(importer).toHaveBeenCalledTimes(1);
  });

  it('retryImport retries on chunk load errors', async () => {
    vi.resetModules();
    const logWarn = vi.fn();
    const logError = vi.fn();
    vi.doMock('./logger', () => ({ logWarn, logError }));

    const { retryImport } = await import('./lazyWithRetry');
    const importer = vi
      .fn()
      .mockRejectedValueOnce(new Error('Loading chunk 123 failed'))
      .mockResolvedValue({ default: 'ok' });

    const result = await retryImport(importer, { retries: 2, delayMs: 0, source: 'unit' });
    expect(result).toEqual({ default: 'ok' });
    expect(importer).toHaveBeenCalledTimes(2);
    expect(logWarn).toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });

  it('retryImport does not retry on non-retryable errors', async () => {
    vi.resetModules();
    const logWarn = vi.fn();
    const logError = vi.fn();
    vi.doMock('./logger', () => ({ logWarn, logError }));

    const { retryImport } = await import('./lazyWithRetry');
    const importer = vi.fn().mockRejectedValue(new Error('boom'));

    await expect(retryImport(importer, { retries: 2, delayMs: 0, source: 'unit' })).rejects.toThrow(
      'boom',
    );
    expect(importer).toHaveBeenCalledTimes(1);
    expect(logWarn).not.toHaveBeenCalled();
    expect(logError).toHaveBeenCalled();
  });
});
