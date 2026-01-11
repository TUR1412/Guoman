import { afterEach, describe, expect, it, vi } from 'vitest';

import { gzipCompressString } from './compression';
import {
  decodeDiagnosticsBytes,
  parseDiagnosticsBundleText,
  summarizeDiagnosticsBundle,
} from './diagnosticsImport';

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

  it('summarizes diagnostics bundles defensively', () => {
    const summary = summarizeDiagnosticsBundle({
      schemaVersion: 2,
      generatedAt: '2025-01-01T00:00:00.000Z',
      build: { version: '1.0.0', shortSha: 'abc1234' },
      logs: [{ id: 1 }],
      errors: [{ id: 2 }, { id: 3 }],
      events: [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }],
      snapshot: { perf: { inp: { value: 123 } } },
    });

    expect(summary.schemaVersion).toBe(2);
    expect(summary.build.version).toBe('1.0.0');
    expect(summary.build.shortSha).toBe('abc1234');
    expect(summary.logsCount).toBe(1);
    expect(summary.errorsCount).toBe(2);
    expect(summary.eventsCount).toBe(3);
    expect(summary.perf.inp).toBe(123);
  });
});
