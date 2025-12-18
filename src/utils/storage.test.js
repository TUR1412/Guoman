import { describe, expect, it, vi } from 'vitest';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeSessionStorageGet,
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
});
