const toUint8 = (value) => {
  const text = typeof value === 'string' ? value : String(value ?? '');
  if (typeof TextEncoder === 'undefined') {
    // Fallback：无法可靠转 bytes 时直接用 UTF-16 length 近似（只用于兜底场景）
    const out = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i += 1) out[i] = text.charCodeAt(i) & 0xff;
    return out;
  }
  return new TextEncoder().encode(text);
};

const fromUint8 = (bytes) => {
  if (!bytes) return '';
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (typeof TextDecoder === 'undefined') {
    let out = '';
    for (let i = 0; i < view.length; i += 1) out += String.fromCharCode(view[i]);
    return out;
  }
  return new TextDecoder().decode(view);
};

const toArrayBuffer = async (readable) => {
  const res = new Response(readable);
  return res.arrayBuffer();
};

export const canGzip = () =>
  typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';

export const gzipCompressString = async (text) => {
  const input = toUint8(text);
  if (!canGzip()) return input;

  try {
    const stream = new CompressionStream('gzip');
    const writer = stream.writable.getWriter();
    await writer.write(input);
    await writer.close();
    const buffer = await toArrayBuffer(stream.readable);
    return new Uint8Array(buffer);
  } catch {
    return input;
  }
};

export const gzipDecompressToString = async (bytes) => {
  const input = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
  if (!canGzip()) return fromUint8(input);

  try {
    const stream = new DecompressionStream('gzip');
    const writer = stream.writable.getWriter();
    await writer.write(input);
    await writer.close();
    const buffer = await toArrayBuffer(stream.readable);
    return fromUint8(new Uint8Array(buffer));
  } catch {
    return fromUint8(input);
  }
};
