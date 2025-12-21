import { describe, expect, it } from 'vitest';

import { safeJsonParse } from './json';

describe('json utils', () => {
  it('returns fallback for empty-ish inputs', () => {
    expect(safeJsonParse(null, 1)).toBe(1);
    expect(safeJsonParse(undefined, 2)).toBe(2);
    expect(safeJsonParse('', 3)).toBe(3);
  });

  it('parses valid json', () => {
    expect(safeJsonParse('{"a":1}', null)).toEqual({ a: 1 });
    expect(safeJsonParse('[1,2,3]', null)).toEqual([1, 2, 3]);
  });

  it('returns fallback for invalid json', () => {
    expect(safeJsonParse('{oops}', { ok: false })).toEqual({ ok: false });
  });
});
