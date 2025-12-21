import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearErrorReports, getErrorReports, initErrorMonitor, reportError } from './errorReporter';
import { flushStorageQueue } from './storageQueue';

describe('errorReporter', () => {
  beforeEach(() => {
    window.localStorage.clear();
    flushStorageQueue();
    clearErrorReports();
    flushStorageQueue();
  });

  it('reportError ignores empty message', () => {
    reportError({ message: '' });
    flushStorageQueue();
    expect(getErrorReports()).toEqual([]);
  });

  it('reportError stores entry', () => {
    reportError({ message: 'boom', stack: 'stack', source: 'unit' });
    flushStorageQueue();

    const list = getErrorReports();
    expect(list.length).toBe(1);
    expect(list[0]).toEqual(expect.objectContaining({ message: 'boom', source: 'unit' }));
  });

  it('tolerates invalid stored payload', () => {
    window.localStorage.setItem('guoman.errors.v1', '{bad');
    expect(getErrorReports()).toEqual([]);
  });

  it('initErrorMonitor captures window error + unhandledrejection', () => {
    initErrorMonitor();

    const errEvent = new ErrorEvent('error', {
      message: 'Unhandled error',
      filename: 'app.js',
      error: new Error('Oops'),
    });
    window.dispatchEvent(errEvent);

    const rejection = new Event('unhandledrejection');
    rejection.reason = new Error('Rejected');
    window.dispatchEvent(rejection);

    flushStorageQueue();

    const list = getErrorReports();
    expect(list.length).toBe(2);
    expect(list.map((x) => x.source)).toEqual(
      expect.arrayContaining(['app.js', 'unhandledrejection']),
    );
  });

  it('initErrorMonitor uses fallbacks for missing fields', () => {
    initErrorMonitor();

    const errEvent = new ErrorEvent('error', { filename: 'x.js' });
    window.dispatchEvent(errEvent);

    const rejection = new Event('unhandledrejection');
    rejection.reason = 'plain';
    window.dispatchEvent(rejection);

    flushStorageQueue();
    const list = getErrorReports();
    expect(list.some((e) => e.message === 'Unhandled error')).toBe(true);
    expect(list.some((e) => e.message === 'plain')).toBe(true);
  });

  it('initErrorMonitor no-ops when window is missing', () => {
    vi.stubGlobal('window', undefined);
    expect(() => initErrorMonitor()).not.toThrow();
    vi.unstubAllGlobals();
  });

  it('clearErrorReports clears list', () => {
    reportError({ message: 'x' });
    flushStorageQueue();
    clearErrorReports();
    flushStorageQueue();
    expect(getErrorReports()).toEqual([]);
  });
});
