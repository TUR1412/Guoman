import { afterEach, describe, expect, it, vi } from 'vitest';

import { downloadBinaryFile, downloadTextFile } from './download';

describe('download', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns no-document when document is missing', () => {
    vi.stubGlobal('document', undefined);
    expect(downloadTextFile({ text: 'a', filename: 'a.txt' })).toEqual({
      ok: false,
      reason: 'no-document',
    });
  });

  it('downloads via blob URL', () => {
    const createObjectURL = vi.fn(() => 'blob:mock');
    const revokeObjectURL = vi.fn();
    window.URL.createObjectURL = createObjectURL;
    window.URL.revokeObjectURL = revokeObjectURL;
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const res = downloadTextFile({ text: 'hello', filename: 'hello.txt' });
    expect(res).toEqual({ ok: true });
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });

  it('downloads binary payloads via blob URL', () => {
    const createObjectURL = vi.fn(() => 'blob:mock-binary');
    const revokeObjectURL = vi.fn();
    window.URL.createObjectURL = createObjectURL;
    window.URL.revokeObjectURL = revokeObjectURL;
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const res = downloadBinaryFile({
      bytes: new Uint8Array([1, 2, 3]),
      filename: 'data.bin',
      mimeType: 'application/octet-stream',
    });

    expect(res).toEqual({ ok: true });
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-binary');
  });

  it('returns exception on unexpected errors', () => {
    window.URL.createObjectURL = vi.fn(() => {
      throw new Error('boom');
    });

    expect(downloadTextFile({ text: 'x', filename: 'x.txt' })).toEqual({
      ok: false,
      reason: 'exception',
    });
  });
});
