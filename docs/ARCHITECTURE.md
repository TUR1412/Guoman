# 架构说明（Architecture）

这份文档用来解释本项目“为什么这样设计”，方便后续扩展与协作。

---

## 1. 技术栈

- **React 18**：组件与状态
- **Vite 6**：开发与构建
- **React Router（Hash Router）**：路由（适配 GitHub Pages）
- **styled-components**：样式（配合全局 Design Tokens）
- **framer-motion**：动效（含页面切换动效）
- **ESLint + Prettier**：代码质量与风格（CI 闸门）
- **Vitest + Testing Library**：单元测试基线（CI 闸门）

---

## 2. 路由策略

入口路由在 `src/App.jsx`，采用：

- 路由级 **lazy + Suspense**：减小首包体积，避免“单包过大”的构建警告
- `AnimatePresence`：页面切换具有轻量过渡（不影响首帧可见性）

---

## 3. 视觉体系（Design Tokens）

`src/assets/styles/global.css` 定义了主题变量与基础组件规范：

- `:root[data-theme='dark'|'light']`：主题原子性（背景/文本/边框/卡片统一切换）
- 墨韵 + Aurora 渐变背景 + Noise 纹理：拒绝纯色死白/死黑
- `prefers-reduced-motion`：动效降级护栏
- 字体体系：`Noto Sans SC`（正文）+ `ZCOOL XiaoWei/Noto Serif SC`（标题）
- 视觉设置：通过 `CSS Variables + dataset` 提供用户可调参能力（噪点/极光/字号/blur/动效）

主题状态与首帧初始化：

- `index.html`：在 `<head>` 内联脚本提前写入 `data-theme`（减少闪烁）
- `src/utils/theme.js`：提供 `get/set/toggle` API，并同步 `theme-color`
- `src/utils/visualSettings.js`：提供 `init/get/set/apply`，将设置映射为 `--paper-noise-opacity`、`--aurora-opacity`、`--font-scale` 以及 `data-no-blur/data-reduced-motion`

---

## 4. 状态持久化

项目内置“对象恒常性”：

- 主题：`localStorage -> guoman.theme`
- 视觉设置：`localStorage -> guoman.visual.settings.v1`
- 收藏：`localStorage -> guoman.favorites.v1`
- 最近浏览：`localStorage -> guoman.recent.v1`
- 观看进度：`localStorage -> guoman.watchProgress.v1`
- 收藏备份：在收藏页提供导出/导入（JSON 文件，支持合并/覆盖）
- 部分筛选/排序：各页面/组件使用独立 key

对应实现：

- `src/components/FavoritesProvider.jsx`
- `src/utils/favoritesBackup.js`（备份格式与解析）
- `src/utils/download.js`（下载工具）
- `src/utils/theme.js`
- `src/utils/recentlyViewed.js`
- `src/utils/watchProgress.js`
- `src/components/ContinueWatching.jsx`

---

## 4.1 页面元信息（Meta）

- `src/utils/pageMeta.js`：统一更新 `document.title` 与 `meta[name="description"]`
- `PageShell` 与关键页面挂载该逻辑，保证 SPA 也有“像多页应用”的标题体验

---

## 5. 反馈与兜底

- **Toast**：关键交互给用户即时反馈（成功/提示/警告）
  - `src/components/ToastProvider.jsx`
- **Error Boundary**：避免白屏并提供可理解的错误页
  - `src/components/AppErrorBoundary.jsx`

---

## 6. 数据层

当前版本使用模拟数据（便于快速演示）：

- 作品数据：`src/data/animeData.js`
- 资讯数据：`src/data/newsData.js`

后续接入真实 API 时，建议：

- 统一 API 客户端（fetch/axios 二选一，避免混用）
- 引入请求层缓存与错误提示策略（Toast + EmptyState）
