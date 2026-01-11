import { scheduleStorageWrite } from './storageQueue';

const CLS_KEY = 'guoman.perf.cls.v1';
const LCP_KEY = 'guoman.perf.lcp.v1';
const FID_KEY = 'guoman.perf.fid.v1';
const INP_KEY = 'guoman.perf.inp.v1';

const safeStore = (key, payload) => {
  try {
    scheduleStorageWrite(key, JSON.stringify(payload));
  } catch {}
};

export const initPerformanceMonitor = () => {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  let clsValue = 0;
  let clsEntries = [];
  const clsObserver = new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach((entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        clsEntries.push({
          value: entry.value,
          sources: entry.sources?.map((source) => source.node?.tagName).filter(Boolean),
        });
      }
    });
    safeStore(CLS_KEY, { value: clsValue, entries: clsEntries.slice(-10), at: Date.now() });
  });

  try {
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch {}

  let lcpEntry = null;
  const lcpObserver = new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    if (entries.length > 0) {
      lcpEntry = entries[entries.length - 1];
      safeStore(LCP_KEY, {
        value: lcpEntry.startTime,
        element: lcpEntry.element?.tagName,
        at: Date.now(),
      });
    }
  });

  try {
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch {}

  const fidObserver = new PerformanceObserver((entryList) => {
    const entry = entryList.getEntries()[0];
    if (!entry) return;
    safeStore(FID_KEY, {
      value: entry.processingStart - entry.startTime,
      at: Date.now(),
    });
  });

  try {
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch {}

  // INP（Interaction to Next Paint）是 FID 的后继指标；这里用 Event Timing 做近似采样。
  // 目标：用最小实现成本记录一个可用于诊断的 INP 快照（local-first，无远程依赖）。
  const interactionDurations = new Map();
  const MAX_INTERACTIONS = 50;

  const storeInpSnapshot = () => {
    const values = Array.from(interactionDurations.values()).filter((n) => Number.isFinite(n));
    if (!values.length) return;

    values.sort((a, b) => a - b);
    const index = Math.max(0, Math.floor(values.length * 0.98) - 1);
    safeStore(INP_KEY, { value: values[index], samples: values.length, at: Date.now() });
  };

  const inpObserver = new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach((entry) => {
      const id = Number(entry.interactionId);
      const duration = Number(entry.duration);
      if (!id || !Number.isFinite(duration)) return;

      const prev = interactionDurations.get(id) || 0;
      interactionDurations.set(id, Math.max(prev, duration));
    });

    if (interactionDurations.size > MAX_INTERACTIONS) {
      const overflow = interactionDurations.size - MAX_INTERACTIONS;
      for (let i = 0; i < overflow; i += 1) {
        const firstKey = interactionDurations.keys().next().value;
        interactionDurations.delete(firstKey);
      }
    }

    storeInpSnapshot();
  });

  try {
    inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 });
  } catch {}
};

export const getPerformanceSnapshot = () => {
  if (typeof window === 'undefined') return null;
  const read = (key) => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  return {
    cls: read(CLS_KEY),
    lcp: read(LCP_KEY),
    fid: read(FID_KEY),
    inp: read(INP_KEY),
  };
};
