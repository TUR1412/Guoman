import { describe, expect, it } from 'vitest';
import { getNotifications } from './notificationsStore';
import {
  clearFollowing,
  fireDueFollowingReminders,
  FOLLOWING_STORAGE_KEY,
  getDueFollowingReminders,
  getFollowingEntries,
  isFollowing,
  subscribeFollowingById,
  subscribeFollowing,
  toggleFollowing,
  updateFollowingReminder,
} from './followingStore';
import { flushStorageQueue } from './storageQueue';

describe('followingStore', () => {
  it('toggles following on/off and exposes entries', () => {
    window.localStorage.clear();
    flushStorageQueue();

    expect(isFollowing(101)).toBe(false);
    expect(getFollowingEntries()).toEqual([]);
    // cache hit branch
    expect(getFollowingEntries()).toEqual([]);

    const added = toggleFollowing({ animeId: 101, title: '测试作品' });
    expect(added.ok).toBe(true);
    expect(added.action).toBe('followed');
    expect(isFollowing(101)).toBe(true);

    const entries = getFollowingEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toEqual(
      expect.objectContaining({
        animeId: 101,
        title: '测试作品',
        reminderEnabled: false,
      }),
    );

    const removed = toggleFollowing({ animeId: 101, title: '测试作品' });
    expect(removed.ok).toBe(true);
    expect(removed.action).toBe('unfollowed');
    expect(isFollowing(101)).toBe(false);
    expect(getFollowingEntries()).toEqual([]);
  });

  it('supports per-anime subscriptions to avoid fan-out', () => {
    window.localStorage.clear();
    flushStorageQueue();
    clearFollowing();

    let hitsA = 0;
    let hitsB = 0;
    const unsubA = subscribeFollowingById(1, () => {
      hitsA += 1;
    });
    const unsubB = subscribeFollowingById(2, () => {
      hitsB += 1;
    });

    toggleFollowing({ animeId: 1, title: 'a' });
    expect(hitsA).toBeGreaterThan(0);
    expect(hitsB).toBe(0);

    toggleFollowing({ animeId: 2, title: 'b' });
    expect(hitsB).toBeGreaterThan(0);

    const beforeA = hitsA;
    unsubA();
    toggleFollowing({ animeId: 1, title: 'a' });
    expect(hitsA).toBe(beforeA);

    unsubB();
  });

  it('updates reminder settings and clamps values', () => {
    window.localStorage.clear();
    flushStorageQueue();

    toggleFollowing({ animeId: 7, title: '追更片' });
    const scheduledAt = Date.now() + 60 * 60 * 1000;

    const updated = updateFollowingReminder(7, {
      reminderAt: scheduledAt,
      remindBeforeMinutes: 15,
      reminderEnabled: true,
      note: '每周准时',
    });
    expect(updated).toEqual(
      expect.objectContaining({
        animeId: 7,
        reminderEnabled: true,
        remindBeforeMinutes: 15,
        reminderAt: scheduledAt,
        note: '每周准时',
      }),
    );

    const clamped = updateFollowingReminder(7, {
      reminderAt: scheduledAt,
      remindBeforeMinutes: 999999,
      reminderEnabled: true,
    });
    expect(clamped.remindBeforeMinutes).toBeLessThanOrEqual(24 * 60);

    const cleared = updateFollowingReminder(7, { reminderAt: 'bad', reminderEnabled: true });
    expect(cleared.reminderAt).toBeNull();
  });

  it('fires due reminders exactly once and writes notifications', () => {
    window.localStorage.clear();
    flushStorageQueue();
    clearFollowing();

    toggleFollowing({ animeId: 99, title: '提醒片' });

    const reminderAt = 1_000_000;
    updateFollowingReminder(99, {
      reminderAt,
      reminderEnabled: true,
      remindBeforeMinutes: 10,
    });

    const now = reminderAt - 10 * 60 * 1000;
    const due = getDueFollowingReminders({ now });
    expect(due).toHaveLength(1);
    expect(due[0]).toEqual(expect.objectContaining({ animeId: 99 }));

    const fired = fireDueFollowingReminders({ now });
    expect(fired).toHaveLength(1);

    const notifications = getNotifications();
    expect(notifications[0]).toEqual(
      expect.objectContaining({
        title: expect.stringContaining('提醒片'),
        read: false,
      }),
    );

    expect(getDueFollowingReminders({ now })).toEqual([]);
  });

  it('handles invalid ids and missing entries gracefully', () => {
    window.localStorage.clear();
    flushStorageQueue();

    expect(toggleFollowing({ animeId: 'bad', title: 'x' })).toEqual(
      expect.objectContaining({ ok: false, action: 'noop', entry: null }),
    );
    expect(updateFollowingReminder('bad', { reminderEnabled: true })).toBeNull();
    expect(updateFollowingReminder(123, { reminderEnabled: true })).toBeNull();
  });

  it('tolerates invalid storage payload and empty reminder sets', () => {
    window.localStorage.clear();
    flushStorageQueue();

    window.localStorage.setItem(FOLLOWING_STORAGE_KEY, '{bad');
    expect(getFollowingEntries()).toEqual([]);
    expect(getDueFollowingReminders({ now: 1_000_000 })).toEqual([]);
    expect(fireDueFollowingReminders({ now: 1_000_000 })).toEqual([]);
  });

  it('parses stored meta/items payloads', () => {
    window.localStorage.clear();
    flushStorageQueue();

    window.localStorage.setItem(
      FOLLOWING_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        meta: { lastWriteAt: 123 },
        items: {
          1: { title: 'x', createdAt: 1, updatedAt: 2, reminderEnabled: false },
        },
      }),
    );

    expect(isFollowing(1)).toBe(true);
    expect(getFollowingEntries()).toHaveLength(1);
  });

  it('hits cached payload path when raw is unchanged', () => {
    window.localStorage.clear();
    flushStorageQueue();

    const raw = JSON.stringify({
      version: 1,
      meta: { lastWriteAt: 1 },
      items: { 1: { title: 'x', createdAt: 1, updatedAt: 2 } },
    });
    window.localStorage.setItem(FOLLOWING_STORAGE_KEY, raw);

    expect(isFollowing(1)).toBe(true);
    // 第二次读取应走 cachedRaw === raw 分支
    expect(isFollowing(1)).toBe(true);
  });

  it('filters reminders by enabled/at/lastNotifiedAt', () => {
    window.localStorage.clear();
    flushStorageQueue();
    clearFollowing();

    toggleFollowing({ animeId: 1, title: 'x' });

    // Missing reminderAt: should not be due
    updateFollowingReminder(1, {
      reminderEnabled: true,
      reminderAt: null,
      remindBeforeMinutes: 10,
    });
    expect(getDueFollowingReminders({ now: Date.now() })).toEqual([]);

    const reminderAt = 10_000_000;
    // Disabled: should not be due
    updateFollowingReminder(1, { reminderEnabled: false, reminderAt, remindBeforeMinutes: 10 });
    expect(getDueFollowingReminders({ now: reminderAt })).toEqual([]);

    // Enabled but too early: should not be due
    updateFollowingReminder(1, { reminderEnabled: true, reminderAt, remindBeforeMinutes: 10 });
    expect(getDueFollowingReminders({ now: reminderAt - 11 * 60 * 1000 })).toEqual([]);

    // Due now
    expect(getDueFollowingReminders({ now: reminderAt - 10 * 60 * 1000 })).toHaveLength(1);

    // After firing once, should not be due again at same fireAt
    fireDueFollowingReminders({ now: reminderAt - 10 * 60 * 1000 });
    expect(getDueFollowingReminders({ now: reminderAt - 10 * 60 * 1000 })).toEqual([]);
  });

  it('filters out invalid id keys in reminder scan', () => {
    window.localStorage.clear();
    flushStorageQueue();

    window.localStorage.setItem(
      FOLLOWING_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        meta: { lastWriteAt: 1 },
        items: {
          bad: {
            title: 'x',
            reminderAt: Date.now(),
            remindBeforeMinutes: 0,
            reminderEnabled: true,
            lastNotifiedAt: 0,
          },
        },
      }),
    );

    expect(getDueFollowingReminders({ now: Date.now() })).toEqual([]);
  });

  it('skips firing when item key normalization mismatches', () => {
    window.localStorage.clear();
    flushStorageQueue();

    // 注意 key: "01" -> animeId 解析为 1，但 payload.items["1"] 不存在
    window.localStorage.setItem(
      FOLLOWING_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        meta: { lastWriteAt: 123 },
        items: {
          '01': {
            title: '',
            reminderAt: Date.now(),
            remindBeforeMinutes: 0,
            reminderEnabled: true,
            lastNotifiedAt: 0,
          },
        },
      }),
    );

    const due = fireDueFollowingReminders({ now: Date.now() });
    expect(due).toHaveLength(1);
    expect(getNotifications()).toEqual([]);
  });

  it('keeps existing note when note is not a string and supports 0-minute reminders', () => {
    window.localStorage.clear();
    flushStorageQueue();
    clearFollowing();

    toggleFollowing({ animeId: 2, title: 'note-test' });
    updateFollowingReminder(2, {
      reminderEnabled: true,
      reminderAt: Date.now(),
      remindBeforeMinutes: 0,
      note: 'keep-me',
    });

    const updated = updateFollowingReminder(2, {
      reminderEnabled: true,
      reminderAt: Date.now(),
      remindBeforeMinutes: 0,
      note: 123,
    });
    expect(updated.note).toBe('keep-me');

    // now is invalid -> timestamp fallback branch
    fireDueFollowingReminders({ now: 'bad' });

    const notifications = getNotifications();
    expect(notifications[0]).toEqual(
      expect.objectContaining({
        body: '到点开看啦。',
      }),
    );
  });

  it('reacts to storage events for following key', () => {
    window.localStorage.clear();
    flushStorageQueue();

    let hits = 0;
    const unsubscribe = subscribeFollowing(() => {
      hits += 1;
    });

    // wrong key: ignored（覆盖分支）
    window.dispatchEvent(new StorageEvent('storage', { key: 'other.key', newValue: '{}' }));

    window.dispatchEvent(
      new StorageEvent('storage', {
        key: FOLLOWING_STORAGE_KEY,
        newValue: JSON.stringify({ version: 1, meta: { lastWriteAt: 1 }, items: {} }),
      }),
    );

    expect(hits).toBe(1);
    unsubscribe();
  });

  it('reacts to guoman:storage events and tolerates non-string payloads', () => {
    window.localStorage.clear();
    flushStorageQueue();

    let hits = 0;
    const unsubscribe = subscribeFollowing(() => {
      hits += 1;
    });

    window.dispatchEvent(
      new CustomEvent('guoman:storage', { detail: { key: 'other.key', value: '{}' } }),
    );
    expect(hits).toBe(0);

    // non-string value: should clear caches and emit
    window.dispatchEvent(
      new CustomEvent('guoman:storage', { detail: { key: FOLLOWING_STORAGE_KEY, value: 123 } }),
    );
    expect(hits).toBe(1);

    // string value: should emit too
    window.dispatchEvent(
      new CustomEvent('guoman:storage', { detail: { key: FOLLOWING_STORAGE_KEY, value: '{}' } }),
    );
    expect(hits).toBe(2);

    unsubscribe();
  });

  it('fires reminder notification with fallback title when title is empty', () => {
    window.localStorage.clear();
    flushStorageQueue();
    clearFollowing();

    // title 空字符串 -> 通知标题应回退到 “作品 #id”
    toggleFollowing({ animeId: 42, title: '   ' });
    updateFollowingReminder(42, {
      reminderAt: Date.now(),
      reminderEnabled: true,
      remindBeforeMinutes: 0,
    });

    fireDueFollowingReminders({ now: Date.now() });
    const notifications = getNotifications();
    expect(notifications[0].title).toContain('作品 #42');
  });
});
