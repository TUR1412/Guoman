import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';

const STORAGE_KEY = 'guoman.errors.v1';
const MAX_ERRORS = 50;

const readErrors = () => {
  const raw = safeLocalStorageGet(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeErrors = (list) => {
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ERRORS)));
};

export const reportError = ({ message, stack, source }) => {
  if (!message) return;
  const list = readErrors();
  list.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    message,
    stack,
    source,
    at: Date.now(),
  });
  writeErrors(list);
};

export const getErrorReports = () => readErrors();

export const clearErrorReports = () => {
  writeErrors([]);
};

export const initErrorMonitor = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    reportError({
      message: event?.message || 'Unhandled error',
      stack: event?.error?.stack,
      source: event?.filename,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    reportError({
      message: event?.reason?.message || String(event?.reason || 'Unhandled rejection'),
      stack: event?.reason?.stack,
      source: 'unhandledrejection',
    });
  });
};
