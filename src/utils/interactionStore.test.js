import { beforeEach, describe, expect, it } from 'vitest';

import { getInteractions, recordInteraction } from './interactionStore';
import { flushStorageQueue } from './storageQueue';

describe('interactionStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
    flushStorageQueue();
  });

  it('recordInteraction validates key', () => {
    expect(recordInteraction('', { a: 1 })).toBeNull();
  });

  it('records interactions and respects limit', () => {
    recordInteraction('k', { n: 1 }, 2);
    recordInteraction('k', { n: 2 }, 2);
    recordInteraction('k', { n: 3 }, 2);
    flushStorageQueue();

    const list = getInteractions('k');
    expect(list.length).toBe(2);
    expect(list[0].payload.n).toBe(3);
  });

  it('tolerates invalid storage payload', () => {
    window.localStorage.setItem('k', '{bad');
    expect(getInteractions('k')).toEqual([]);
  });
});
