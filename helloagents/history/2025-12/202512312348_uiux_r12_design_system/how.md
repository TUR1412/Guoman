# 实施方案: UI/UX R12 · 设计系统与交互一致性

## 总体策略

以 **Design Tokens（CSS Variables）** 为 SSOT，抽象出可复用的 UI primitives，并在不破坏现有功能的前提下逐步迁移高频组件，实现：

- 交互反馈一致（hover/active/focus/disabled）
- A11y 覆盖提升（focus-visible、语义元素优先）
- 维护成本下降（减少重复的 `styled.button` 与散落的交互细节）
- 构建输出可复现（SEO 生成稳定）

## 具体步骤

### 1) 基线与约束

- 保持 `npm run check` 全绿作为门禁
- 不引入新的重量级依赖（优先复用现有 `styled-components` 与 tokens）

### 2) 设计系统 primitives（新增）

- `src/ui/Button.jsx`
  - 支持变体（如 primary/secondary/ghost）、尺寸（sm/md/lg）、图标前后缀
  - 统一 disabled 与 focus-visible 样式，使用 tokens（如 `--control-*`、`--accent-*`）
- `src/ui/IconButton.jsx`（可选）
  - 用于 Header/工具栏等密集场景，统一 hit-area 与可点击反馈
- 更新 `src/ui/index.js` 导出

### 3) 关键组件迁移（少量、但高频）

- 优先迁移以下组件内的重复 button 定义：
  - `src/components/Banner.jsx`
  - `src/components/Login.jsx`
  - `src/components/NetworkStatusBanner.jsx`
  - （评估后可扩展）`src/components/Header.jsx`

### 4) 全局交互与 A11y 强化

- 在 `src/assets/styles/global.css` 增强 focus-ring tokens 与 `:focus-visible` 覆盖策略
- 保持 reduced motion 语义，避免引入强烈动效

### 5) SEO 生成稳定性修复

- 调整 `scripts/generate-seo.js`：
  - `lastmod` 使用可复现来源（优先取当前 git commit 时间；失败再 fallback）
  - URL 列表稳定排序
- 更新/补齐 `scripts/seo.test.js`（如有必要）

### 6) 验证与交付

- `npm run check`
- 更新 `helloagents/CHANGELOG.md`
- 更新 `helloagents/wiki/overview.md`（增加 UI primitives 与质量门禁说明）
- 迁移方案包至 `helloagents/history/2025-12/` 并更新 `helloagents/history/index.md`
