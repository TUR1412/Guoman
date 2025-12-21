import { describe, expect, it, vi } from 'vitest';

describe('followingStore (server-like)', () => {
  it('returns empty defaults without window', async () => {
    vi.resetModules();

    const originalWindow = globalThis.window;
    globalThis.window = undefined;

    const mod = await import('./followingStore');

    expect(mod.getFollowingEntries()).toEqual([]);
    expect(mod.isFollowing(1)).toBe(false);

    globalThis.window = originalWindow;
  });
});
