import { useEffect, useRef, useState } from 'react';
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
  const defaultValueRef = useRef(defaultValue);
  const deserializeRef = useRef(deserialize);
  const serializeRef = useRef(serialize);
  const hydratedKeyRef = useRef(key);
  const lastSerializedRef = useRef(null);
  const [state, setState] = useState(() => readStoredValue(key, defaultValue, deserialize));

  useEffect(() => {
    defaultValueRef.current = defaultValue;
    deserializeRef.current = deserialize;
    serializeRef.current = serialize;
  }, [defaultValue, deserialize, serialize]);

  useEffect(() => {
    if (typeof window === 'undefined' || !key) return;
    lastSerializedRef.current = safeLocalStorageGet(key);

    if (hydratedKeyRef.current === key) return;
    hydratedKeyRef.current = key;
    setState(readStoredValue(key, defaultValueRef.current, deserializeRef.current));
  }, [key]);

  useEffect(() => {
    if (!key) return;
    try {
      const serialized = serializeRef.current(state);
      if (serialized === lastSerializedRef.current) return;
      lastSerializedRef.current = serialized;
      scheduleStorageWrite(key, serialized, { delay });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('guoman:persist', { detail: { key, value: state } }));
      }
    } catch {}
  }, [delay, key, state]);

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
