import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyTextToClipboard, shareOrCopyLink } from './share';

describe('shareOrCopyLink', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses navigator.share when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis.navigator, 'share', { value: share, configurable: true });

    const res = await shareOrCopyLink({ title: 't', url: 'https://example.com' });
    expect(res).toEqual({ ok: true, method: 'share' });
    expect(share).toHaveBeenCalledTimes(1);
  });

  it('falls back to clipboard when share throws', async () => {
    const share = vi.fn().mockRejectedValue(new Error('cancel'));
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(globalThis.navigator, 'share', { value: share, configurable: true });
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const res = await shareOrCopyLink({ title: 't', url: 'https://example.com' });
    expect(res).toEqual({ ok: true, method: 'clipboard' });
    expect(writeText).toHaveBeenCalledWith('https://example.com');
  });

  it('falls back to execCommand when clipboard not available', async () => {
    Object.defineProperty(globalThis.navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    document.execCommand = vi.fn().mockReturnValue(true);

    const res = await shareOrCopyLink({ title: 't', url: 'https://example.com' });
    expect(res).toEqual({ ok: true, method: 'clipboard' });
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('returns none when window is missing', async () => {
    vi.stubGlobal('window', undefined);
    const res = await shareOrCopyLink({ title: 't', url: 'https://example.com' });
    expect(res).toEqual({ ok: false, method: 'none' });
  });

  it('returns none when resolved url is empty', async () => {
    vi.stubGlobal('window', { location: { href: '', origin: '' } });
    const res = await shareOrCopyLink({ title: 't' });
    expect(res).toEqual({ ok: false, method: 'none' });
  });

  it('falls back to manual when clipboard + execCommand are unavailable', async () => {
    Object.defineProperty(globalThis.navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    document.execCommand = vi.fn().mockReturnValue(false);

    const res = await shareOrCopyLink({ title: 't', url: 'https://example.com' });
    expect(res).toEqual({ ok: false, method: 'manual' });
  });

  it('falls back to execCommand when clipboard throws', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(globalThis.navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });
    document.execCommand = vi.fn().mockReturnValue(true);

    const res = await shareOrCopyLink({ title: 't', url: 'https://example.com' });
    expect(res).toEqual({ ok: true, method: 'clipboard' });
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('returns manual when execCommand path throws', async () => {
    Object.defineProperty(globalThis.navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });

    const spy = vi.spyOn(document, 'createElement').mockImplementation(() => {
      throw new Error('boom');
    });

    const res = await shareOrCopyLink({ title: 't', url: 'https://example.com' });
    expect(res).toEqual({ ok: false, method: 'manual' });
    spy.mockRestore();
  });
});

describe('copyTextToClipboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns none when window is missing', async () => {
    vi.stubGlobal('window', undefined);
    const res = await copyTextToClipboard('x');
    expect(res).toEqual({ ok: false, method: 'none' });
  });

  it('uses navigator.clipboard when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const res = await copyTextToClipboard('hello');
    expect(res).toEqual({ ok: true, method: 'clipboard' });
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to execCommand when clipboard not available', async () => {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    document.execCommand = vi.fn().mockReturnValue(true);

    const res = await copyTextToClipboard('hello');
    expect(res).toEqual({ ok: true, method: 'clipboard' });
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('returns manual when clipboard and execCommand are unavailable', async () => {
    Object.defineProperty(globalThis.navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });
    document.execCommand = vi.fn().mockReturnValue(false);

    const res = await copyTextToClipboard('hello');
    expect(res).toEqual({ ok: false, method: 'manual' });
  });

  it('returns none when text is empty', async () => {
    const res = await copyTextToClipboard('');
    expect(res).toEqual({ ok: false, method: 'none' });
  });
});
