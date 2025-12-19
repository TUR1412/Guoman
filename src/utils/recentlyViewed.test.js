import { beforeEach, describe, expect, it } from 'vitest';
import { clearRecentlyViewed, getRecentlyViewed, recordRecentlyViewed } from './recentlyViewed';

describe('recentlyViewed utils', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('records and de-duplicates ids in most-recent order', () => {
    recordRecentlyViewed(3);
    recordRecentlyViewed(5);
    recordRecentlyViewed(3);

    expect(getRecentlyViewed()).toEqual([3, 5]);
  });

  it('ignores invalid ids', () => {
    recordRecentlyViewed('bad');
    expect(getRecentlyViewed()).toEqual([]);
  });

  it('clears recently viewed list', () => {
    recordRecentlyViewed(1);
    clearRecentlyViewed();
    expect(getRecentlyViewed()).toEqual([]);
  });
});
