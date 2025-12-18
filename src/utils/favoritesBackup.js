export const FAVORITES_BACKUP_SCHEMA_VERSION = 1;

const normalizeId = (value) => {
  const id = Number(value);
  if (!Number.isFinite(id)) return null;
  if (!Number.isInteger(id)) return null;
  if (id <= 0) return null;
  return id;
};

const uniqueSorted = (values) => Array.from(new Set(values)).sort((a, b) => a - b);

export const createFavoritesBackupPayload = (
  favoriteIds,
  { exportedAt = new Date().toISOString() } = {},
) => {
  const rawIds = favoriteIds instanceof Set ? Array.from(favoriteIds) : favoriteIds;
  const normalized = Array.isArray(rawIds) ? rawIds.map(normalizeId).filter(Boolean) : [];

  return {
    schemaVersion: FAVORITES_BACKUP_SCHEMA_VERSION,
    exportedAt,
    favoriteIds: uniqueSorted(normalized),
  };
};

export const serializeFavoritesBackup = (favoriteIds, options) =>
  JSON.stringify(createFavoritesBackupPayload(favoriteIds, options), null, 2);

export const parseFavoritesBackup = (jsonText) => {
  if (typeof jsonText !== 'string') {
    throw new Error('备份文件内容必须是字符串');
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error('备份文件不是有效的 JSON');
  }

  // 兼容旧格式：直接导出为数组 [1,2,3]
  if (Array.isArray(parsed)) {
    return {
      schemaVersion: null,
      exportedAt: null,
      favoriteIds: uniqueSorted(parsed.map(normalizeId).filter(Boolean)),
    };
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('备份 JSON 格式不受支持');
  }

  const ids = parsed.favoriteIds ?? parsed.favorites ?? parsed.ids;
  if (!Array.isArray(ids)) {
    throw new Error('备份文件缺少 favoriteIds 数组');
  }

  return {
    schemaVersion: typeof parsed.schemaVersion === 'number' ? parsed.schemaVersion : null,
    exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : null,
    favoriteIds: uniqueSorted(ids.map(normalizeId).filter(Boolean)),
  };
};
