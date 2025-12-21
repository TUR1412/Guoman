export const safeJsonParse = (raw, fallback) => {
  if (raw === null || raw === undefined || raw === '') return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const safeJsonStringify = (value, fallback = '') => {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
};
