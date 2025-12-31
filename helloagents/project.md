# 项目技术约定

## 技术栈

- **运行环境:** Node.js >= 18
- **前端框架:** React 18
- **构建工具:** Vite 6
- **路由:** React Router（Hash Router / `createHashRouter`，GitHub Pages 友好）
- **样式:** styled-components + CSS Variables Design Tokens（`global.css`）+ data-_ 设计系统（`data-card` / `data-grid` / `data-col-span_`/`data-elev`）
- **UI 原语:** `src/ui/`（Container / Stack / Grid / Card / Dialog / Skeleton / Toast / Button / IconButton / TextField / SelectField / TextAreaField / RangeInput）
- **动效:** Framer Motion + 动效中枢（`src/motion/`，尊重 `prefers-reduced-motion` 并支持站内“强制减少动效”）
- **组件工作台:** Storybook 8（React-Vite，`npm run storybook`）
- **PWA:** Web App Manifest + Service Worker（离线缓存/更新提示）
- **视觉设置:** `src/utils/visualSettings.js`（本地持久化 + 映射为 CSS Variables / dataset）

---

## 开发约定

- **代码规范:** ESLint + Prettier（以 `npm run check` 为质量闸门）
- **命名约定:**
  - React 组件：`PascalCase`（如 `NetworkStatusBanner.jsx`）
  - 工具函数：`camelCase`（如 `formatZhDateTime`）
  - 文件夹：`kebab-case` 或语义化分组（如 `src/components/icons/`）
- **交互位移规范:** 对 hover/press 的位移与缩放，优先使用 `translate` / `scale`（CSS Transform Level 2，提供 `@supports` 回退），避免覆盖 Framer Motion 的 `transform` 与布局型 `transform: translateX(...)`。
- **动效预设规范:** Route/Page/Modal/Toast 等动效优先复用 `src/motion/presets.js`；reduced motion 判定统一使用 `src/motion/useAppReducedMotion.js`。
- **依赖策略:** 优先剔除“仅提供展示层能力但可内置实现”的依赖；核心框架依赖保持稳定。

---

## 错误与日志

- **全局兜底:** `src/components/AppErrorBoundary.jsx`
- **错误采集:** `src/utils/errorReporter.js`（本地安全容错，避免阻塞）
- **行为埋点:** `src/utils/analytics.js`（本地记录为主，便于后续接入真实分析）
- **诊断面板:** `/diagnostics`（UI 可视化诊断 + 导出诊断包），控制台 API 见 `src/utils/healthConsole.js`

---

## 测试与流程

- **单测:** Vitest（`npm run test`）
- **质量闸门:** `npm run check`（Prettier → ESLint → Vitest → Build → Bundle Budget）
- **组件演示:** Storybook（`npm run storybook` / `npm run storybook:build`，dev tooling，不进入质量闸门）
- **部署:** GitHub Actions → GitHub Pages（见 `.github/workflows/static.yml`）
