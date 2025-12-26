# 技术设计: 无限进化协议（视觉系统收敛 + 交互性能进化）

## 技术方案

### 核心技术

- React 18 + Vite 6
- styled-components（组件层结构与差异化样式）
- CSS Variables Design Tokens（`src/assets/styles/global.css`）
- Framer Motion（动效与转场）
- VirtualizedGrid（长列表窗口化渲染）

### 实现要点

#### 1) data-card 作为唯一“玻璃基座”

- 全局 `global.css` 中的 `[data-card][data-card]` 继续作为玻璃/渐变边框/hover 动效的唯一基座。
- 组件层不再重复声明 `background/border/box-shadow/backdrop-filter`，避免风格漂移与 tokens 失效。

#### 1.5) Hover/Press 使用 translate/scale（避免 transform 覆盖）

- 将 `data-card` / `data-pressable` 的悬停位移从 `transform` 收敛为 CSS Transform Level 2 的 `translate`（按 `@supports` 提供回退）。
- 好处：与 Framer Motion 的 `transform`（入场/缩放）以及布局型 `transform: translateX(...)`（居中等）可安全叠加，避免 hover 时覆盖导致的跳位。

#### 2) data-elev（阴影层级入口）

- 在 `:root` 已存在 `--shadow-elev-0..12` 的前提下，引入 `data-elev="0..12"`。
- 实现策略：以 CSS 变量 `--card-shadow` 作为中介。
  - `[data-card]` 使用 `box-shadow: var(--card-shadow, var(--shadow-md))`
  - `[data-elev="N"]` 设置 `--card-shadow: var(--shadow-elev-N)`
- 好处：避免选择器 specificity 竞争，且不要求业务组件显式写阴影值。

#### 3) 12 栅格响应式跨度（data-col-span-md/sm）

- 在现有 `data-grid="12"` / `data-col-span` 基础上，补齐响应式属性：
  - `data-col-span-md="1..12"`（<= 768px）
  - `data-col-span-sm="1..12"`（<= 576px）
  - 可选：`data-col-start-md/sm`（同断点）
- 目标：减少组件层媒体查询重复，让布局收敛到“声明式属性”。

#### 4) Tag/Category 页面虚拟滚动自动启用

- 复用现有 `VirtualizedGrid`（已针对卡片尺寸与 gap 做过估算）
- 规则：
  - `results.length > 24` → `VirtualizedGrid`
  - 否则使用常规 `AnimeGrid`
- 虚拟化模式下传入 `virtualized` 给 `AnimeCard`，确保禁用入场动效，减少 transform 合成竞争。

## 安全与性能

- **安全:** 本次变更不引入新依赖、不触及存储结构、不新增外部请求；仅调整样式收敛与页面渲染策略。
- **性能:** 虚拟滚动扩大覆盖面，减少一次性 DOM 数量；卡片基础样式下沉减少组件层重复 CSS 与不必要的视觉分歧计算。

## 测试与部署

- **测试:** 运行 `npm run test` 与 `npm run lint`（如仓库已安装依赖则直接运行，否则先 `npm ci`）
- **部署:** 保持现有 GitHub Pages 发布流程不变（hash router + static workflow）

## ADR（轻量）

### ADR-001: 以 data-attribute（data-\*）作为 Design System 的主入口

**上下文:** styled-components 与全局 CSS tokens 共存时，重复定义基础卡片样式会导致维护成本与风格漂移。
**决策:** 将玻璃基座与阴影层级入口统一收敛到 `data-card` / `data-elev`，组件层仅表达结构与差异化。
**替代方案:** 全量迁移到 Tailwind（或 CSS-in-JS 主题系统） → 拒绝原因: 成本高、收益不成比例、且现有 tokens 已足够表达设计语言。
**影响:** 视觉与交互一致性增强；未来新增卡片类组件可复用同一基座；需要少量组件样式回归检查。
