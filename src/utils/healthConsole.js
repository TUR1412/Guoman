import { getFeatureSummaries } from './dataVault';
import { getErrorReports } from './errorReporter';
import { getLogs } from './logger';
import { getPerformanceSnapshot } from './performance';
import { formatBytes } from './formatBytes';

const MAX_SAMPLES = 120;
const MAX_LONGTASKS = 60;
const MAX_COMMITS = 120;

const now = () =>
  typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();

const safeRound = (value, digits = 1) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  const factor = 10 ** digits;
  return Math.round(num * factor) / factor;
};

const state = {
  startedAt: Date.now(),
  longTasks: [],
  commits: [],
  loopLag: {
    lastTickAt: null,
    samples: [],
    maxMs: 0,
  },
  memory: {
    samples: [],
  },
  observers: {
    longTask: null,
  },
  timers: {
    loop: null,
    memory: null,
  },
};

export const recordReactCommit = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
) => {
  state.commits.push({
    at: Date.now(),
    id,
    phase,
    actualDuration: safeRound(actualDuration, 2),
    baseDuration: safeRound(baseDuration, 2),
    startTime: safeRound(startTime, 2),
    commitTime: safeRound(commitTime, 2),
  });
  if (state.commits.length > MAX_COMMITS)
    state.commits.splice(0, state.commits.length - MAX_COMMITS);
};

const getMemorySnapshot = () => {
  const memory = performance?.memory;
  if (!memory) return null;
  const used = Number(memory.usedJSHeapSize);
  const total = Number(memory.totalJSHeapSize);
  const limit = Number(memory.jsHeapSizeLimit);
  if (![used, total, limit].every((n) => Number.isFinite(n))) return null;

  return {
    used,
    total,
    limit,
    usedText: formatBytes(used),
    totalText: formatBytes(total),
    limitText: formatBytes(limit),
  };
};

const sampleEventLoopLag = () => {
  const expected = state.loopLag.lastTickAt;
  const current = now();
  state.loopLag.lastTickAt = current;
  if (expected == null) return;

  const delta = current - expected;
  const lag = Math.max(0, delta - 1000);
  state.loopLag.samples.push(safeRound(lag, 2));
  if (state.loopLag.samples.length > MAX_SAMPLES) {
    state.loopLag.samples.splice(0, state.loopLag.samples.length - MAX_SAMPLES);
  }
  state.loopLag.maxMs = Math.max(state.loopLag.maxMs, lag);
};

const sampleMemory = () => {
  const snap = getMemorySnapshot();
  if (!snap) return;
  state.memory.samples.push({
    at: Date.now(),
    used: snap.used,
    total: snap.total,
    limit: snap.limit,
  });
  if (state.memory.samples.length > MAX_SAMPLES) {
    state.memory.samples.splice(0, state.memory.samples.length - MAX_SAMPLES);
  }
};

const startLongTaskObserver = () => {
  if (typeof PerformanceObserver === 'undefined') return;
  if (state.observers.longTask) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        state.longTasks.push({
          at: Date.now(),
          duration: safeRound(entry.duration, 2),
          startTime: safeRound(entry.startTime, 2),
        });
      });
      if (state.longTasks.length > MAX_LONGTASKS) {
        state.longTasks.splice(0, state.longTasks.length - MAX_LONGTASKS);
      }
    });

    observer.observe({ type: 'longtask', buffered: true });
    state.observers.longTask = observer;
  } catch {}
};

const stopLongTaskObserver = () => {
  const observer = state.observers.longTask;
  if (!observer) return;
  try {
    observer.disconnect();
  } catch {}
  state.observers.longTask = null;
};

const summarizeLag = () => {
  const list = state.loopLag.samples;
  if (!list.length) return { avg: null, max: safeRound(state.loopLag.maxMs, 2), samples: 0 };
  const sum = list.reduce((acc, n) => acc + (Number(n) || 0), 0);
  return {
    avg: safeRound(sum / list.length, 2),
    max: safeRound(state.loopLag.maxMs, 2),
    samples: list.length,
  };
};

const summarizeLongTasks = () => {
  const list = state.longTasks;
  if (!list.length) return { count: 0, max: null, total: null };

  let total = 0;
  let max = 0;
  list.forEach((item) => {
    const d = Number(item.duration) || 0;
    total += d;
    max = Math.max(max, d);
  });

  return {
    count: list.length,
    max: safeRound(max, 2),
    total: safeRound(total, 2),
  };
};

const summarizeCommits = () => {
  const list = state.commits;
  if (!list.length) return { count: 0, p95: null, max: null };
  const durations = list.map((x) => Number(x.actualDuration) || 0).sort((a, b) => a - b);
  const p95Index = Math.max(0, Math.floor(durations.length * 0.95) - 1);
  return {
    count: durations.length,
    p95: safeRound(durations[p95Index], 2),
    max: safeRound(durations[durations.length - 1], 2),
  };
};

export const getHealthSnapshot = () => {
  const memory = getMemorySnapshot();
  const perf = getPerformanceSnapshot();
  const errors = getErrorReports();
  const logs = getLogs();

  return {
    at: new Date().toISOString(),
    uptimeSeconds: safeRound((Date.now() - state.startedAt) / 1000, 1),
    url: typeof window !== 'undefined' ? window.location.href : null,
    visibility: typeof document !== 'undefined' ? document.visibilityState : null,
    perf,
    lag: summarizeLag(),
    longTasks: summarizeLongTasks(),
    reactCommits: summarizeCommits(),
    memory,
    storage: getFeatureSummaries()
      .map((x) => ({
        feature: x.key,
        label: x.label,
        count: x.count,
        bytes: x.bytes,
        bytesText: formatBytes(x.bytes),
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 12),
    recentErrors: errors
      .slice(0, 5)
      .map((e) => ({ at: e.at, message: e.message, source: e.source })),
    logCount: Array.isArray(logs) ? logs.length : 0,
    recentLogs: (Array.isArray(logs) ? logs : []).slice(0, 5).map((entry) => ({
      at: entry.at,
      level: entry.level,
      message: entry.message,
      source: entry.source,
    })),
    sw:
      typeof navigator !== 'undefined'
        ? {
            supported: 'serviceWorker' in navigator,
            controlling: Boolean(navigator.serviceWorker?.controller),
          }
        : null,
  };
};

export const printHealthPanorama = () => {
  if (typeof console === 'undefined') return;
  const snap = getHealthSnapshot();
  console.warn('[Guoman] 系统健康全景图', snap);
};

export const startHealthMonitoring = ({ loopIntervalMs = 1000, memoryIntervalMs = 5000 } = {}) => {
  if (typeof window === 'undefined') return;

  if (state.timers.loop) return;

  state.loopLag.lastTickAt = now();
  state.timers.loop = window.setInterval(
    sampleEventLoopLag,
    Math.max(250, Number(loopIntervalMs) || 1000),
  );

  state.timers.memory = window.setInterval(
    sampleMemory,
    Math.max(1000, Number(memoryIntervalMs) || 5000),
  );
  sampleMemory();

  startLongTaskObserver();
};

export const stopHealthMonitoring = () => {
  if (typeof window === 'undefined') return;

  if (state.timers.loop) {
    window.clearInterval(state.timers.loop);
    state.timers.loop = null;
  }
  if (state.timers.memory) {
    window.clearInterval(state.timers.memory);
    state.timers.memory = null;
  }

  stopLongTaskObserver();
};

export const installHealthConsole = () => {
  if (typeof window === 'undefined') return null;
  if (window.__GUOMAN_HEALTH__) return window.__GUOMAN_HEALTH__;

  const api = Object.freeze({
    start: startHealthMonitoring,
    stop: stopHealthMonitoring,
    snapshot: getHealthSnapshot,
    print: printHealthPanorama,
  });

  window.__GUOMAN_HEALTH__ = api;
  return api;
};
