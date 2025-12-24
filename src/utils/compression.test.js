import { describe, expect, it, vi } from 'vitest';

import { canGzip, gzipCompressString, gzipDecompressToString } from './compression';

describe('compression', () => {
  it('canGzip is false when CompressionStream/DecompressionStream are missing', () => {
    vi.stubGlobal('CompressionStream', undefined);
    vi.stubGlobal('DecompressionStream', undefined);
    expect(canGzip()).toBe(false);
  });

  it('gzipCompressString falls back to plain UTF-8 bytes when gzip is unavailable', async () => {
    vi.stubGlobal('CompressionStream', undefined);
    vi.stubGlobal('DecompressionStream', undefined);

    const bytes = await gzipCompressString('hello');
    expect(ArrayBuffer.isView(bytes)).toBe(true);
    expect(Array.from(bytes)).toEqual(Array.from(new TextEncoder().encode('hello')));
  });

  it('gzipDecompressToString falls back to decoding bytes when gzip is unavailable', async () => {
    vi.stubGlobal('CompressionStream', undefined);
    vi.stubGlobal('DecompressionStream', undefined);

    const input = new TextEncoder().encode('hello');
    const text = await gzipDecompressToString(input);
    expect(text).toBe('hello');
  });
});
