const resolveStorage = (kind) => {
  if (typeof window === 'undefined') return null;

  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

const safeGetItem = (kind, key) => {
  const storage = resolveStorage(kind);
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (kind, key, value) => {
  const storage = resolveStorage(kind);
  if (!storage) return false;

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const safeRemoveItem = (kind, key) => {
  const storage = resolveStorage(kind);
  if (!storage) return false;

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const safeLocalStorageGet = (key) => safeGetItem('local', key);
export const safeLocalStorageSet = (key, value) => safeSetItem('local', key, value);
export const safeLocalStorageRemove = (key) => safeRemoveItem('local', key);

export const safeSessionStorageGet = (key) => safeGetItem('session', key);
export const safeSessionStorageSet = (key, value) => safeSetItem('session', key, value);
export const safeSessionStorageRemove = (key) => safeRemoveItem('session', key);
