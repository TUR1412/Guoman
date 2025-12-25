import { safeLocalStorageGet } from './storage';
import { scheduleStorageWrite } from './storageQueue';
import { STORAGE_KEYS } from './dataKeys';
import { safeJsonParse } from './json';

const readKey = (key, fallback) => safeJsonParse(safeLocalStorageGet(key), fallback);

const mergeArrays = (prev, next) => {
  const set = new Set([...(Array.isArray(prev) ? prev : []), ...(Array.isArray(next) ? next : [])]);
  return Array.from(set);
};

const mergeObjects = (prev, next) => {
  if (!prev || typeof prev !== 'object') return next;
  if (!next || typeof next !== 'object') return prev;
  const output = { ...prev };
  Object.keys(next).forEach((key) => {
    if (Array.isArray(prev[key]) || Array.isArray(next[key])) {
      output[key] = mergeArrays(prev[key], next[key]);
    } else if (typeof prev[key] === 'object' && typeof next[key] === 'object') {
      output[key] = mergeObjects(prev[key], next[key]);
    } else {
      output[key] = next[key];
    }
  });
  return output;
};

const estimateBytes = (value) => {
  if (typeof value !== 'string') return 0;
  if (typeof TextEncoder !== 'undefined') {
    try {
      return new TextEncoder().encode(value).length;
    } catch {}
  }
  return value.length * 2;
};

const FEATURE_MAP = [
  {
    key: 'watchProgress',
    label: '观看进度',
    keys: [STORAGE_KEYS.watchProgress],
    getCount: () =>
      Object.keys(readKey(STORAGE_KEYS.watchProgress, { items: {} }).items || {}).length,
    emptyHint: '在详情页调整进度后会自动保存。',
  },
  {
    key: 'continueWatching',
    label: '继续观看',
    keys: [STORAGE_KEYS.watchProgress],
    getCount: () =>
      Object.keys(readKey(STORAGE_KEYS.watchProgress, { items: {} }).items || {}).length,
    emptyHint: '有进度记录时会自动出现。',
  },
  {
    key: 'favorites',
    label: '收藏体系',
    keys: [STORAGE_KEYS.favorites, STORAGE_KEYS.favoritesUpdatedAt],
    getCount: () => readKey(STORAGE_KEYS.favorites, []).length,
    emptyHint: '点作品卡片上的收藏按钮即可加入。',
  },
  {
    key: 'following',
    label: '追更中心',
    keys: [STORAGE_KEYS.following],
    getCount: () => Object.keys(readKey(STORAGE_KEYS.following, { items: {} }).items || {}).length,
    emptyHint: '在作品卡片/详情页点“追更”即可加入。',
  },
  {
    key: 'favoriteGroups',
    label: '收藏分组',
    keys: [STORAGE_KEYS.favoriteGroups],
    getCount: () => readKey(STORAGE_KEYS.favoriteGroups, []).length,
    emptyHint: '创建分组后可在收藏页管理。',
  },
  {
    key: 'searchHistory',
    label: '搜索历史',
    keys: [STORAGE_KEYS.searchHistory],
    getCount: () => readKey(STORAGE_KEYS.searchHistory, []).length,
    emptyHint: '完成一次搜索即可记录。',
  },
  {
    key: 'searchCache',
    label: '搜索缓存',
    keys: [STORAGE_KEYS.searchCache],
    getCount: () => Object.keys(readKey(STORAGE_KEYS.searchCache, {})).length,
    emptyHint: '搜索过的关键词会自动缓存结果。',
  },
  {
    key: 'recommendations',
    label: '推荐偏好',
    keys: [STORAGE_KEYS.recommendationsTab, STORAGE_KEYS.recommendationsActions],
    getCount: () => readKey(STORAGE_KEYS.recommendationsActions, []).length,
    emptyHint: '切换推荐标签会记录你的偏好。',
  },
  {
    key: 'rankings',
    label: '排行榜偏好',
    keys: [STORAGE_KEYS.rankingsSort, STORAGE_KEYS.rankingsActions],
    getCount: () => readKey(STORAGE_KEYS.rankingsActions, []).length,
    emptyHint: '切换评分/人气排序会记录。',
  },
  {
    key: 'news',
    label: '资讯记录',
    keys: [STORAGE_KEYS.newsHistory],
    getCount: () => readKey(STORAGE_KEYS.newsHistory, []).length,
    emptyHint: '阅读资讯会留下浏览记录。',
  },
  {
    key: 'userProfile',
    label: '用户中心',
    keys: [STORAGE_KEYS.userProfile],
    getCount: () => (readKey(STORAGE_KEYS.userProfile, null) ? 1 : 0),
    emptyHint: '在用户中心保存昵称与签名。',
  },
  {
    key: 'sharePoster',
    label: '分享海报',
    keys: [STORAGE_KEYS.sharePoster],
    getCount: () => readKey(STORAGE_KEYS.sharePoster, []).length,
    emptyHint: '详情页可生成分享海报。',
  },
  {
    key: 'theme',
    label: '主题切换',
    keys: [STORAGE_KEYS.theme, STORAGE_KEYS.themeMeta],
    getCount: () => (safeLocalStorageGet(STORAGE_KEYS.theme) ? 1 : 0),
    emptyHint: '切换深浅主题即可记录。',
  },
  {
    key: 'visualSettings',
    label: '视觉设置',
    keys: [STORAGE_KEYS.visualSettings],
    getCount: () => (safeLocalStorageGet(STORAGE_KEYS.visualSettings) ? 1 : 0),
    emptyHint: '在用户中心调节视觉设置后会自动保存。',
  },
  {
    key: 'shortcuts',
    label: '快捷键',
    keys: [STORAGE_KEYS.shortcuts],
    getCount: () => (safeLocalStorageGet(STORAGE_KEYS.shortcuts) ? 1 : 0),
    emptyHint: '在用户中心打开快捷键偏好。',
  },
  {
    key: 'proMembership',
    label: 'PRO 会员',
    keys: [STORAGE_KEYS.proMembership],
    getCount: () => (safeLocalStorageGet(STORAGE_KEYS.proMembership) ? 1 : 0),
    emptyHint: '在会员页开启 PRO（本地演示）。',
  },
  {
    key: 'recentlyViewed',
    label: '最近浏览',
    keys: [STORAGE_KEYS.recentlyViewed],
    getCount: () => readKey(STORAGE_KEYS.recentlyViewed, []).length,
    emptyHint: '打开作品详情后会自动记录。',
  },
  {
    key: 'tagCategory',
    label: '标签/分类',
    keys: [STORAGE_KEYS.tagSort, STORAGE_KEYS.categorySort],
    getCount: () =>
      [
        safeLocalStorageGet(STORAGE_KEYS.tagSort),
        safeLocalStorageGet(STORAGE_KEYS.categorySort),
      ].filter(Boolean).length,
    emptyHint: '切换标签/分类排序即可记录。',
  },
  {
    key: 'comments',
    label: '评论',
    keys: [STORAGE_KEYS.comments],
    getCount: () => Object.keys(readKey(STORAGE_KEYS.comments, {})).length,
    emptyHint: '在详情页发布评论即可保存。',
  },
  {
    key: 'notifications',
    label: '消息通知',
    keys: [STORAGE_KEYS.notifications],
    getCount: () => readKey(STORAGE_KEYS.notifications, []).length,
    emptyHint: '可在用户中心创建通知。',
  },
  {
    key: 'sync',
    label: '多端同步',
    keys: [STORAGE_KEYS.syncProfile],
    getCount: () => (readKey(STORAGE_KEYS.syncProfile, null) ? 1 : 0),
    emptyHint: '填写同步 Token 以开启。',
  },
  {
    key: 'play',
    label: '播放入口',
    keys: [STORAGE_KEYS.playHistory],
    getCount: () => readKey(STORAGE_KEYS.playHistory, []).length,
    emptyHint: '点击“立即观看”会留下记录。',
  },
  {
    key: 'download',
    label: '下载入口',
    keys: [STORAGE_KEYS.downloadHistory],
    getCount: () => readKey(STORAGE_KEYS.downloadHistory, []).length,
    emptyHint: '点击“下载”会留下记录。',
  },
  {
    key: 'feedback',
    label: '反馈入口',
    keys: [STORAGE_KEYS.feedback],
    getCount: () => readKey(STORAGE_KEYS.feedback, []).length,
    emptyHint: '提交反馈后会自动保存。',
  },
];

export const getFeatureSummaries = () =>
  FEATURE_MAP.map((feature) => ({
    key: feature.key,
    label: feature.label,
    count: feature.getCount(),
    bytes: feature.keys.reduce(
      (sum, key) => sum + estimateBytes(safeLocalStorageGet(key) || ''),
      0,
    ),
    emptyHint: feature.emptyHint,
  }));

export const exportFeatureData = (featureKey) => {
  const feature = FEATURE_MAP.find((item) => item.key === featureKey);
  if (!feature) throw new Error('未知的数据模块');

  const payload = feature.keys.reduce((acc, key) => {
    acc[key] = safeLocalStorageGet(key);
    return acc;
  }, {});

  return JSON.stringify({
    schemaVersion: 1,
    feature: feature.key,
    exportedAt: new Date().toISOString(),
    payload,
  });
};

export const importFeatureData = (featureKey, jsonText, { mode = 'merge' } = {}) => {
  const feature = FEATURE_MAP.find((item) => item.key === featureKey);
  if (!feature) throw new Error('未知的数据模块');

  const parsed = safeJsonParse(jsonText, null);
  if (!parsed || typeof parsed !== 'object') throw new Error('导入数据格式错误');

  const payload = parsed.payload || {};
  const summary = { before: {}, after: {}, feature: feature.key };

  feature.keys.forEach((key) => {
    const currentRaw = safeLocalStorageGet(key);
    const current = safeJsonParse(currentRaw, currentRaw);
    const incomingRaw = payload[key];
    const incoming = safeJsonParse(incomingRaw, incomingRaw);

    summary.before[key] = current;

    if (mode === 'replace') {
      scheduleStorageWrite(key, incomingRaw ?? null);
      summary.after[key] = incoming;
      return;
    }

    if (Array.isArray(current) || Array.isArray(incoming)) {
      const merged = mergeArrays(current, incoming);
      scheduleStorageWrite(key, JSON.stringify(merged));
      summary.after[key] = merged;
      return;
    }

    if ((current && typeof current === 'object') || (incoming && typeof incoming === 'object')) {
      const merged = mergeObjects(current || {}, incoming || {});
      scheduleStorageWrite(key, JSON.stringify(merged));
      summary.after[key] = merged;
      return;
    }

    scheduleStorageWrite(key, incomingRaw ?? currentRaw ?? null);
    summary.after[key] = incoming ?? current;
  });

  return summary;
};

export const exportAllData = () => {
  const payload = FEATURE_MAP.flatMap((feature) => feature.keys).reduce((acc, key) => {
    acc[key] = safeLocalStorageGet(key);
    return acc;
  }, {});

  return JSON.stringify({
    schemaVersion: 1,
    feature: 'all',
    exportedAt: new Date().toISOString(),
    payload,
  });
};

export const importAllData = (jsonText, { mode = 'merge' } = {}) => {
  const parsed = safeJsonParse(jsonText, null);
  if (!parsed || typeof parsed !== 'object') throw new Error('导入数据格式错误');
  const payload = parsed.payload || {};

  const keys = Object.keys(payload);
  keys.forEach((key) => {
    const currentRaw = safeLocalStorageGet(key);
    const current = safeJsonParse(currentRaw, currentRaw);
    const incomingRaw = payload[key];
    const incoming = safeJsonParse(incomingRaw, incomingRaw);

    if (mode === 'replace') {
      scheduleStorageWrite(key, incomingRaw ?? null);
      return;
    }

    if (Array.isArray(current) || Array.isArray(incoming)) {
      const merged = mergeArrays(current, incoming);
      scheduleStorageWrite(key, JSON.stringify(merged));
      return;
    }

    if ((current && typeof current === 'object') || (incoming && typeof incoming === 'object')) {
      const merged = mergeObjects(current || {}, incoming || {});
      scheduleStorageWrite(key, JSON.stringify(merged));
      return;
    }

    scheduleStorageWrite(key, incomingRaw ?? currentRaw ?? null);
  });

  return { importedKeys: keys.length };
};

export const FEATURE_KEYS = FEATURE_MAP.map((feature) => feature.key);

export const clearFeatureData = (featureKey) => {
  const feature = FEATURE_MAP.find((item) => item.key === featureKey);
  if (!feature) throw new Error('未知的数据模块');

  feature.keys.forEach((key) => scheduleStorageWrite(key, null));
  return { clearedKeys: feature.keys.length, feature: feature.key };
};

export const clearAllData = () => {
  const keys = Array.from(new Set(FEATURE_MAP.flatMap((feature) => feature.keys)));
  keys.forEach((key) => scheduleStorageWrite(key, null));
  return { clearedKeys: keys.length };
};
