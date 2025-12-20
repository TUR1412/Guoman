import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';

const STORAGE_KEY = STORAGE_KEYS.notifications;

const readStore = () => {
  const raw = safeLocalStorageGet(STORAGE_KEY);
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

export const getNotifications = () => readStore();

export const pushNotification = ({ title, body }) => {
  const list = readStore();
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    title: title || '系统通知',
    body: body || '你有一条新的提醒。',
    createdAt: Date.now(),
    read: false,
  };
  writeStore([entry, ...list].slice(0, 50));
  return entry;
};

export const markNotificationRead = (id) => {
  const list = readStore().map((item) => (item.id === id ? { ...item, read: true } : item));
  writeStore(list);
};

export const clearNotifications = () => {
  writeStore([]);
};

export const NOTIFICATIONS_STORAGE_KEY = STORAGE_KEY;
