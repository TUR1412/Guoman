# How - UI Component Library（国漫视觉组件库）

## 方案概述

### 1) UI 原语分层（src/ui）

- `Container`：统一 max-width + 横向 padding（替代页面/组件内重复的 Inner 容器）。
- `Stack`：统一纵向/横向布局与 gap 语义，减少零散 flex 写法。
- `Grid` / `Col`：提供 12 列栅格容器与列跨度封装，便于在 JSX 中表达布局结构。
- `Card`：统一 `data-card` 容器基座（elev/divider/parallax），与 global.css 的 tokens/data 设计系统对齐。
- `Dialog`：提供通用弹层骨架（Backdrop + Panel），内置 close-on-esc、点击遮罩关闭、基础焦点恢复，并接入 `src/motion/presets.js`。
- `Skeleton`：提供骨架屏块级组件（对齐 `[data-skeleton]` 的全局样式与低动效策略）。

### 2) 站内落地（最小可用）

- 优先将 `CommandPalette`（Modal）接入 `Dialog` 原语，减少 modal/overlay 逻辑分叉。
- 将少量页面/组件的布局容器替换为 `Container` / `Stack` / `Grid`（控制改动面，保证稳定）。

### 3) Storybook 接入

- 添加 `.storybook/main.cjs` + `.storybook/preview.js`
- 在 preview 中引入 `src/assets/styles/global.css`，确保 tokens 与 data- 设计系统在故事中生效。
- 添加 `src/ui/*.stories.jsx`：覆盖 Card/Stack/Grid/Dialog/Skeleton/Toast demo。

## 风险与规避

- **风险：Storybook 在 `type: module` 项目中配置文件加载差异。**
  - 规避：使用 `.storybook/main.cjs`（CJS），避免 Node 侧 ESM 兼容问题。
- **风险：引入 Storybook 依赖导致包体/安装时间增大。**
  - 规避：Storybook 仅作为 dev tooling，不进入 `npm run check` 的必需链路。
- **风险：大规模重构组件导致回归面过大。**
  - 规避：原语先落地到少数关键点，逐步迁移。
