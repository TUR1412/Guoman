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
