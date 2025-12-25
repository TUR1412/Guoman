const sleep = (ms, { signal } = {}) =>
  new Promise((resolve, reject) => {
    if (!Number.isFinite(ms) || ms <= 0) {
      resolve();
      return;
    }

    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const id = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal?.addEventListener?.('abort', onAbort, { once: true });
  });

const jitterMs = (ms, ratio = 0.2) => {
  const base = Math.max(0, Number(ms) || 0);
  const r = Math.max(0, Number(ratio) || 0);
  const delta = base * r;
  const low = base - delta;
  const high = base + delta;
  return Math.round(low + Math.random() * (high - low));
};

const isRetriableStatus = (status) => status === 429 || (status >= 500 && status <= 599);

const normalizeMethod = (value) => String(value || 'GET').toUpperCase();

const safeParseJson = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const createApiClient = ({
  fetchImpl,
  defaultCacheTtlMs = 30_000,
  maxCacheEntries = 80,
} = {}) => {
  const fetchFn =
    typeof fetchImpl === 'function'
      ? fetchImpl
      : typeof fetch === 'function'
        ? fetch
        : null;

  const cache = new Map(); // key -> { at, ttl, value }
  const inFlight = new Map(); // key -> Promise

  const pruneCache = () => {
    if (cache.size <= maxCacheEntries) return;
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].at - b[1].at);
    const removeCount = Math.max(0, cache.size - maxCacheEntries);
    entries.slice(0, removeCount).forEach(([key]) => cache.delete(key));
  };

  const getCached = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.at > entry.ttl) {
      cache.delete(key);
      return null;
    }
    return entry.value;
  };

  const setCached = (key, value, ttlMs) => {
    cache.set(key, { at: Date.now(), ttl: ttlMs, value });
    pruneCache();
  };

  const requestJson = async (url, options = {}, requestOptions = {}) => {
    if (!fetchFn) throw new Error('No fetch implementation available');
    const method = normalizeMethod(options.method);
    const cacheTtlMs = Number(requestOptions.cacheTtlMs ?? defaultCacheTtlMs);
    const enableCache = requestOptions.cache !== false && method === 'GET';
    const enableDedup = requestOptions.dedup !== false && method === 'GET';
    const retries = Math.max(0, Number(requestOptions.retries ?? 2));
    const baseDelayMs = Math.max(0, Number(requestOptions.baseDelayMs ?? 240));
    const maxDelayMs = Math.max(baseDelayMs, Number(requestOptions.maxDelayMs ?? 1600));
    const signal = options.signal;

    const key = `${method}:${String(url)}`;

    if (enableCache) {
      const cached = getCached(key);
      if (cached !== null) return { ok: true, cached: true, data: cached, status: 200 };
    }

    if (enableDedup && inFlight.has(key)) {
      return inFlight.get(key);
    }

    const exec = (async () => {
      let lastError = null;

      for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
          const response = await fetchFn(url, options);
          const status = response.status;

          if (!response.ok) {
            const shouldRetry = attempt < retries && isRetriableStatus(status);
            if (!shouldRetry) {
              const data = await safeParseJson(response);
              return { ok: false, cached: false, data, status };
            }

            const backoff = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
            await sleep(jitterMs(backoff), { signal });
            continue;
          }

          const data = await safeParseJson(response);
          if (enableCache) {
            setCached(key, data, cacheTtlMs);
          }
          return { ok: true, cached: false, data, status };
        } catch (error) {
          lastError = error;
          if (signal?.aborted) throw error;
          if (attempt >= retries) break;

          const backoff = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
          await sleep(jitterMs(backoff), { signal });
        }
      }

      throw lastError || new Error('Request failed');
    })();

    if (enableDedup) {
      inFlight.set(key, exec);
      exec.finally(() => inFlight.delete(key));
    }

    return exec;
  };

  const clearCache = () => cache.clear();

  const invalidate = (url, { method = 'GET' } = {}) => {
    const key = `${normalizeMethod(method)}:${String(url)}`;
    cache.delete(key);
  };

  return {
    requestJson,
    clearCache,
    invalidate,
  };
};

