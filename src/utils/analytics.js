import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';

const MAX_EVENTS = 200;
const EVENT_KEY = STORAGE_KEYS.analyticsEvents;

const readEvents = () => {
  const raw = hasPendingStorageWrite(EVENT_KEY)
    ? getPendingStorageWriteValue(EVENT_KEY)
    : safeLocalStorageGet(EVENT_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeEvents = (events) => {
  scheduleStorageWrite(EVENT_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)));
};

export const trackEvent = (name, payload = {}) => {
  if (!name) return;
  const events = readEvents();
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name,
    payload,
    at: Date.now(),
  };
  events.unshift(entry);
  writeEvents(events);
};

export const getEvents = () => readEvents();

export const getEventStats = () => {
  const events = readEvents();
  const counts = events.reduce((acc, event) => {
    acc[event.name] = (acc[event.name] || 0) + 1;
    return acc;
  }, {});
  return { total: events.length, counts };
};

export const clearEvents = () => {
  scheduleStorageWrite(EVENT_KEY, JSON.stringify([]));
};
