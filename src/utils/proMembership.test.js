import { describe, expect, it } from 'vitest';
import {
  clearProMembership,
  getProMembership,
  isProEnabled,
  PRO_STORAGE_KEY,
  subscribeProMembership,
  setProMembership,
  toggleProMembership,
} from './proMembership';
import { flushStorageQueue } from './storageQueue';

describe('proMembership', () => {
  it('defaults to free/disabled', () => {
    window.localStorage.clear();
    flushStorageQueue();

    const m = getProMembership();
    expect(m).toEqual(expect.objectContaining({ enabled: false, plan: 'free' }));
    expect(isProEnabled()).toBe(false);
  });

  it('toggles and persists plan', () => {
    window.localStorage.clear();
    flushStorageQueue();

    const enabled = toggleProMembership({ plan: 'supporter' });
    expect(enabled.enabled).toBe(true);
    expect(enabled.plan).toBe('supporter');
    expect(isProEnabled()).toBe(true);

    const changed = setProMembership({ enabled: true, plan: 'studio' });
    expect(changed.enabled).toBe(true);
    expect(changed.plan).toBe('studio');

    const disabled = toggleProMembership();
    expect(disabled.enabled).toBe(false);
    expect(disabled.plan).toBe('free');
    expect(isProEnabled()).toBe(false);
  });

  it('can be cleared', () => {
    window.localStorage.clear();
    flushStorageQueue();

    setProMembership({ enabled: true, plan: 'supporter' });
    expect(isProEnabled()).toBe(true);

    const cleared = clearProMembership();
    expect(cleared.enabled).toBe(false);
    expect(cleared.plan).toBe('free');
    expect(isProEnabled()).toBe(false);
  });

  it('tolerates invalid and legacy storage payloads', () => {
    window.localStorage.clear();
    flushStorageQueue();

    window.localStorage.setItem(PRO_STORAGE_KEY, '{bad');
    expect(getProMembership()).toEqual(expect.objectContaining({ enabled: false, plan: 'free' }));

    window.localStorage.setItem(
      PRO_STORAGE_KEY,
      JSON.stringify({ enabled: false, plan: 'studio', startedAt: 123, updatedAt: 456 }),
    );
    const disabled = getProMembership();
    expect(disabled.enabled).toBe(false);
    expect(disabled.plan).toBe('free');
    expect(disabled.startedAt).toBeNull();

    window.localStorage.setItem(
      PRO_STORAGE_KEY,
      JSON.stringify({ enabled: true, plan: 'not-a-plan', startedAt: 123, updatedAt: 456 }),
    );
    const normalized = getProMembership();
    expect(normalized.enabled).toBe(true);
    expect(normalized.plan).toBe('free');
  });

  it('setProMembership forces plan to free when disabled', () => {
    window.localStorage.clear();
    flushStorageQueue();

    const disabled = setProMembership({ enabled: false, plan: 'studio' });
    expect(disabled.enabled).toBe(false);
    expect(disabled.plan).toBe('free');
    expect(disabled.startedAt).toBeNull();
  });

  it('reacts to cross-tab storage events', () => {
    window.localStorage.clear();
    flushStorageQueue();

    let hits = 0;
    const unsubscribe = subscribeProMembership(() => {
      hits += 1;
    });

    const payload = JSON.stringify({
      enabled: true,
      plan: 'supporter',
      startedAt: 1,
      updatedAt: 2,
    });
    window.localStorage.setItem(PRO_STORAGE_KEY, payload);

    // wrong key: should be ignored（覆盖分支）
    window.dispatchEvent(new StorageEvent('storage', { key: 'other.key', newValue: payload }));

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: PRO_STORAGE_KEY,
        newValue: payload,
      }),
    );

    expect(hits).toBe(1);
    expect(isProEnabled()).toBe(true);

    // wrong internal key: ignored（覆盖分支）
    window.dispatchEvent(
      new CustomEvent('guoman:storage', { detail: { key: 'other.key', value: payload } }),
    );

    // correct internal key with non-string value（覆盖 ternary 分支）
    window.dispatchEvent(
      new CustomEvent('guoman:storage', { detail: { key: PRO_STORAGE_KEY, value: 123 } }),
    );
    expect(hits).toBe(2);

    // correct internal key with string value（覆盖 ternary 分支）
    window.dispatchEvent(
      new CustomEvent('guoman:storage', { detail: { key: PRO_STORAGE_KEY, value: payload } }),
    );
    expect(hits).toBe(3);

    unsubscribe();
  });
});
