import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';

const STORAGE_KEY = 'guoman.logs.v1';
const MAX_LOGS = 200;

const normalizeLevel = (value) => {
  const level = String(value || '').toLowerCase();
  if (level === 'debug') return 'debug';
  if (level === 'info') return 'info';
  if (level === 'warn' || level === 'warning') return 'warn';
  if (level === 'error') return 'error';
  return 'info';
};

const readLogs = () => {
  const raw = hasPendingStorageWrite(STORAGE_KEY)
    ? getPendingStorageWriteValue(STORAGE_KEY)
    : safeLocalStorageGet(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLogs = (logs) => {
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
};

export const logMessage = ({ level = 'info', message, context, source } = {}) => {
  const text = typeof message === 'string' ? message : String(message || '');
  if (!text) return;

  const logs = readLogs();
  logs.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    level: normalizeLevel(level),
    message: text,
    context: context ?? null,
    source: source ?? null,
    at: Date.now(),
  });
  writeLogs(logs);
};

export const logDebug = (message, context, source) =>
  logMessage({ level: 'debug', message, context, source });

export const logInfo = (message, context, source) =>
  logMessage({ level: 'info', message, context, source });

export const logWarn = (message, context, source) =>
  logMessage({ level: 'warn', message, context, source });

export const logError = (message, context, source) =>
  logMessage({ level: 'error', message, context, source });

export const getLogs = () => readLogs();

export const clearLogs = () => {
  writeLogs([]);
};
