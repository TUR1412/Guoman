export const safeJsonParse = (raw, fallback) => {
  if (raw === null || raw === undefined || raw === '') return fallback;

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};
