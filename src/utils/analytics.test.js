import { beforeEach, describe, expect, it } from 'vitest';

import { clearEvents, getEvents, getEventStats, trackEvent } from './analytics';
import { STORAGE_KEYS } from './dataKeys';
import { flushStorageQueue } from './storageQueue';

describe('analytics store', () => {
  beforeEach(() => {
    window.localStorage.clear();
    flushStorageQueue();
  });

  it('trackEvent ignores empty name', () => {
    trackEvent('');
    flushStorageQueue();
    expect(window.localStorage.getItem(STORAGE_KEYS.analyticsEvents)).toBeNull();
  });

  it('trackEvent writes and getEventStats aggregates', () => {
    trackEvent('open', { from: 'home' });
    flushStorageQueue();

    const stats = getEventStats();
    expect(stats.total).toBe(1);
    expect(stats.counts.open).toBe(1);

    const events = getEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(
      expect.objectContaining({
        name: 'open',
        payload: { from: 'home' },
        id: expect.any(String),
        at: expect.any(Number),
      }),
    );
  });

  it('getEventStats tolerates invalid storage payload', () => {
    window.localStorage.setItem(STORAGE_KEYS.analyticsEvents, '{not-json');
    expect(getEventStats()).toEqual({ total: 0, counts: {} });
    expect(getEvents()).toEqual([]);
  });

  it('caps stored events', () => {
    const existing = Array.from({ length: 205 }, (_, idx) => ({
      id: String(idx),
      name: 'x',
      payload: {},
      at: 0,
    }));
    window.localStorage.setItem(STORAGE_KEYS.analyticsEvents, JSON.stringify(existing));

    trackEvent('y');
    flushStorageQueue();

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.analyticsEvents));
    expect(stored.length).toBe(200);
  });

  it('clearEvents clears storage', () => {
    trackEvent('x');
    flushStorageQueue();
    clearEvents();
    flushStorageQueue();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.analyticsEvents))).toEqual([]);
  });
});
