import { scheduleStorageWrite } from './storageQueue';

const CLS_KEY = 'guoman.perf.cls.v1';
const LCP_KEY = 'guoman.perf.lcp.v1';
const FID_KEY = 'guoman.perf.fid.v1';

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
  };
};
