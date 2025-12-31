const UPDATE_EVENT = 'guoman:sw:update';

const dispatchUpdateEvent = (registration) => {
  if (typeof window === 'undefined') return;

  try {
    window.dispatchEvent(
      new CustomEvent(UPDATE_EVENT, {
        detail: { registration },
      }),
    );
  } catch {}
};

export const registerServiceWorker = async ({ forceProd = false } = {}) => {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator)) return null;

  const prod = Boolean(import.meta?.env?.PROD) || Boolean(forceProd);
  if (!prod) return null;

  const swUrl = `${import.meta.env.BASE_URL}sw.js`;
  const hadController = Boolean(navigator.serviceWorker.controller);
  let reloading = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return;
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  try {
    const registration = await navigator.serviceWorker.register(swUrl);

    if (registration?.waiting && navigator.serviceWorker.controller) {
      dispatchUpdateEvent(registration);
    }

    registration?.addEventListener?.('updatefound', () => {
      const worker = registration.installing;
      if (!worker) return;

      worker.addEventListener('statechange', () => {
        if (worker.state !== 'installed') return;
        if (!navigator.serviceWorker.controller) return;
        dispatchUpdateEvent(registration);
      });
    });

    return registration;
  } catch {
    return null;
  }
};

export const activateServiceWorkerUpdate = (registration) => {
  const waiting = registration?.waiting;
  if (!waiting) return false;

  try {
    waiting.postMessage({ type: 'SKIP_WAITING' });
    return true;
  } catch {
    return false;
  }
};

export const SERVICE_WORKER_EVENTS = Object.freeze({
  update: UPDATE_EVENT,
});
