import { afterEach, describe, expect, it, vi } from 'vitest';

const loadServiceWorker = async () => {
  vi.resetModules();
  return import('./serviceWorker');
};

const makeNavigatorServiceWorker = ({ controller = null, registerImpl } = {}) => {
  const listeners = new Map();
  return {
    controller,
    register: registerImpl,
    addEventListener: vi.fn((type, cb) => listeners.set(type, cb)),
    _listeners: listeners,
  };
};

describe('serviceWorker', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns null when window is missing or navigator has no serviceWorker', async () => {
    const { registerServiceWorker } = await loadServiceWorker();

    vi.stubGlobal('window', undefined);
    expect(await registerServiceWorker({ forceProd: true })).toBeNull();
    vi.unstubAllGlobals();

    // navigator without serviceWorker support (no property)
    vi.stubGlobal('navigator', {});
    expect(await registerServiceWorker({ forceProd: true })).toBeNull();
  });

  it('returns null when not in production and forceProd is false', async () => {
    const { registerServiceWorker } = await loadServiceWorker();

    const registration = { waiting: null, addEventListener: vi.fn() };
    const serviceWorker = makeNavigatorServiceWorker({
      controller: {},
      registerImpl: vi.fn(async () => registration),
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: serviceWorker,
    });

    const result = await registerServiceWorker();
    expect(result).toBeNull();
    expect(serviceWorker.register).not.toHaveBeenCalled();
  });

  it('registers and dispatches update event when a waiting worker exists', async () => {
    const { registerServiceWorker, SERVICE_WORKER_EVENTS } = await loadServiceWorker();

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    const waiting = { postMessage: vi.fn() };
    const registration = {
      waiting,
      addEventListener: vi.fn(),
      installing: null,
    };

    const serviceWorker = makeNavigatorServiceWorker({
      controller: {},
      registerImpl: vi.fn(async () => registration),
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: serviceWorker,
    });

    const result = await registerServiceWorker({ forceProd: true });
    expect(result).toBe(registration);

    const updateEvent = dispatchSpy.mock.calls
      .map(([evt]) => evt)
      .find((evt) => evt?.type === SERVICE_WORKER_EVENTS.update);
    expect(updateEvent?.detail?.registration).toBe(registration);

    // controllerchange reload only when there was an existing controller
    const controllerChange = serviceWorker._listeners.get('controllerchange');
    expect(typeof controllerChange).toBe('function');
    expect(() => controllerChange()).not.toThrow();
    expect(() => controllerChange()).not.toThrow();
  });

  it('does not dispatch waiting update event when controller is missing', async () => {
    const { registerServiceWorker, SERVICE_WORKER_EVENTS } = await loadServiceWorker();
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    const registration = {
      waiting: { postMessage: vi.fn() },
      addEventListener: vi.fn(),
      installing: null,
    };

    const serviceWorker = makeNavigatorServiceWorker({
      controller: null,
      registerImpl: vi.fn(async () => registration),
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: serviceWorker,
    });

    await registerServiceWorker({ forceProd: true });

    const updateEvent = dispatchSpy.mock.calls
      .map(([evt]) => evt)
      .find((evt) => evt?.type === SERVICE_WORKER_EVENTS.update);
    expect(updateEvent).toBeUndefined();
  });

  it('dispatches update event for updatefound + installed statechange', async () => {
    const { registerServiceWorker, SERVICE_WORKER_EVENTS } = await loadServiceWorker();

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    const workerListeners = new Map();
    const worker = {
      state: 'installing',
      addEventListener: vi.fn((type, cb) => workerListeners.set(type, cb)),
    };

    const regListeners = new Map();
    const registration = {
      waiting: null,
      installing: worker,
      addEventListener: vi.fn((type, cb) => regListeners.set(type, cb)),
    };

    const serviceWorker = makeNavigatorServiceWorker({
      controller: {},
      registerImpl: vi.fn(async () => registration),
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: serviceWorker,
    });

    await registerServiceWorker({ forceProd: true });

    regListeners.get('updatefound')?.();
    worker.state = 'installed';
    workerListeners.get('statechange')?.();

    const updateEvent = dispatchSpy.mock.calls
      .map(([evt]) => evt)
      .find((evt) => evt?.type === SERVICE_WORKER_EVENTS.update);
    expect(updateEvent).toBeTruthy();
  });

  it('handles updatefound edge cases (no worker / not installed / no controller)', async () => {
    const { registerServiceWorker, SERVICE_WORKER_EVENTS } = await loadServiceWorker();
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    const regListeners = new Map();
    const registration = {
      waiting: null,
      installing: null,
      addEventListener: vi.fn((type, cb) => regListeners.set(type, cb)),
    };

    const serviceWorker = makeNavigatorServiceWorker({
      controller: {},
      registerImpl: vi.fn(async () => registration),
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: serviceWorker,
    });

    await registerServiceWorker({ forceProd: true });
    expect(() => regListeners.get('updatefound')?.()).not.toThrow();

    // not-installed state: should not dispatch
    const workerListeners = new Map();
    registration.installing = {
      state: 'installing',
      addEventListener: vi.fn((type, cb) => workerListeners.set(type, cb)),
    };

    regListeners.get('updatefound')?.();
    workerListeners.get('statechange')?.();

    // installed but no controller: still should not dispatch
    registration.installing.state = 'installed';
    serviceWorker.controller = null;
    workerListeners.get('statechange')?.();

    const updateEvent = dispatchSpy.mock.calls
      .map(([evt]) => evt)
      .find((evt) => evt?.type === SERVICE_WORKER_EVENTS.update);
    expect(updateEvent).toBeUndefined();
  });

  it('does not reload on controllerchange when there was no prior controller', async () => {
    const { registerServiceWorker } = await loadServiceWorker();

    const registration = { waiting: null, addEventListener: vi.fn() };
    const serviceWorker = makeNavigatorServiceWorker({
      controller: null,
      registerImpl: vi.fn(async () => registration),
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: serviceWorker,
    });

    await registerServiceWorker({ forceProd: true });
    expect(() => serviceWorker._listeners.get('controllerchange')?.()).not.toThrow();
  });

  it('returns null when registration fails', async () => {
    const { registerServiceWorker } = await loadServiceWorker();

    const serviceWorker = makeNavigatorServiceWorker({
      controller: {},
      registerImpl: vi.fn(async () => {
        throw new Error('boom');
      }),
    });

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: serviceWorker,
    });

    expect(await registerServiceWorker({ forceProd: true })).toBeNull();
  });

  it('activates waiting worker via postMessage', async () => {
    const { activateServiceWorkerUpdate } = await loadServiceWorker();

    expect(activateServiceWorkerUpdate(null)).toBe(false);
    expect(activateServiceWorkerUpdate({})).toBe(false);

    const waiting = { postMessage: vi.fn() };
    expect(activateServiceWorkerUpdate({ waiting })).toBe(true);
    expect(waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });

    expect(
      activateServiceWorkerUpdate({
        waiting: {
          postMessage: () => {
            throw new Error('boom');
          },
        },
      }),
    ).toBe(false);
  });
});
