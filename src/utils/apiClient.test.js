import { describe, expect, it, vi } from 'vitest';

import { createApiClient } from './apiClient';

const makeResponse = ({ status = 200, json = null } = {}) => {
  const ok = status >= 200 && status <= 299;
  return {
    ok,
    status,
    text: async () => (json == null ? '' : JSON.stringify(json)),
  };
};

describe('apiClient', () => {
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
