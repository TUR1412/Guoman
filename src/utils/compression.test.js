import { afterEach, describe, expect, it, vi } from 'vitest';

import { canGzip, gzipCompressString, gzipDecompressToString } from './compression';

describe('compression', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('canGzip is false when CompressionStream/DecompressionStream are missing', () => {
    vi.stubGlobal('CompressionStream', undefined);
    vi.stubGlobal('DecompressionStream', undefined);
    expect(canGzip()).toBe(false);
  });

  it('canGzip is false when only one of the streams is available', () => {
    vi.stubGlobal('CompressionStream', globalThis.CompressionStream);
    vi.stubGlobal('DecompressionStream', undefined);
    expect(canGzip()).toBe(false);
  });

  it('canGzip is true when the platform supports CompressionStream', () => {
    expect(canGzip()).toBe(true);
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

  it('supports gzip roundtrip when streams are available', async () => {
    const bytes = await gzipCompressString('hello world');
    expect(bytes).toBeInstanceOf(Uint8Array);

    const text = await gzipDecompressToString(bytes);
    expect(text).toBe('hello world');
  });

  it('falls back to char-code encoding/decoding when TextEncoder/TextDecoder are missing', async () => {
    vi.stubGlobal('CompressionStream', undefined);
    vi.stubGlobal('DecompressionStream', undefined);
    vi.stubGlobal('TextEncoder', undefined);
    vi.stubGlobal('TextDecoder', undefined);

    const bytes = await gzipCompressString('hello');
    expect(bytes).toBeInstanceOf(Uint8Array);

    const text = await gzipDecompressToString(bytes.buffer);
    expect(text).toBe('hello');
  });

  it('handles non-string inputs and null/undefined bytes defensively', async () => {
    vi.stubGlobal('CompressionStream', undefined);
    vi.stubGlobal('DecompressionStream', undefined);

    const bytes = await gzipCompressString(42);
    expect(Array.from(bytes)).toEqual(Array.from(new TextEncoder().encode('42')));

    expect(await gzipDecompressToString(null)).toBe('');
    expect(await gzipDecompressToString(undefined)).toBe('');
  });

  it('returns original bytes when compression throws', async () => {
    const OriginalDecompressionStream = globalThis.DecompressionStream;

    vi.stubGlobal(
      'CompressionStream',
      class BrokenCompressionStream {
        constructor() {
          throw new Error('boom');
        }
      },
    );
    vi.stubGlobal('DecompressionStream', OriginalDecompressionStream);

    const bytes = await gzipCompressString('hello');
    expect(Array.from(bytes)).toEqual(Array.from(new TextEncoder().encode('hello')));
  });

  it('returns decoded original bytes when decompression throws', async () => {
    const OriginalCompressionStream = globalThis.CompressionStream;

    vi.stubGlobal('CompressionStream', OriginalCompressionStream);
    vi.stubGlobal(
      'DecompressionStream',
      class BrokenDecompressionStream {
        constructor() {
          throw new Error('boom');
        }
      },
    );

    const input = new TextEncoder().encode('hello');
    const text = await gzipDecompressToString(input);
    expect(text).toBe('hello');
  });
});
