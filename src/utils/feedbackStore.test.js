import { beforeEach, describe, expect, it } from 'vitest';

import {
  clearFeedback,
  FEEDBACK_STORAGE_KEY,
  getFeedbackList,
  submitFeedback,
} from './feedbackStore';
import { flushStorageQueue } from './storageQueue';

describe('feedbackStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    flushStorageQueue();
  });

  it('tolerates invalid storage payload', () => {
    window.localStorage.setItem(FEEDBACK_STORAGE_KEY, '{bad');
    expect(getFeedbackList()).toEqual([]);
  });

  it('submitFeedback validates message', () => {
    expect(submitFeedback({ message: '' })).toBeNull();
  });

  it('stores feedback entry', () => {
    const entry = submitFeedback({ message: '建议加个黑暗模式', contact: 'me@example.com' });
    flushStorageQueue();
    expect(entry).toEqual(expect.objectContaining({ status: 'new', contact: 'me@example.com' }));

    const list = getFeedbackList();
    expect(list.length).toBe(1);
    expect(list[0].message).toBe('建议加个黑暗模式');
  });

  it('clearFeedback clears store', () => {
    submitFeedback({ message: 'x' });
    flushStorageQueue();
    clearFeedback();
    flushStorageQueue();
    expect(getFeedbackList()).toEqual([]);
  });
});
