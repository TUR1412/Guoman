import { useEffect } from 'react';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const usePointerGlow = (ref, { disabled = false } = {}) => {
  useEffect(() => {
    const el = ref?.current;
    if (!el) return undefined;
    if (disabled) return undefined;

    const rafFn =
      typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame
        : (cb) => window.setTimeout(cb, 16);
    const cancelRafFn =
      typeof cancelAnimationFrame === 'function'
        ? cancelAnimationFrame
        : (id) => window.clearTimeout(id);

    let raf = 0;
    const setVars = (x, y, active) => {
      el.style.setProperty('--pointer-x', `${Math.round(x)}px`);
      el.style.setProperty('--pointer-y', `${Math.round(y)}px`);
      el.style.setProperty('--pointer-active', active ? '1' : '0');
    };

    const setVarsFromEvent = (event, { allowTouch = true } = {}) => {
      if (!event) return;
      const pointerType = event.pointerType ?? 'mouse';
      if (!allowTouch && pointerType === 'touch') return;
      const rect = el.getBoundingClientRect();
      const x = clamp(event.clientX - rect.left, 0, rect.width || 0);
      const y = clamp(event.clientY - rect.top, 0, rect.height || 0);

      if (raf) cancelRafFn(raf);
      raf = rafFn(() => {
        setVars(x, y, true);
        raf = 0;
      });
    };

    const onDown = (event) => {
      setVarsFromEvent(event, { allowTouch: true });
    };

    const onMove = (event) => {
      setVarsFromEvent(event, { allowTouch: false });
    };

    const onUpOrCancel = (event) => {
      const pointerType = event?.pointerType ?? 'mouse';
      if (pointerType === 'mouse') return;
      onLeave();
    };

    const onLeave = () => {
      if (raf) cancelRafFn(raf);
      raf = 0;
      el.style.setProperty('--pointer-active', '0');
    };

    el.addEventListener('pointerdown', onDown, { passive: true });
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    el.addEventListener('pointerup', onUpOrCancel, { passive: true });
    el.addEventListener('pointercancel', onUpOrCancel, { passive: true });
    onLeave();

    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointerup', onUpOrCancel);
      el.removeEventListener('pointercancel', onUpOrCancel);
      onLeave();
      if (raf) cancelRafFn(raf);
    };
  }, [disabled, ref]);
};
