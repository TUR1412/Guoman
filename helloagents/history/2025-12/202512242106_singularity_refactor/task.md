# 任务清单: 奇点重构（离线缓存 + Icons 内联化）

目录: `helloagents/history/2025-12/202512242106_singularity_refactor/`

---

## 1. Icons 熵减（移除 react-icons）

- [√] 1.1 新增 `src/components/icons/feather.jsx` 内置 Feather Icons
- [√] 1.2 替换 `src/` 内所有 `react-icons/fi` 引用为内置图标模块
- [√] 1.3 移除依赖 `react-icons` 并清理 `vite.config.js` 分包规则

## 2. PWA 离线缓存 + 更新提示

- [√] 2.1 新增 `public/sw.js`（离线缓存策略 + SKIP_WAITING）
- [√] 2.2 新增 `src/utils/serviceWorker.js`（注册/事件/更新激活）
- [√] 2.3 在 `src/index.jsx` 仅生产环境注册 Service Worker
- [√] 2.4 扩展 `src/components/NetworkStatusBanner.jsx`：新增“发现新版本”提示与更新按钮

## 3. 重复逻辑收敛（日期时间格式化）

- [√] 3.1 新增 `src/utils/datetime.js`：缓存 `Intl.DateTimeFormat`
- [√] 3.2 替换页面内重复的 `Intl.DateTimeFormat('zh-CN', ...)` 逻辑为统一工具函数

## 4. 文档同步

- [√] 4.1 更新 `README.md`：补充 PWA（离线缓存/更新提示）说明

## 5. 质量验证

- [√] 5.1 本地执行 `npm run check`（Prettier/ESLint/Vitest/Build）通过
