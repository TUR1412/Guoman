import { afterEach, describe, expect, it, vi } from 'vitest';

const loadHealthConsole = async ({
  featureSummaries = [
    { key: 'a', label: 'A', count: 1, bytes: 1200 },
    { key: 'b', label: 'B', count: 2, bytes: 42 },
    { key: 'c', label: 'C', count: 3, bytes: 9999 },
  ],
  errorReports = [
    { at: Date.now(), message: 'E1', source: 'unit' },
    { at: Date.now(), message: 'E2', source: 'unit' },
    { at: Date.now(), message: 'E3', source: 'unit' },
    { at: Date.now(), message: 'E4', source: 'unit' },
    { at: Date.now(), message: 'E5', source: 'unit' },
    { at: Date.now(), message: 'E6', source: 'unit' },
  ],
  logs = [
    { at: Date.now(), level: 'info', message: 'L1', source: 'unit' },
    { at: Date.now(), level: 'warn', message: 'L2', source: 'unit' },
    { at: Date.now(), level: 'error', message: 'L3', source: 'unit' },
    { at: Date.now(), level: 'debug', message: 'L4', source: 'unit' },
    { at: Date.now(), level: 'info', message: 'L5', source: 'unit' },
    { at: Date.now(), level: 'info', message: 'L6', source: 'unit' },
  ],
  perfSnapshot = { fps: 60, longTasks: 0 },
} = {}) => {
  vi.resetModules();
  vi.doMock('./dataVault', () => ({
    getFeatureSummaries: () => featureSummaries,
  }));
  vi.doMock('./errorReporter', () => ({
    getErrorReports: () => errorReports,
  }));
  vi.doMock('./logger', () => ({
    getLogs: () => logs,
  }));
  vi.doMock('./performance', () => ({
    getPerformanceSnapshot: () => perfSnapshot,
  }));

  return import('./healthConsole');
};

const setPerformanceMemory = (value) => {
  Object.defineProperty(globalThis.performance, 'memory', {
    configurable: true,
    value,
  });
};

describe('healthConsole', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    setPerformanceMemory(undefined);
    delete window.__GUOMAN_HEALTH__;
  });

  it('builds a stable health snapshot with storage/errors/perf', async () => {
    setPerformanceMemory({
      usedJSHeapSize: 1_048_576,
      totalJSHeapSize: 2_097_152,
      jsHeapSizeLimit: 16_777_216,
    });

    const {
      getHealthSnapshot,
      installHealthConsole,
      printHealthPanorama,
      recordReactCommit,
      startHealthMonitoring,
      stopHealthMonitoring,
    } = await loadHealthConsole();

    // commits + trimming path
    for (let i = 0; i < 140; i += 1) {
      recordReactCommit(`c${i}`, 'mount', i, i + 1, i + 2, i + 3);
    }
    recordReactCommit('bad', 'update', NaN, Infinity, undefined, null);

    const snap = getHealthSnapshot();
    expect(typeof snap.at).toBe('string');
    expect(snap.perf).toEqual({ fps: 60, longTasks: 0 });
    expect(Array.isArray(snap.storage)).toBe(true);
    expect(Array.isArray(snap.recentErrors)).toBe(true);
    expect(snap.recentErrors.length).toBeLessThanOrEqual(5);
    expect(typeof snap.logCount).toBe('number');
    expect(Array.isArray(snap.recentLogs)).toBe(true);
    expect(snap.recentLogs.length).toBeLessThanOrEqual(5);
    expect(snap.memory).toMatchObject({
      used: 1_048_576,
      total: 2_097_152,
      limit: 16_777_216,
    });

    // storage should be sorted by bytes desc and include a formatted text
    expect(snap.storage[0].bytes).toBeGreaterThanOrEqual(snap.storage[1].bytes);
    expect(typeof snap.storage[0].bytesText).toBe('string');

    // printing
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    printHealthPanorama();
    expect(warnSpy).toHaveBeenCalled();

    // install is idempotent
    const api1 = installHealthConsole();
    const api2 = installHealthConsole();
    expect(api1).toBe(api2);
    expect(typeof api1.snapshot).toBe('function');

    // start/stop should not throw
    startHealthMonitoring({ loopIntervalMs: 1, memoryIntervalMs: 1 });
    stopHealthMonitoring();
  });

  it('starts monitoring, samples loop/memory, and manages observers/timers', async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis.performance, 'now').mockImplementation(() => Date.now());

    setPerformanceMemory({
      usedJSHeapSize: 123,
      totalJSHeapSize: 456,
      jsHeapSizeLimit: 789,
    });

    const observerInstances = [];
    class FakePerformanceObserver {
      constructor(callback) {
        this._callback = callback;
        this.observe = vi.fn();
        this.disconnect = vi.fn();
        observerInstances.push(this);
      }
      trigger(entries) {
        this._callback({ getEntries: () => entries });
      }
    }

    vi.stubGlobal('PerformanceObserver', FakePerformanceObserver);

    const { getHealthSnapshot, startHealthMonitoring, stopHealthMonitoring } =
      await loadHealthConsole();

    const setIntervalSpy = vi.spyOn(window, 'setInterval');

    startHealthMonitoring({ loopIntervalMs: 10, memoryIntervalMs: 10 });
    startHealthMonitoring({ loopIntervalMs: 10, memoryIntervalMs: 10 }); // guard branch

    expect(setIntervalSpy).toHaveBeenCalledTimes(2);
    expect(observerInstances.length).toBe(1);

    observerInstances[0].trigger(
      Array.from({ length: 80 }, (_, index) => ({
        duration: 10 + index,
        startTime: 5 + index,
      })),
    );

    // Advance far enough to exceed MAX_SAMPLES (120) for both loopLag (250ms min)
    // and memory samples (1000ms min), covering trimming branches.
    await vi.advanceTimersByTimeAsync(121_000);

    const snap = getHealthSnapshot();
    expect(snap.lag.samples).toBeGreaterThan(0);
    expect(snap.longTasks.count).toBeGreaterThan(0);
    expect(snap.memory).not.toBeNull();

    stopHealthMonitoring();
    stopHealthMonitoring(); // idempotent

    expect(observerInstances[0].disconnect).toHaveBeenCalled();
  });

  it('handles missing window/document/navigator safely', async () => {
    setPerformanceMemory({
      usedJSHeapSize: NaN,
      totalJSHeapSize: 2,
      jsHeapSizeLimit: 3,
    });

    vi.stubGlobal('window', undefined);
    vi.stubGlobal('document', undefined);
    vi.stubGlobal('navigator', undefined);

    const { getHealthSnapshot, installHealthConsole, startHealthMonitoring, stopHealthMonitoring } =
      await loadHealthConsole();

    expect(installHealthConsole()).toBeNull();
    expect(() => startHealthMonitoring()).not.toThrow();
    expect(() => stopHealthMonitoring()).not.toThrow();

    const snap = getHealthSnapshot();
    expect(snap.url).toBeNull();
    expect(snap.visibility).toBeNull();
    expect(snap.sw).toBeNull();
    expect(snap.memory).toBeNull();
  });

  it('covers sw/controller branches and interval fallbacks', async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis.performance, 'now').mockImplementation(() => Date.now());

    // Ensure sampleMemory hits the early-return branch (no performance.memory).
    setPerformanceMemory(undefined);

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { controller: {} },
    });

    const { getHealthSnapshot, printHealthPanorama, startHealthMonitoring, stopHealthMonitoring } =
      await loadHealthConsole();

    // loopIntervalMs=0 and memoryIntervalMs=0 should trigger the fallback paths.
    startHealthMonitoring({ loopIntervalMs: 0, memoryIntervalMs: 0 });
    stopHealthMonitoring();

    const snap = getHealthSnapshot();
    expect(snap.sw).toEqual({ supported: true, controlling: true });

    vi.stubGlobal('console', undefined);
    expect(() => printHealthPanorama()).not.toThrow();
  });

  it('bails out gracefully when longtask observer disconnect throws', async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis.performance, 'now').mockImplementation(() => Date.now());

    setPerformanceMemory({
      usedJSHeapSize: 123,
      totalJSHeapSize: 456,
      jsHeapSizeLimit: 789,
    });

    class FakePerformanceObserver {
      constructor() {
        this.observe = vi.fn();
        this.disconnect = vi.fn(() => {
          throw new Error('boom');
        });
      }
    }

    vi.stubGlobal('PerformanceObserver', FakePerformanceObserver);

    const { startHealthMonitoring, stopHealthMonitoring } = await loadHealthConsole();

    startHealthMonitoring({ loopIntervalMs: 10, memoryIntervalMs: 10 });
    expect(() => stopHealthMonitoring()).not.toThrow();
  });
});
