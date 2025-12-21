import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';

const STORAGE_KEY = STORAGE_KEYS.feedback;

const readStore = () => {
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

const writeStore = (list) => {
  scheduleStorageWrite(STORAGE_KEY, JSON.stringify(list));
};

export const getFeedbackList = () => readStore();

export const submitFeedback = ({ message, contact }) => {
  if (!message) return null;
  const list = readStore();
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    message,
    contact: contact || '',
    createdAt: Date.now(),
    status: 'new',
  };
  writeStore([entry, ...list].slice(0, 50));
  return entry;
};

export const clearFeedback = () => {
  writeStore([]);
};

export const FEEDBACK_STORAGE_KEY = STORAGE_KEY;
