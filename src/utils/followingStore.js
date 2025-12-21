import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';
import { pushNotification } from './notificationsStore';
import { trackEvent } from './analytics';

const STORAGE_KEY = STORAGE_KEYS.following;
const EVENT_KEY = 'guoman:following';

const normalizeId = (value) => {
  const id = Number(value);
  if (!Number.isFinite(id)) return null;
  if (!Number.isInteger(id)) return null;
  if (id <= 0) return null;
  return id;
};

let cachedPayload = null;
let cachedRaw = null;
let cachedEntries = null;
let cachedEntriesRaw = null;
let boundWindowListeners = false;
const listeners = new Set();

const getMonotonicNow = () => {
  const now = Date.now();
  const prev = cachedPayload?.meta?.lastWriteAt ?? 0;
  const next = Math.max(now, prev + 1);
  return next;
};

const readStorage = () => {
  if (typeof window === 'undefined') {
    return { version: 1, meta: { lastWriteAt: 0 }, items: {} };
  }

  const raw = hasPendingStorageWrite(STORAGE_KEY)
    ? getPendingStorageWriteValue(STORAGE_KEY)
    : safeLocalStorageGet(STORAGE_KEY);

  if (!raw) {
    if (cachedPayload && cachedRaw === null) return cachedPayload;
    cachedPayload = { version: 1, meta: { lastWriteAt: 0 }, items: {} };
    cachedRaw = null;
    if (!cachedEntries || cachedEntriesRaw !== null) {
      cachedEntries = [];
    }
    cachedEntriesRaw = null;
    return cachedPayload;
  }

  if (cachedPayload && cachedRaw === raw) return cachedPayload;

  try {
    const parsed = JSON.parse(raw);
    const items = parsed?.items && typeof parsed.items === 'object' ? parsed.items : {};
    const lastWriteAt =
      parsed?.meta && typeof parsed.meta === 'object' ? Number(parsed.meta.lastWriteAt) || 0 : 0;

    cachedPayload = { version: 1, meta: { lastWriteAt }, items };
    cachedRaw = raw;
    return cachedPayload;
  } catch {
    cachedPayload = { version: 1, meta: { lastWriteAt: 0 }, items: {} };
    cachedRaw = null;
    cachedEntries = null;
    cachedEntriesRaw = null;
    return cachedPayload;
  }
};

const writeStorage = (payload) => {
  cachedPayload = payload;
  cachedRaw = JSON.stringify(payload);
  cachedEntries = null;
  cachedEntriesRaw = null;
  scheduleStorageWrite(STORAGE_KEY, cachedRaw);
};

const emit = () => {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {}
  });

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent(EVENT_KEY));
    } catch {}
  }
};

const ensureWindowListeners = () => {
  if (boundWindowListeners || typeof window === 'undefined') return;
  boundWindowListeners = true;

  window.addEventListener('storage', (event) => {
    if (event?.key !== STORAGE_KEY) return;
    cachedRaw = event?.newValue ?? null;
    cachedPayload = null;
    cachedEntries = null;
    cachedEntriesRaw = null;
    emit();
  });

  window.addEventListener('guoman:storage', (event) => {
    const key = event?.detail?.key;
    if (key !== STORAGE_KEY) return;
    cachedRaw = typeof event?.detail?.value === 'string' ? event.detail.value : null;
    cachedPayload = null;
    cachedEntries = null;
    cachedEntriesRaw = null;
    emit();
  });
};

export const subscribeFollowing = (listener) => {
  ensureWindowListeners();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const isFollowing = (animeId) => {
  const id = normalizeId(animeId);
  if (id === null) return false;
  const payload = readStorage();
  return Boolean(payload.items[String(id)]);
};

export const getFollowingEntries = () => {
  const payload = readStorage();
  const raw = cachedRaw;
  if (cachedEntries && cachedEntriesRaw === raw) return cachedEntries;

  const items = payload.items || {};
  const next = Object.entries(items)
    .map(([id, value]) => ({
      animeId: Number.parseInt(id, 10),
      title: value?.title || '',
      createdAt: value?.createdAt || 0,
      updatedAt: value?.updatedAt || 0,
      reminderAt: value?.reminderAt ?? null,
      remindBeforeMinutes: value?.remindBeforeMinutes ?? 30,
      reminderEnabled: Boolean(value?.reminderEnabled),
      lastNotifiedAt: value?.lastNotifiedAt || 0,
      note: value?.note || '',
    }))
    .filter((entry) => entry.animeId)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  cachedEntries = next;
  cachedEntriesRaw = raw;
  return next;
};

export const toggleFollowing = ({ animeId, title } = {}) => {
  const id = normalizeId(animeId);
  if (id === null) return { ok: false, action: 'noop', entry: null };

  const payload = readStorage();
  const key = String(id);
  const exists = Boolean(payload.items[key]);
  const now = getMonotonicNow();

  if (exists) {
    delete payload.items[key];
    payload.meta.lastWriteAt = now;
    writeStorage(payload);
    trackEvent('following.remove', { id });
    emit();
    return { ok: true, action: 'unfollowed', entry: null };
  }

  const entry = {
    title: String(title || '').trim(),
    createdAt: now,
    updatedAt: now,
    reminderAt: null,
    remindBeforeMinutes: 30,
    reminderEnabled: false,
    lastNotifiedAt: 0,
    note: '',
  };

  payload.items[key] = entry;
  payload.meta.lastWriteAt = now;
  writeStorage(payload);
  trackEvent('following.add', { id });
  emit();
  return { ok: true, action: 'followed', entry: { animeId: id, ...entry } };
};

export const updateFollowingReminder = (
  animeId,
  { reminderAt = null, remindBeforeMinutes = 30, reminderEnabled = true, note = undefined } = {},
) => {
  const id = normalizeId(animeId);
  if (id === null) return null;

  const payload = readStorage();
  const key = String(id);
  const existing = payload.items[key];
  if (!existing) return null;

  const now = getMonotonicNow();
  const normalizedMinutes = Math.min(Math.max(Number(remindBeforeMinutes) || 0, 0), 24 * 60);
  const normalizedAt = reminderAt ? Number(reminderAt) : null;

  payload.items[key] = {
    ...existing,
    updatedAt: now,
    reminderEnabled: Boolean(reminderEnabled),
    remindBeforeMinutes: normalizedMinutes,
    reminderAt: normalizedAt && Number.isFinite(normalizedAt) ? normalizedAt : null,
    note: typeof note === 'string' ? note : existing.note || '',
  };

  payload.meta.lastWriteAt = now;
  writeStorage(payload);
  trackEvent('following.reminder.update', {
    id,
    enabled: Boolean(reminderEnabled),
    minutes: normalizedMinutes,
    hasAt: Boolean(payload.items[key].reminderAt),
  });
  emit();
  return { animeId: id, ...payload.items[key] };
};

export const clearFollowing = () => {
  const payload = readStorage();
  payload.items = {};
  payload.meta.lastWriteAt = getMonotonicNow();
  writeStorage(payload);
  trackEvent('following.clear');
  emit();
};

export const getDueFollowingReminders = ({ now = Date.now() } = {}) => {
  const payload = readStorage();
  const items = payload.items || {};
  const timestamp = Number(now) || Date.now();

  return Object.entries(items)
    .map(([id, value]) => ({
      animeId: Number.parseInt(id, 10),
      title: value?.title || '',
      reminderAt: value?.reminderAt ?? null,
      remindBeforeMinutes: value?.remindBeforeMinutes ?? 30,
      reminderEnabled: Boolean(value?.reminderEnabled),
      lastNotifiedAt: value?.lastNotifiedAt || 0,
    }))
    .filter((entry) => {
      if (!entry.animeId) return false;
      if (!entry.reminderEnabled) return false;
      if (!entry.reminderAt || !Number.isFinite(entry.reminderAt)) return false;

      const fireAt = entry.reminderAt - entry.remindBeforeMinutes * 60 * 1000;
      if (timestamp < fireAt) return false;
      return entry.lastNotifiedAt < fireAt;
    })
    .sort((a, b) => (a.reminderAt || 0) - (b.reminderAt || 0));
};

export const fireDueFollowingReminders = ({ now = Date.now() } = {}) => {
  const due = getDueFollowingReminders({ now });
  if (due.length === 0) return [];

  const payload = readStorage();
  const timestamp = Number(now) || Date.now();

  due.forEach((entry) => {
    const key = String(entry.animeId);
    const existing = payload.items[key];
    if (!existing) return;

    const fireAt = entry.reminderAt - entry.remindBeforeMinutes * 60 * 1000;
    payload.items[key] = {
      ...existing,
      lastNotifiedAt: Math.max(existing.lastNotifiedAt || 0, fireAt),
    };

    pushNotification({
      title: `追更提醒：${entry.title || `作品 #${entry.animeId}`}`,
      body: entry.remindBeforeMinutes
        ? `距离开播时间还有 ${entry.remindBeforeMinutes} 分钟，准备开看。`
        : '到点开看啦。',
    });
  });

  payload.meta.lastWriteAt = Math.max(payload.meta.lastWriteAt || 0, timestamp);
  writeStorage(payload);
  trackEvent('following.reminder.fire', { count: due.length });
  emit();
  return due;
};

export const FOLLOWING_STORAGE_KEY = STORAGE_KEY;
export const FOLLOWING_EVENT_KEY = EVENT_KEY;
