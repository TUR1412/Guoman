import { describe, expect, it, vi } from 'vitest';
import {
  safeLocalStorageGet,
  safeLocalStorageRemove,
  safeLocalStorageSet,
  safeSessionStorageGet,
  safeSessionStorageRemove,
  safeSessionStorageSet,
} from './storage';

describe('storage utils', () => {
  it('safeLocalStorageGet / safeLocalStorageSet works in happy path', () => {
    safeLocalStorageSet('k', 'v');
    expect(safeLocalStorageGet('k')).toBe('v');
  });

  it('safeSessionStorageGet / safeSessionStorageSet works in happy path', () => {
    safeSessionStorageSet('k', 'v');
    expect(safeSessionStorageGet('k')).toBe('v');
  });

  it('safeLocalStorageRemove / safeSessionStorageRemove works in happy path', () => {
    safeLocalStorageSet('k', 'v');
    expect(safeLocalStorageGet('k')).toBe('v');
    expect(safeLocalStorageRemove('k')).toBe(true);
    expect(safeLocalStorageGet('k')).toBeNull();

    safeSessionStorageSet('k', 'v');
    expect(safeSessionStorageGet('k')).toBe('v');
    expect(safeSessionStorageRemove('k')).toBe(true);
    expect(safeSessionStorageGet('k')).toBeNull();
  });

  it('safeLocalStorageGet returns null when storage throws', () => {
    const spy = vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('boom');
    });

    expect(safeLocalStorageGet('k')).toBeNull();
    spy.mockRestore();
  });

  it('safeLocalStorageSet returns false when storage throws', () => {
    const spy = vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('boom');
    });

    expect(safeLocalStorageSet('k', 'v')).toBe(false);
    spy.mockRestore();
  });

  it('safeLocalStorageGet returns null when storage access throws', () => {
    const original = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('boom');
      },
    });

    expect(safeLocalStorageGet('k')).toBeNull();

    Object.defineProperty(window, 'localStorage', { configurable: true, value: original });
  });

  it('safeLocalStorageRemove returns false when removeItem throws', () => {
    const spy = vi.spyOn(window.localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('boom');
    });

    expect(safeLocalStorageRemove('k')).toBe(false);
    spy.mockRestore();
  });

  it('returns null/false when window is missing', () => {
    const original = globalThis.window;
    globalThis.window = undefined;

    expect(safeLocalStorageGet('k')).toBeNull();
    expect(safeLocalStorageSet('k', 'v')).toBe(false);
    expect(safeLocalStorageRemove('k')).toBe(false);

    globalThis.window = original;
  });
});
