import { afterEach, describe, expect, it, vi } from 'vitest';

const loadDatetime = async () => {
  vi.resetModules();
  return import('./datetime');
};

describe('datetime utils', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns fallback for empty/invalid inputs', async () => {
    const { formatZhDate, formatZhDateTime, formatZhMonthDayTime } = await loadDatetime();

    expect(formatZhDate(null, 'fallback')).toBe('fallback');
    expect(formatZhDate(0, 'fallback')).toBe('fallback');
    expect(formatZhDate(new Date('invalid'), 'fallback')).toBe('fallback');
    expect(formatZhDate('not-a-date', 'fallback')).toBe('fallback');
    expect(formatZhDate(Infinity, 'fallback')).toBe('fallback');

    expect(formatZhDateTime('', 'fallback')).toBe('fallback');
    expect(formatZhMonthDayTime(undefined, 'fallback')).toBe('fallback');
  });

  it('formats Date / timestamp / ISO string into non-empty strings', async () => {
    const { formatZhDate, formatZhDateTime, formatZhMonthDayTime } = await loadDatetime();
    const inputDate = new Date('2025-01-02T03:04:05Z');
    const inputTimestamp = inputDate.getTime();
    const inputString = inputDate.toISOString();

    const outputs = [
      formatZhDate(inputDate),
      formatZhDate(inputTimestamp),
      formatZhDate(inputString),
      formatZhDateTime(inputDate),
      formatZhMonthDayTime(inputDate),
    ];

    outputs.forEach((out) => {
      expect(typeof out).toBe('string');
      expect(out.length).toBeGreaterThan(0);
      expect(out).toMatch(/\d/);
    });
  });

  it('falls back to toLocaleString when Intl.DateTimeFormat constructor throws', async () => {
    const original = Intl.DateTimeFormat;
    Intl.DateTimeFormat = function DateTimeFormatThrows() {
      throw new Error('boom');
    };

    const { formatZhDate } = await loadDatetime();
    const out = formatZhDate('2025-01-02T03:04:05Z', 'fallback');
    expect(out).not.toBe('fallback');
    expect(out).toMatch(/\d/);

    Intl.DateTimeFormat = original;
  });

  it('returns fallback when both formatter and toLocaleString fail', async () => {
    const originalDateTimeFormat = Intl.DateTimeFormat;
    const originalToLocaleString = Date.prototype.toLocaleString;

    Intl.DateTimeFormat = function DateTimeFormatThrows() {
      throw new Error('boom');
    };
    Date.prototype.toLocaleString = function toLocaleStringThrows() {
      throw new Error('boom');
    };

    const { formatZhDate } = await loadDatetime();
    expect(formatZhDate('2025-01-02', 'fallback')).toBe('fallback');

    Intl.DateTimeFormat = originalDateTimeFormat;
    Date.prototype.toLocaleString = originalToLocaleString;
  });

  it('handles formatter.format throwing and still returns a string', async () => {
    const originalDateTimeFormat = Intl.DateTimeFormat;
    Intl.DateTimeFormat = function DateTimeFormatWithBrokenFormat() {
      return {
        format: () => {
          throw new Error('boom');
        },
      };
    };

    const { formatZhDateTime } = await loadDatetime();
    const out = formatZhDateTime('2025-01-02T03:04:05Z', 'fallback');
    expect(out).not.toBe('fallback');
    expect(out).toMatch(/\d/);

    Intl.DateTimeFormat = originalDateTimeFormat;
  });
});
