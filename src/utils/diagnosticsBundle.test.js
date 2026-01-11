import { describe, expect, it, vi } from 'vitest';

describe('diagnosticsBundle', () => {
  it('buildDiagnosticsBundle includes snapshot/logs/errors/events', async () => {
    vi.resetModules();
    vi.doMock('./buildInfo', () => ({
      getBuildInfo: () => ({ version: '0.0.0-test', sha: 'deadbeef' }),
    }));
    vi.doMock('./healthConsole', () => ({
      getHealthSnapshot: () => ({ ok: true }),
    }));
    vi.doMock('./logger', () => ({
      getLogs: () => [{ id: 'l1' }, { id: 'l2' }],
    }));
    vi.doMock('./errorReporter', () => ({
      getErrorReports: () => [{ id: 'e1' }, { id: 'e2' }],
    }));
    vi.doMock('./analytics', () => ({
      getEvents: () => [{ id: 'a1' }, { id: 'a2' }],
    }));

    const { buildDiagnosticsBundle } = await import('./diagnosticsBundle');
    const bundle = buildDiagnosticsBundle({ maxLogs: 1, maxErrors: 1, maxEvents: 1 });

    expect(bundle).toEqual(
      expect.objectContaining({
        schemaVersion: 2,
        generatedAt: expect.any(String),
        build: { version: '0.0.0-test', sha: 'deadbeef' },
        snapshot: { ok: true },
        logs: [{ id: 'l1' }],
        errors: [{ id: 'e1' }],
        events: [{ id: 'a1' }],
      }),
    );
  });
});
