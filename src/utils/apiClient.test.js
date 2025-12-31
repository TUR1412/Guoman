import { afterEach, describe, expect, it, vi } from 'vitest';

import { createApiClient } from './apiClient';

const makeResponse = ({ status = 200, json = null, text = null } = {}) => {
  const ok = status >= 200 && status <= 299;
  const payload = text != null ? String(text) : json == null ? '' : JSON.stringify(json);
  return {
    ok,
    status,
    text: async () => payload,
  };
};

describe('apiClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('throws when no fetch implementation is available', async () => {
    vi.stubGlobal('fetch', undefined);
    const client = createApiClient();

    await expect(client.requestJson('https://example.test/api')).rejects.toThrow(
      'No fetch implementation available',
    );
  });

  it('caches GET responses by default', async () => {
    const fetchImpl = vi.fn(async () => makeResponse({ status: 200, json: { ok: true } }));
    const client = createApiClient({ fetchImpl, defaultCacheTtlMs: 10_000 });

    const first = await client.requestJson('https://example.test/api');
    const second = await client.requestJson('https://example.test/api');

    expect(first.ok).toBe(true);
    expect(first.cached).toBe(false);
    expect(second.ok).toBe(true);
    expect(second.cached).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('expires cache entries after TTL', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));

    const fetchImpl = vi.fn(async () => makeResponse({ status: 200, json: { ok: true } }));
    const client = createApiClient({ fetchImpl, defaultCacheTtlMs: 50 });

    const first = await client.requestJson('https://example.test/api');
    expect(first.cached).toBe(false);

    await vi.advanceTimersByTimeAsync(60);

    const second = await client.requestJson('https://example.test/api');
    expect(second.cached).toBe(false);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('prunes cache when exceeding maxCacheEntries', async () => {
    const fetchImpl = vi.fn(async () => makeResponse({ status: 200, json: { ok: true } }));
    const client = createApiClient({ fetchImpl, defaultCacheTtlMs: 10_000, maxCacheEntries: 1 });

    await client.requestJson('https://example.test/a');
    await client.requestJson('https://example.test/b');

    // Oldest entry should be pruned, so requesting "a" again triggers fetch.
    await client.requestJson('https://example.test/a', {}, { cache: true });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it('retries on 5xx and eventually succeeds', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(makeResponse({ status: 503, json: { message: 'busy' } }))
      .mockResolvedValueOnce(makeResponse({ status: 200, json: { ok: true } }));

    const client = createApiClient({ fetchImpl });

    const res = await client.requestJson(
      'https://example.test/api',
      {},
      { retries: 2, baseDelayMs: 0, maxDelayMs: 0, cache: false },
    );

    expect(res.ok).toBe(true);
    expect(res.cached).toBe(false);
    expect(res.data).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('retries on 429 and can be aborted before sleeping', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const controller = new AbortController();
    controller.abort();

    const fetchImpl = vi
      .fn()
      .mockResolvedValue(makeResponse({ status: 429, json: { message: 'rate' } }));
    const client = createApiClient({ fetchImpl });

    await expect(
      client.requestJson(
        'https://example.test/api',
        { signal: controller.signal },
        { retries: 1, baseDelayMs: 50, maxDelayMs: 50, cache: false },
      ),
    ).rejects.toThrow(/Abort/i);
  });

  it('can be aborted during retry backoff', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const controller = new AbortController();
    const fetchImpl = vi
      .fn()
      .mockResolvedValue(makeResponse({ status: 503, json: { message: 'busy' } }));
    const client = createApiClient({ fetchImpl });

    const pending = client.requestJson(
      'https://example.test/api',
      { signal: controller.signal },
      { retries: 2, baseDelayMs: 100, maxDelayMs: 100, cache: false },
    );

    await Promise.resolve();
    const assertion = expect(pending).rejects.toThrow(/Abort/i);
    controller.abort();
    await assertion;
  });

  it('does not retry on 4xx by default', async () => {
    const fetchImpl = vi.fn(async () => makeResponse({ status: 404, json: { error: 'nope' } }));
    const client = createApiClient({ fetchImpl });

    const res = await client.requestJson(
      'https://example.test/api',
      {},
      { retries: 2, baseDelayMs: 0, maxDelayMs: 0, cache: false },
    );

    expect(res.ok).toBe(false);
    expect(res.status).toBe(404);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('returns ok:true with null data when response JSON is invalid', async () => {
    const fetchImpl = vi.fn(async () => makeResponse({ status: 200, text: '{not-json' }));
    const client = createApiClient({ fetchImpl, defaultCacheTtlMs: 10_000 });

    const res = await client.requestJson(
      'https://example.test/api',
      {},
      { cache: false, dedup: false },
    );
    expect(res.ok).toBe(true);
    expect(res.data).toBeNull();
  });

  it('does not cache or dedup non-GET methods', async () => {
    const fetchImpl = vi.fn(async () => makeResponse({ status: 200, json: { ok: true } }));
    const client = createApiClient({ fetchImpl });

    await client.requestJson('https://example.test/api', { method: 'POST' });
    await client.requestJson('https://example.test/api', { method: 'POST' });

    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('dedups concurrent GET requests', async () => {
    let resolveFetch = null;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });
    const fetchImpl = vi.fn(() => fetchPromise);
    const client = createApiClient({ fetchImpl });

    const a = client.requestJson(
      'https://example.test/api',
      {},
      { retries: 0, baseDelayMs: 0, maxDelayMs: 0, cache: false, dedup: true },
    );
    const b = client.requestJson(
      'https://example.test/api',
      {},
      { retries: 0, baseDelayMs: 0, maxDelayMs: 0, cache: false, dedup: true },
    );

    resolveFetch(makeResponse({ status: 200, json: { ok: true } }));

    const [resA, resB] = await Promise.all([a, b]);

    expect(resA.ok).toBe(true);
    expect(resB.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('does not dedup concurrent requests when dedup is disabled', async () => {
    let resolveA = null;
    let resolveB = null;
    const fetchImpl = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveA = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveB = resolve;
          }),
      );

    const client = createApiClient({ fetchImpl });

    const a = client.requestJson(
      'https://example.test/api',
      {},
      { retries: 0, baseDelayMs: 0, maxDelayMs: 0, cache: false, dedup: false },
    );
    const b = client.requestJson(
      'https://example.test/api',
      {},
      { retries: 0, baseDelayMs: 0, maxDelayMs: 0, cache: false, dedup: false },
    );

    resolveA(makeResponse({ status: 200, json: { ok: true, id: 'a' } }));
    resolveB(makeResponse({ status: 200, json: { ok: true, id: 'b' } }));

    const [resA, resB] = await Promise.all([a, b]);
    expect(resA.ok).toBe(true);
    expect(resB.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('retries fetch exceptions and eventually throws the last error', async () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error('net'))
      .mockRejectedValueOnce(new Error('net2'));
    const client = createApiClient({ fetchImpl });

    const pending = client.requestJson(
      'https://example.test/api',
      {},
      { retries: 1, baseDelayMs: 100, maxDelayMs: 100, cache: false, dedup: false },
    );

    const assertion = expect(pending).rejects.toThrow(/net2|net/i);
    await vi.advanceTimersByTimeAsync(200);
    await assertion;
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('supports cache invalidation helpers', async () => {
    const fetchImpl = vi.fn(async () => makeResponse({ status: 200, json: { ok: true } }));
    const client = createApiClient({ fetchImpl, defaultCacheTtlMs: 10_000 });

    await client.requestJson('https://example.test/api');
    await client.requestJson('https://example.test/api');
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    client.invalidate('https://example.test/api');
    await client.requestJson('https://example.test/api');
    expect(fetchImpl).toHaveBeenCalledTimes(2);

    client.clearCache();
    await client.requestJson('https://example.test/api');
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });
});
