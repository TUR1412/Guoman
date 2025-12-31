import { describe, expect, it } from 'vitest';

import { formatBytes } from './formatBytes';

describe('formatBytes', () => {
  it('returns 0 B for non-finite or non-positive inputs', () => {
    expect(formatBytes()).toBe('0 B');
    expect(formatBytes(null)).toBe('0 B');
    expect(formatBytes(NaN)).toBe('0 B');
    expect(formatBytes(Infinity)).toBe('0 B');
    expect(formatBytes(-1)).toBe('0 B');
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats values across units', () => {
    expect(formatBytes(1)).toBe('1 B');
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(1536)).toBe('1.50 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1.00 GB');
  });

  it('caps at GB for very large values', () => {
    const out = formatBytes(1024 ** 5);
    expect(out.endsWith(' GB')).toBe(true);
  });
});
