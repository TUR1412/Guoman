import { useEffect, useMemo, useState } from 'react';
import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';

const identity = (value) => value;

const readStoredValue = (key, fallback, deserialize) => {
  if (typeof window === 'undefined') return fallback;
  const raw = safeLocalStorageGet(key);
  if (raw === null || typeof raw === 'undefined') return fallback;

  if (deserialize) {
    try {
      return deserialize(raw);
    } catch {
      return fallback;
    }
  }

  return raw;
};

export const usePersistedState = (
  key,
  defaultValue,
  { serialize = identity, deserialize = identity, delay = 180 } = {},
) => {
  const initial = useMemo(
    () => readStoredValue(key, defaultValue, deserialize),
    [key, defaultValue, deserialize],
  );
  const [state, setState] = useState(initial);

  useEffect(() => {
    if (!key) return;
    try {
      const serialized = serialize(state);
      scheduleStorageWrite(key, serialized, { delay });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('guoman:persist', { detail: { key, value: state } }),
        );
      }
    } catch {}
  }, [key, state, serialize, delay]);

  useEffect(() => {
    if (typeof window === 'undefined' || !key) return undefined;
    const onSync = (event) => {
      if (event?.detail?.key !== key) return;
      setState(event.detail.value);
    };
    window.addEventListener('guoman:persist', onSync);
    return () => window.removeEventListener('guoman:persist', onSync);
  }, [key]);

  return [state, setState];
};
