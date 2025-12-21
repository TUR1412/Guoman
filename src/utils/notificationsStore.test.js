import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearNotifications,
  getNotifications,
  markNotificationRead,
  NOTIFICATIONS_STORAGE_KEY,
  pushNotification,
} from './notificationsStore';
import { flushStorageQueue } from './storageQueue';

describe('notificationsStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    flushStorageQueue();
  });

  it('tolerates invalid storage payload', () => {
    window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, '{bad');
    expect(getNotifications()).toEqual([]);
  });

  it('treats non-array payload as empty', () => {
    window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify({}));
    expect(getNotifications()).toEqual([]);
  });

  it('pushes and marks read', () => {
    const entry = pushNotification({});
    flushStorageQueue();

    expect(entry).toEqual(
      expect.objectContaining({
        title: '系统通知',
        body: '你有一条新的提醒。',
        read: false,
      }),
    );
    expect(getNotifications()[0].read).toBe(false);

    markNotificationRead(entry.id);
    flushStorageQueue();
    expect(getNotifications()[0].read).toBe(true);
  });

  it('supports custom title/body', () => {
    pushNotification({ title: '自定义', body: '内容' });
    flushStorageQueue();
    expect(getNotifications()[0]).toEqual(
      expect.objectContaining({ title: '自定义', body: '内容' }),
    );
  });

  it('clearNotifications clears store', () => {
    pushNotification({ title: 't' });
    flushStorageQueue();
    clearNotifications();
    flushStorageQueue();
    expect(getNotifications()).toEqual([]);
  });
});
