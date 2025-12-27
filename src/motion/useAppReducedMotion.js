import { useEffect, useState } from 'react';
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { getStoredVisualSettings, VISUAL_SETTINGS_EVENT } from '../utils/visualSettings';

const readForcedReducedMotion = () => {
  if (typeof document === 'undefined') return false;
  return document.documentElement?.dataset?.reducedMotion === 'true';
};

const readStoredReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(getStoredVisualSettings()?.forceReducedMotion);
  } catch {
    return false;
  }
};

export function useAppReducedMotion() {
  const systemReducedMotion = useFramerReducedMotion();
  const [forcedReducedMotion, setForcedReducedMotion] = useState(() => {
    return readForcedReducedMotion() || readStoredReducedMotion();
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const onUpdate = (event) => {
      const next = event?.detail?.settings;
      setForcedReducedMotion(Boolean(next?.forceReducedMotion) || readForcedReducedMotion());
    };

    window.addEventListener(VISUAL_SETTINGS_EVENT, onUpdate);
    return () => window.removeEventListener(VISUAL_SETTINGS_EVENT, onUpdate);
  }, []);

  return Boolean(systemReducedMotion || forcedReducedMotion);
}
