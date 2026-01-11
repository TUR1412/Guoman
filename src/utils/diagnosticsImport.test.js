import { afterEach, describe, expect, it, vi } from 'vitest';

import { gzipCompressString } from './compression';
import { decodeDiagnosticsBytes, parseDiagnosticsBundleText } from './diagnosticsImport';

describe('diagnosticsImport', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns gzip-unavailable when gzip is detected but streams are missing', async () => {
    vi.stubGlobal('CompressionStream', undefined);
    vi.stubGlobal('DecompressionStream', undefined);

    const bytes = new Uint8Array([0x1f, 0x8b, 0x08, 0x00, 0x00]);
    const res = await decodeDiagnosticsBytes({ bytes, filename: 'bundle.json.gz' });
    expect(res).toEqual({ ok: false, reason: 'gzip-unavailable' });
  });

  it('decodes plain JSON bytes', async () => {
    const input = '{"schemaVersion":2,"logs":[],"errors":[]}';
    const bytes = new TextEncoder().encode(input);
    const res = await decodeDiagnosticsBytes({ bytes, filename: 'bundle.json' });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.text).toBe(input);
      expect(res.gzip).toBe(false);
    }
  });

  it('decodes gzip JSON bundles when supported', async () => {
    const input = '{"schemaVersion":2,"logs":[],"errors":[]}';
    const bytes = await gzipCompressString(input);
    const res = await decodeDiagnosticsBytes({ bytes, filename: 'bundle.json.gz' });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.text).toBe(input);
      expect(res.gzip).toBe(true);
    }
  });

  it('parses valid diagnostics bundles', () => {
    const res = parseDiagnosticsBundleText('{"schemaVersion":2,"logs":[],"errors":[]}');
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.bundle.schemaVersion).toBe(2);
      expect(res.bundle.logs).toEqual([]);
      expect(res.bundle.errors).toEqual([]);
    }
  });

  it('rejects invalid JSON', () => {
    expect(parseDiagnosticsBundleText('{')).toEqual({ ok: false, reason: 'invalid-json' });
  });

  it('rejects bundles missing required fields', () => {
    expect(parseDiagnosticsBundleText('{"schemaVersion":2}')).toEqual({
      ok: false,
      reason: 'invalid-schema',
    });
  });
});
