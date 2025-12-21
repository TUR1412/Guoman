import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';
import { trackEvent } from './analytics';

const STORAGE_KEY = STORAGE_KEYS.proMembership;
const EVENT_KEY = 'guoman:pro';

const defaultMembership = Object.freeze({
  version: 1,
  enabled: false,
  plan: 'free',
  startedAt: null,
  updatedAt: 0,
});

let cached = null;
let cachedRaw = null;
let windowBound = false;
const listeners = new Set();

const normalizePlan = (value) => {
  const plan = String(value || '')
    .trim()
    .toLowerCase();
  if (plan === 'supporter' || plan === 'studio') return plan;
  return 'free';
};

const readStorage = () => {
  if (typeof window === 'undefined') return defaultMembership;

  const raw = hasPendingStorageWrite(STORAGE_KEY)
    ? getPendingStorageWriteValue(STORAGE_KEY)
    : safeLocalStorageGet(STORAGE_KEY);

  if (!raw) {
    if (cached && cachedRaw === null) return cached;
    cached = { ...defaultMembership };
    cachedRaw = null;
    return cached;
  }

  if (cached && cachedRaw === raw) return cached;

  try {
    const parsed = JSON.parse(raw);
    const enabled = Boolean(parsed?.enabled);
    const plan = normalizePlan(parsed?.plan);
    const startedAt = parsed?.startedAt ? Number(parsed.startedAt) : null;
    const updatedAt = parsed?.updatedAt ? Number(parsed.updatedAt) : 0;

    cached = {
      version: 1,
      enabled,
      plan: enabled ? plan : 'free',
      startedAt: enabled && Number.isFinite(startedAt) ? startedAt : null,
      updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0,
    };
    cachedRaw = raw;
    return cached;
  } catch {
    cached = { ...defaultMembership };
    cachedRaw = null;
    return cached;
  }
};

const writeStorage = (next) => {
  cached = next;
  cachedRaw = JSON.stringify(next);
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
  if (windowBound || typeof window === 'undefined') return;
  windowBound = true;

  window.addEventListener('storage', (event) => {
    if (event?.key !== STORAGE_KEY) return;
    cachedRaw = event?.newValue ?? null;
    cached = null;
    emit();
  });

  window.addEventListener('guoman:storage', (event) => {
    const key = event?.detail?.key;
    if (key !== STORAGE_KEY) return;
    cachedRaw = typeof event?.detail?.value === 'string' ? event.detail.value : null;
    cached = null;
    emit();
  });
};

export const subscribeProMembership = (listener) => {
  ensureWindowListeners();
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getProMembership = () => readStorage();

export const isProEnabled = () => Boolean(readStorage().enabled);

export const setProMembership = ({ enabled, plan } = {}) => {
  const now = Date.now();
  const nextEnabled = Boolean(enabled);
  const nextPlan = nextEnabled ? normalizePlan(plan) : 'free';

  const next = {
    version: 1,
    enabled: nextEnabled,
    plan: nextPlan,
    startedAt: nextEnabled ? now : null,
    updatedAt: now,
  };

  writeStorage(next);
  trackEvent('pro.set', { enabled: nextEnabled, plan: nextPlan });
  emit();
  return next;
};

export const toggleProMembership = ({ plan = 'supporter' } = {}) => {
  const current = readStorage();
  return setProMembership({ enabled: !current.enabled, plan });
};

export const clearProMembership = () => {
  const now = Date.now();
  const next = { ...defaultMembership, updatedAt: now };
  writeStorage(next);
  trackEvent('pro.clear');
  emit();
  return next;
};

export const PRO_STORAGE_KEY = STORAGE_KEY;
export const PRO_EVENT_KEY = EVENT_KEY;
