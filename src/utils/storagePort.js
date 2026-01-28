import { safeLocalStorageGet } from './storage';
import {
  getPendingStorageWriteValue,
  hasPendingStorageWrite,
  scheduleStorageWrite,
} from './storageQueue';

// Storage Port：未来如果要切换到 IndexedDB / Worker，只需要收敛修改这里的实现即可。
// 目前仍然以 localStorage 为主，并复用 storageQueue 做同 tab 广播与批量写入。

export const readStorageRaw = (key) =>
  hasPendingStorageWrite(key) ? getPendingStorageWriteValue(key) : safeLocalStorageGet(key);

export const writeStorageRaw = (key, value) => {
  if (!key) return;
  scheduleStorageWrite(key, value ?? null);
};

export const removeStorageRaw = (key) => writeStorageRaw(key, null);
