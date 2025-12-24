const LOCALE = 'zh-CN';

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const timestamp = typeof value === 'number' ? value : Date.parse(String(value));
  if (!Number.isFinite(timestamp)) return null;
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
};

const makeFormatter = (options) => {
  try {
    return new Intl.DateTimeFormat(LOCALE, options);
  } catch {
    return null;
  }
};

const formatWith = (formatter, value, fallback) => {
  const date = toDate(value);
  if (!date) return fallback;

  try {
    if (formatter) return formatter.format(date);
  } catch {}

  try {
    return date.toLocaleString(LOCALE);
  } catch {
    return fallback;
  }
};

const FORMATTER_DATE = makeFormatter({ year: 'numeric', month: '2-digit', day: '2-digit' });
const FORMATTER_DATE_TIME = makeFormatter({
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});
const FORMATTER_MONTH_DAY_TIME = makeFormatter({
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

export const formatZhDate = (value, fallback = '') => formatWith(FORMATTER_DATE, value, fallback);

export const formatZhDateTime = (value, fallback = '') =>
  formatWith(FORMATTER_DATE_TIME, value, fallback);

export const formatZhMonthDayTime = (value, fallback = '') =>
  formatWith(FORMATTER_MONTH_DAY_TIME, value, fallback);
