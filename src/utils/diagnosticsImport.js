import { canGzip, gzipDecompressToString } from './compression';

const toUint8 = (bytes) => {
  if (!bytes) return new Uint8Array();
  if (bytes instanceof Uint8Array) return bytes;
  try {
    return new Uint8Array(bytes);
  } catch {
    return new Uint8Array();
  }
};

export const isGzipBytes = (bytes) => {
  const view = toUint8(bytes);
  return view.length >= 2 && view[0] === 0x1f && view[1] === 0x8b;
};

export const decodeDiagnosticsBytes = async ({ bytes, filename }) => {
  const view = toUint8(bytes);
  const lowerName = typeof filename === 'string' ? filename.toLowerCase() : '';
  const gzip = lowerName.endsWith('.gz') || isGzipBytes(view);

  if (gzip && !canGzip()) {
    return { ok: false, reason: 'gzip-unavailable' };
  }

  const text = await gzipDecompressToString(view);
  return { ok: true, text, gzip };
};

export const parseDiagnosticsBundleText = (text) => {
  if (typeof text !== 'string') {
    return { ok: false, reason: 'invalid-json' };
  }

  let bundle;
  try {
    bundle = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'invalid-json' };
  }

  if (!bundle || typeof bundle !== 'object' || Array.isArray(bundle)) {
    return { ok: false, reason: 'invalid-schema' };
  }

  const schemaVersion = Number(bundle.schemaVersion);
  if (!Number.isFinite(schemaVersion) || schemaVersion <= 0) {
    return { ok: false, reason: 'invalid-schema' };
  }

  if (!Array.isArray(bundle.logs) || !Array.isArray(bundle.errors)) {
    return { ok: false, reason: 'invalid-schema' };
  }

  return { ok: true, bundle };
};

export const summarizeDiagnosticsBundle = (bundle) => {
  const b = bundle && typeof bundle === 'object' ? bundle : {};
  const build = b.build && typeof b.build === 'object' ? b.build : {};
  const snapshot = b.snapshot && typeof b.snapshot === 'object' ? b.snapshot : {};
  const perf = snapshot.perf && typeof snapshot.perf === 'object' ? snapshot.perf : {};

  const toMetricValue = (metric) => {
    const value = metric && typeof metric === 'object' ? metric.value : metric;
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  };

  return {
    schemaVersion: typeof b.schemaVersion === 'number' ? b.schemaVersion : null,
    generatedAt: typeof b.generatedAt === 'string' ? b.generatedAt : null,
    build: {
      version: typeof build.version === 'string' ? build.version : null,
      sha: typeof build.sha === 'string' ? build.sha : null,
      shortSha: typeof build.shortSha === 'string' ? build.shortSha : null,
      builtAt: typeof build.builtAt === 'string' ? build.builtAt : null,
    },
    logsCount: Array.isArray(b.logs) ? b.logs.length : 0,
    errorsCount: Array.isArray(b.errors) ? b.errors.length : 0,
    perf: {
      cls: toMetricValue(perf.cls),
      lcp: toMetricValue(perf.lcp),
      fid: toMetricValue(perf.fid),
      inp: toMetricValue(perf.inp),
    },
  };
};
