# 设计变量（Design Tokens）

本项目使用 CSS Variables 作为“单一真源”的设计变量层，目标是做到：

- 主题切换 **原子性**：背景/文字/边框/卡片同步切换
- 组件样式 **可复用**：避免在组件内散落 hardcode `rgba(...)`
- 视觉一致性 **可演进**：后续升级风格只需要改 token，不需要全仓替换

## 1. 主题入口

- 定义位置：`src/assets/styles/global.css`
- 生效方式：通过 `document.documentElement.dataset.theme = 'dark' | 'light'`
  - 首帧：`index.html` 的 head 内联脚本（减少闪烁）
  - 运行时：`src/utils/theme.js`

## 2. 核心 tokens

> 以下变量均在 `:root[data-theme='dark']` / `:root[data-theme='light']` 中定义。

### 2.1 颜色与对比

- `--primary-color`：主色
- `--primary-rgb`：主色 RGB（用于 `rgba(var(--primary-rgb), alpha)`）
- `--text-primary / --text-secondary / --text-tertiary`：文本层级

### 2.2 表面与边框（避免“死白/死黑”）

- `--surface-glass`：玻璃卡片底色
- `--border-subtle`：微边框
- `--surface-soft / --surface-soft-hover`：轻按钮/轻底色（Hover 状态）

### 2.3 Chip / Badge（筛选、标签、徽章）

- `--chip-bg / --chip-bg-hover`：Chip 背景
- `--chip-border / --chip-border-hover`：Chip 边框
- `--chip-bg-active / --chip-border-active`：Chip 选中态
- `--badge-bg / --badge-border`：Badge 背景与边框

## 3. 使用建议（团队约定）

- 组件里出现 `rgba(255,255,255,...)` / `rgba(0,0,0,...)` 时，优先考虑是否可以替换为 token
- “筛选/切换”类组件优先用 Chip/Badge tokens（保持一致）
- 不要只改背景不改文字：遇到可读性问题优先回到 token 层解决
