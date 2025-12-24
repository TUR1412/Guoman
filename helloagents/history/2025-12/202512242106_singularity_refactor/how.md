# 技术设计: 奇点重构（离线缓存 + Icons 内联化）

## 技术方案

### 核心技术

- React + Vite（现有架构不变）
- Service Worker（纯原生实现，无 Workbox 依赖）
- 内置 Feather Icons（替代 `react-icons`）

### 实现要点

- **Icons：** 用统一 `FeatherIcon` 作为 SVG 基座组件，导出 `Fi*` 图标组件；保持原调用方式（`<FiStar />`）不变，降低迁移风险。
- **SW 注册：** 在 `src/index.jsx` 中仅在 `import.meta.env.PROD` 注册 `sw.js`（避免 dev 环境干扰热更新）。
- **更新提示：**
  - `registerServiceWorker()` 在发现新版本（waiting）时通过 `CustomEvent('guoman:sw:update')` 通知 UI。
  - `NetworkStatusBanner` 监听事件并展示“更新”按钮，触发 `SKIP_WAITING`。
  - `controllerchange` 时自动刷新页面，确保资源一致。
- **缓存策略：**
  - navigation：`networkFirst`，离线回退 `index.html`
  - script/style/worker：`staleWhileRevalidate`
  - image/font：`cacheFirst`
  - 同源 GET 请求才进入缓存逻辑，避免跨域风险

## 安全与性能

- **安全:** Service Worker 仅缓存同源 GET 请求；对失败场景返回 503，避免异常挂起。
- **性能:** 缓存首屏壳与运行时静态资源，提高离线与弱网可用性；抽取日期 formatter 缓存降低运行时重复创建开销。

## 测试与部署

- **测试:** `npm run test`
- **质量闸门:** `npm run check`（format/lint/test/build）
- **部署:** 通过 GitHub Actions 自动部署到 GitHub Pages
