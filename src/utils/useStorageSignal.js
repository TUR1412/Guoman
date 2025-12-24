import { useCallback, useEffect, useState } from 'react';

const normalizeKeys = (keys) => {
  if (!Array.isArray(keys)) return [];
  return keys
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .sort();
};

export const useStorageSignal = (keys = []) => {
  const [signal, setSignal] = useState(0);

  const bump = useCallback(() => {
    setSignal((prev) => prev + 1);
  }, []);

  const keyFingerprint = normalizeKeys(keys).join('\u0000');

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const keySet = keyFingerprint ? new Set(keyFingerprint.split('\u0000')) : null;

    const onStorage = (event) => {
      const key = event?.detail?.key || event?.key;
      if (!key) return;
      if (keySet && !keySet.has(key)) return;
      bump();
    };

    window.addEventListener('guoman:storage', onStorage);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('guoman:storage', onStorage);
      window.removeEventListener('storage', onStorage);
    };
  }, [bump, keyFingerprint]);

  return { signal, bump };
};
