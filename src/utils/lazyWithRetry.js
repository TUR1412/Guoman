import { lazy } from 'react';
import { logError, logWarn } from './logger';

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const isChunkLoadError = (error) => {
  const message = String(error?.message || error || '');
  if (!message) return false;

  return /Loading chunk|ChunkLoadError|dynamically imported module|Importing a module script failed|Failed to fetch dynamically imported module/i.test(
    message,
  );
};

export const retryImport = async (
  importer,
  { retries = 2, delayMs = 450, shouldRetry = isChunkLoadError, source = 'lazyWithRetry' } = {},
) => {
  if (typeof importer !== 'function') {
    throw new Error('importer must be a function');
  }

  let attempt = 0;
  while (true) {
    try {
      return await importer();
    } catch (error) {
      const retryable = shouldRetry?.(error);
      const remaining = Math.max(0, Number(retries) || 0) - attempt;

      if (retryable && remaining > 0) {
        attempt += 1;
        logWarn(
          'Dynamic import failed, retrying…',
          {
            attempt,
            remaining,
            message: error?.message || String(error),
          },
          source,
        );
        await sleep(Math.max(0, Number(delayMs) || 0) * attempt);
        continue;
      }

      logError(
        'Dynamic import failed',
        {
          attempts: attempt + 1,
          message: error?.message || String(error),
        },
        source,
      );
      throw error;
    }
  }
};

export const lazyWithRetry = (importer, options) => lazy(() => retryImport(importer, options));
