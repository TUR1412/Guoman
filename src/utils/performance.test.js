import { describe, expect, it, vi } from 'vitest';

describe('performance monitor', () => {
  it('initPerformanceMonitor safely no-ops without PerformanceObserver', async () => {
    vi.resetModules();
    const original = globalThis.PerformanceObserver;
    globalThis.PerformanceObserver = undefined;

    const { initPerformanceMonitor } = await import('./performance');
    expect(() => initPerformanceMonitor()).not.toThrow();

    globalThis.PerformanceObserver = original;
  });

  it('initPerformanceMonitor safely no-ops without window', async () => {
    vi.resetModules();
    vi.stubGlobal('window', undefined);
    const { initPerformanceMonitor } = await import('./performance');
    expect(() => initPerformanceMonitor()).not.toThrow();
    vi.unstubAllGlobals();
  });

  it('collects CLS/LCP/FID snapshots', async () => {
    vi.resetModules();
    const { flushStorageQueue } = await import('./storageQueue');
    window.localStorage.clear();
    flushStorageQueue();

    const originalObserver = globalThis.PerformanceObserver;
    const observers = [];

    class FakePerformanceObserver {
      constructor(callback) {
        this.callback = callback;
        this.options = null;
        observers.push(this);
      }

      observe(options) {
        this.options = options;
      }
    }

    globalThis.PerformanceObserver = FakePerformanceObserver;

    try {
      const { getPerformanceSnapshot, initPerformanceMonitor } = await import('./performance');
      initPerformanceMonitor();

      const find = (type) => observers.find((o) => o.options?.type === type);

      find('layout-shift').callback({
        getEntries: () => [
          { value: 0.1, hadRecentInput: false, sources: [{ node: { tagName: 'DIV' } }] },
          { value: 0.2, hadRecentInput: true, sources: [{ node: { tagName: 'SPAN' } }] },
        ],
      });

      find('largest-contentful-paint').callback({
        getEntries: () => [{ startTime: 123, element: { tagName: 'IMG' } }],
      });

      find('first-input').callback({
        getEntries: () => [{ startTime: 100, processingStart: 130 }],
      });

      find('event').callback({
        getEntries: () => [
          { interactionId: 1, duration: 80 },
          { interactionId: 1, duration: 120 },
          { interactionId: 2, duration: 60 },
        ],
      });

      flushStorageQueue();

      const snapshot = getPerformanceSnapshot();
      expect(snapshot).toEqual(
        expect.objectContaining({
          cls: expect.objectContaining({ value: expect.any(Number) }),
          lcp: expect.objectContaining({ value: 123, element: 'IMG' }),
          fid: expect.objectContaining({ value: 30 }),
          inp: expect.objectContaining({ value: expect.any(Number) }),
        }),
      );
    } finally {
      globalThis.PerformanceObserver = originalObserver;
    }
  });

  it('getPerformanceSnapshot returns null without window', async () => {
    vi.resetModules();
    vi.stubGlobal('window', undefined);

    const { getPerformanceSnapshot } = await import('./performance');
    expect(getPerformanceSnapshot()).toBeNull();
    vi.unstubAllGlobals();
  });

  it('tolerates invalid stored snapshots', async () => {
    vi.resetModules();
    const { getPerformanceSnapshot } = await import('./performance');

    window.localStorage.clear();
    window.localStorage.setItem('guoman.perf.cls.v1', '{bad');
    expect(getPerformanceSnapshot()).toEqual({ cls: null, lcp: null, fid: null, inp: null });
  });

  it('does not throw when observe is not supported', async () => {
    vi.resetModules();

    const originalObserver = globalThis.PerformanceObserver;
    class ThrowingObserver {
      constructor() {}
      observe() {
        throw new Error('unsupported');
      }
    }

    globalThis.PerformanceObserver = ThrowingObserver;

    const { initPerformanceMonitor } = await import('./performance');
    expect(() => initPerformanceMonitor()).not.toThrow();

    globalThis.PerformanceObserver = originalObserver;
  });
});
