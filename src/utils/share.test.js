import { describe, expect, it, vi } from 'vitest';
import { shareOrCopyLink } from './share';

describe('shareOrCopyLink', () => {
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
});
