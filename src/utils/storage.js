export const safeLocalStorageGet = (key) => {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeLocalStorageSet = (key, value) => {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const safeLocalStorageRemove = (key) => {
  if (typeof window === 'undefined') return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const safeSessionStorageGet = (key) => {
  if (typeof window === 'undefined') return null;

  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSessionStorageSet = (key, value) => {
  if (typeof window === 'undefined') return false;

  try {
    window.sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const safeSessionStorageRemove = (key) => {
  if (typeof window === 'undefined') return false;

  try {
    window.sessionStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};
