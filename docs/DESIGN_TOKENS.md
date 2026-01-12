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
- `--secondary-color / --secondary-rgb`：副色（偏青）
- `--accent-color / --accent-rgb`：点缀色（偏绿）
- `--accent-soft`：点缀色柔和态（用于渐变/装饰光晕）
- `--text-primary / --text-secondary / --text-tertiary`：文本层级
- `--text-on-primary`：主色按钮反白文字
- `--text-on-dark`：深色遮罩上文本（海报/进度条）
- `--success-* / --info-* / --warning-*`：状态色（用于 Toast/表单提示）

### 2.2 字体与排版

- `--font-body`：正文字体（Noto Sans SC）
- `--font-display`：标题字体（ZCOOL XiaoWei / Noto Serif SC）
- `--text-xxs ~ --text-10xl`：统一字号体系（组件/页面一致）
- `--leading-tight / snug / snug-plus / normal / loose / relaxed`：统一行高体系

### 2.3 间距尺度（Spacing）

- `--spacing-xs / sm / md / lg / xl / 2xl / 3xl`：主尺度
- `--spacing-xs-plus / xs-wide / sm-compact / sm-mid / sm-wide / sm-plus / md-compact / md-tight / md-plus / lg-compact`：微调尺度

### 2.4 表面与边框（避免“死白/死黑”）

- `--surface-glass`：玻璃卡片底色（含纸张纹理渐变）
- `--surface-ink / --surface-paper`：深浅层级底色（含纸张纹理渐变）
- `--border-subtle`：微边框
- `--surface-soft / --surface-soft-hover`：轻按钮/轻底色（Hover 状态）
- `--primary-soft / --primary-soft-hover / --primary-soft-border`：主色柔和态（用于 CTA/强调按钮）
- `--control-bg / --control-bg-hover / --control-border`：控件底色与边框（搜索/主题切换等）
- `--button-disabled-bg / --button-disabled-text`：禁用按钮背景/文字

### 2.5 Chip / Badge（筛选、标签、徽章）

- `--chip-bg / --chip-bg-hover`：Chip 背景
- `--chip-border / --chip-border-hover`：Chip 边框
- `--chip-bg-active / --chip-border-active`：Chip 选中态
- `--badge-bg / --badge-border`：Badge 背景与边框

### 2.6 视觉特效

- `--app-bg`：全局墨韵 + Aurora 背景
- `--aurora-opacity / --aurora-opacity-multiplier`：极光叠层强度（支持与 `data-low-data` 叠乘降载）
- `--hero-overlay`：英雄区遮罩渐变
- `--overlay-soft`：轻遮罩（浅层浮层/轻提示/次级遮罩）
- `--overlay-medium`：中遮罩（弹窗/庆祝层/半透明背板）
- `--overlay-strong`：图片/卡片上文字的对比遮罩
- `--progress-track / --progress-fill`：进度条轨道/填充
- `--stamp-*`：徽章/题签（Banner/页头 badge）
- `--divider-gradient`：分割线渐变（用于标题下划线）
- `--scrollbar-*`：滚动条轨道/滑块
- `--text-glow-primary`：主色文字光晕
- `--text-shadow-hero / --text-shadow-hero-soft`：英雄区标题阴影
- `--shadow-primary / --shadow-primary-hover / --shadow-primary-soft`：主色阴影体系
- `--shadow-ring`：强调环形阴影（徽标/状态点）
- `--paper-noise-opacity / --paper-noise-multiplier`：纸纹噪点强度（支持与 `data-low-data` 叠乘降载）
- `--font-scale`：全站字号缩放（配合 `--base-font-size`）

### 2.7 圆角与形状

- `--border-radius-sm / --border-radius-md / --border-radius-lg`：统一的圆角层级
- `--border-radius-pill`：胶囊按钮/标签的满圆角

### 2.8 品牌色（社交登录）

- `--brand-google-blue / --brand-google-green / --brand-google-yellow / --brand-google-red`
- `--brand-facebook-blue / --brand-twitter-blue`

### 2.9 动效与交互

- `--motion-fast / --motion-base / --motion-slow`：动效时长分级
- `--ease-out / --ease-soft`：动效缓动曲线
- `--stagger-step`：分层入场交错间隔
- `--theme-transition`：主题切换的统一过渡策略
- `--divider-inline-gap`：行内分割间距（可按组件覆盖）

## 3. 使用建议（团队约定）

- 组件里出现 `rgba(255,255,255,...)` / `rgba(0,0,0,...)` 时，优先考虑是否可以替换为 token
- “筛选/切换”类组件优先用 Chip/Badge tokens（保持一致）
- 不要只改背景不改文字：遇到可读性问题优先回到 token 层解决

## 4. 视觉设置（Visual Settings）

项目在“固定设计 tokens”之外，额外提供用户可调的视觉设置（入口：用户中心）。

- 存储位置：`localStorage` → `guoman.visual.settings.v1`
- 作用方式：写入 `documentElement` 的 CSS Variables / dataset
- 关键 dataset：
  - `data-no-blur="true"`：全站禁用 `backdrop-filter`（更省、更兼容弱设备）
  - `data-reduced-motion="true"`：强制低动效（配合 Framer Motion reducedMotion）
