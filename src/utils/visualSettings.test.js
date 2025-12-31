import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const loadVisualSettings = async () => {
  vi.resetModules();
  vi.doMock('./analytics', () => ({ trackEvent: vi.fn() }));

  const visual = await import('./visualSettings');
  const storageQueue = await import('./storageQueue');
  const dataKeys = await import('./dataKeys');
  const analytics = await import('./analytics');
  return {
    ...visual,
    flushStorageQueue: storageQueue.flushStorageQueue,
    STORAGE_KEYS: dataKeys.STORAGE_KEYS,
    trackEvent: analytics.trackEvent,
  };
};

describe('visualSettings', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.style.cssText = '';
    delete document.documentElement.dataset.noBlur;
    delete document.documentElement.dataset.reducedMotion;
  });

  it('getStoredVisualSettings returns defaults when missing', async () => {
    const { getStoredVisualSettings, VISUAL_SETTINGS_DEFAULTS } = await loadVisualSettings();
    expect(getStoredVisualSettings()).toEqual(VISUAL_SETTINGS_DEFAULTS);
  });

  it('getStoredVisualSettings returns defaults when window is missing', async () => {
    const { getStoredVisualSettings, VISUAL_SETTINGS_DEFAULTS } = await loadVisualSettings();
    vi.stubGlobal('window', undefined);
    expect(getStoredVisualSettings()).toEqual(VISUAL_SETTINGS_DEFAULTS);
  });

  it('getStoredVisualSettings handles invalid JSON payloads', async () => {
    const { getStoredVisualSettings, STORAGE_KEYS, VISUAL_SETTINGS_DEFAULTS } =
      await loadVisualSettings();

    window.localStorage.setItem(STORAGE_KEYS.visualSettings, '{not-json');
    expect(getStoredVisualSettings()).toEqual(VISUAL_SETTINGS_DEFAULTS);
  });

  it('applyVisualSettings writes CSS vars and datasets', async () => {
    const { applyVisualSettings } = await loadVisualSettings();

    applyVisualSettings({
      schemaVersion: 1,
      updatedAt: 0,
      paperNoiseOpacity: 0.05,
      auroraOpacity: 0.8,
      fontScale: 1.1,
      disableBlur: true,
      forceReducedMotion: true,
    });

    expect(document.documentElement.style.getPropertyValue('--paper-noise-opacity')).toBe('0.05');
    expect(document.documentElement.style.getPropertyValue('--aurora-opacity')).toBe('0.8');
    expect(document.documentElement.style.getPropertyValue('--font-scale')).toBe('1.1');
    expect(document.documentElement.dataset.noBlur).toBe('true');
    expect(document.documentElement.dataset.reducedMotion).toBe('true');

    applyVisualSettings({
      schemaVersion: 1,
      updatedAt: 0,
      paperNoiseOpacity: 0.05,
      auroraOpacity: 0.8,
      fontScale: 1.1,
      disableBlur: false,
      forceReducedMotion: false,
    });

    expect(document.documentElement.dataset.noBlur).toBeUndefined();
    expect(document.documentElement.dataset.reducedMotion).toBeUndefined();
  });

  it('applyVisualSettings is safe when document is missing', async () => {
    const { applyVisualSettings } = await loadVisualSettings();
    vi.stubGlobal('document', undefined);
    expect(() => applyVisualSettings({ disableBlur: true })).not.toThrow();
  });

  it('applyVisualSettings still updates datasets when CSS var writes throw', async () => {
    const { applyVisualSettings } = await loadVisualSettings();
    const setPropertySpy = vi
      .spyOn(document.documentElement.style, 'setProperty')
      .mockImplementation(() => {
        throw new Error('boom');
      });

    applyVisualSettings({ disableBlur: true, forceReducedMotion: true });
    expect(setPropertySpy).toHaveBeenCalled();
    expect(document.documentElement.dataset.noBlur).toBe('true');
    expect(document.documentElement.dataset.reducedMotion).toBe('true');
  });

  it('setVisualSettings persists + clamps values', async () => {
    const { setVisualSettings, flushStorageQueue, STORAGE_KEYS } = await loadVisualSettings();

    const next = setVisualSettings(
      {
        paperNoiseOpacity: 9,
        auroraOpacity: 999,
        fontScale: 9,
        disableBlur: true,
        forceReducedMotion: true,
      },
      { silent: true },
    );

    expect(next.paperNoiseOpacity).toBe(0.14);
    expect(next.auroraOpacity).toBe(1);
    expect(next.fontScale).toBe(1.25);
    expect(next.disableBlur).toBe(true);
    expect(next.forceReducedMotion).toBe(true);

    flushStorageQueue();
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.visualSettings));
    expect(stored.paperNoiseOpacity).toBe(0.14);
    expect(stored.auroraOpacity).toBe(1);
    expect(stored.fontScale).toBe(1.25);
  });

  it('setVisualSettings supports non-object patches and emits events/analytics by default', async () => {
    const { flushStorageQueue, setVisualSettings, STORAGE_KEYS, trackEvent } =
      await loadVisualSettings();

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    const next = setVisualSettings(null);
    expect(next.schemaVersion).toBe(1);

    flushStorageQueue();
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.visualSettings));
    expect(stored.schemaVersion).toBe(1);

    expect(dispatchSpy).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalled();
  });

  it('setVisualSettings returns defaults when window is missing', async () => {
    const { setVisualSettings, VISUAL_SETTINGS_DEFAULTS } = await loadVisualSettings();
    vi.stubGlobal('window', undefined);
    expect(setVisualSettings({ disableBlur: true })).toEqual(VISUAL_SETTINGS_DEFAULTS);
  });

  it('resetVisualSettings replaces with defaults', async () => {
    const {
      resetVisualSettings,
      setVisualSettings,
      flushStorageQueue,
      STORAGE_KEYS,
      VISUAL_SETTINGS_DEFAULTS,
    } = await loadVisualSettings();

    setVisualSettings({ disableBlur: true, auroraOpacity: 0.2 }, { silent: true });
    resetVisualSettings();
    flushStorageQueue();

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.visualSettings));
    expect(stored.disableBlur).toBe(false);
    expect(stored.auroraOpacity).toBe(VISUAL_SETTINGS_DEFAULTS.auroraOpacity);
  });

  it('initVisualSettings applies stored settings', async () => {
    const { initVisualSettings, STORAGE_KEYS } = await loadVisualSettings();

    window.localStorage.setItem(
      STORAGE_KEYS.visualSettings,
      JSON.stringify({
        schemaVersion: 1,
        updatedAt: 0,
        paperNoiseOpacity: 0.08,
        auroraOpacity: 0.9,
        fontScale: 1,
        disableBlur: true,
        forceReducedMotion: true,
      }),
    );

    initVisualSettings();
    expect(document.documentElement.dataset.noBlur).toBe('true');
    expect(document.documentElement.dataset.reducedMotion).toBe('true');
  });
});
