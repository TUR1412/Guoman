import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

const createMemoryStorage = () => {
  const store = new Map();

  return {
    getItem: (key) => (store.has(String(key)) ? store.get(String(key)) : null),
    setItem: (key, value) => {
      store.set(String(key), String(value));
    },
    removeItem: (key) => {
      store.delete(String(key));
    },
    clear: () => {
      store.clear();
    },
    key: (index) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
};

// Node.js v25+ 可能存在实验性的 globalThis.localStorage，但在测试环境中并不可靠。
// 统一覆盖为内存实现，避免环境差异导致的 flaky 测试。
globalThis.localStorage = createMemoryStorage();
globalThis.sessionStorage = createMemoryStorage();

afterEach(() => {
  cleanup();
});

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}
