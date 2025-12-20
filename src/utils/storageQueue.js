import { safeLocalStorageRemove, safeLocalStorageSet } from './storage';

const pendingWrites = new Map();
let scheduled = false;
let idleHandle = null;
let timeoutHandle = null;
let initialized = false;

const flushWrites = () => {
  scheduled = false;
  if (idleHandle && typeof window !== 'undefined' && window.cancelIdleCallback) {
    window.cancelIdleCallback(idleHandle);
  }
  if (timeoutHandle) {
    clearTimeout(timeoutHandle);
  }
  idleHandle = null;
  timeoutHandle = null;

  const entries = Array.from(pendingWrites.entries());
  pendingWrites.clear();

  entries.forEach(([key, value]) => {
    if (value === null || typeof value === 'undefined') {
      safeLocalStorageRemove(key);
    } else {
      safeLocalStorageSet(key, value);
    }
  });
};

const scheduleFlush = (delay = 180) => {
  if (scheduled) return;
  scheduled = true;

  if (typeof window === 'undefined') {
    timeoutHandle = setTimeout(flushWrites, delay);
    return;
  }

  if (typeof window.requestIdleCallback === 'function') {
    idleHandle = window.requestIdleCallback(flushWrites, { timeout: delay * 2 });
    return;
  }

  timeoutHandle = window.setTimeout(flushWrites, delay);
};

const ensureLifecycleFlush = () => {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      flushWrites();
    }
  };

  const onBeforeUnload = () => flushWrites();

  window.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onBeforeUnload);
  window.addEventListener('beforeunload', onBeforeUnload);
};

export const scheduleStorageWrite = (key, value, { delay = 180 } = {}) => {
  if (!key) return;
  ensureLifecycleFlush();
  pendingWrites.set(key, value);
  scheduleFlush(delay);
};

export const flushStorageQueue = () => flushWrites();

export const hasPendingStorageWrite = (key) => {
  if (!key) return false;
  return pendingWrites.has(key);
};
