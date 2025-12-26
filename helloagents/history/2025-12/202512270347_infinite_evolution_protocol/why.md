# 变更提案: 无限进化协议（视觉系统收敛 + 交互性能进化）

## 需求背景

当前项目已具备较完整的 Design Tokens、玻璃拟态（`data-card`）与动效体系（Framer Motion），并在搜索页实现了筛选引擎与虚拟滚动。但在组件层仍存在以下问题：

1. **视觉系统重复实现**：部分 `data-card` 容器在组件内重复定义 `background/border/box-shadow/backdrop-filter` 等基础玻璃样式，导致维护成本上升、细节不一致、tokens 无法统一驱动。
2. **栅格与阴影“可用但不够可控”**：全局已定义 12 栅格与 0-12 阴影变量，但缺少“面向组件”更易用的统一入口（例如通过 `data-elev` 显式指定层级、通过响应式 `data-col-span-*` 控制跨度）。
3. **长列表性能覆盖不完整**：`VirtualizedGrid` 已在 Search 页面启用，但 Tag/Category 等页面在数据量较大时仍可能一次性渲染大量卡片，影响滚动稳定性与交互帧率。

本变更将以“系统化收敛”为原则：优先复用现有能力，补齐缺口，并将基础能力下沉到全局视觉系统中，减少分散实现。

## 产品分析

### 目标用户与场景

- **用户群体:** 国漫内容浏览用户（移动端与桌面端均高频）
- **使用场景:** 快速浏览大量作品列表、按标签/分类探索、在弱网/省电设备上保持顺滑体验
- **核心痛点:** 大量卡片渲染导致掉帧；视觉一致性不足导致“高级感”被局部细节稀释

### 价值主张与成功指标

- **价值主张:** 统一视觉容器基座，让“玻璃/阴影/栅格/动效”可组合、可扩展、可持续演进
- **成功指标:**
  - 页面卡片容器基础样式零重复（尽量由 `data-card` 兜底）
  - Tag/Category 页在大数据量时自动启用虚拟滚动，滚动体验更稳定
  - 设计系统对开发者更“可用”（`data-elev`、响应式栅格跨度）

### 人文关怀

在保持“国漫艺术感”的同时，严格尊重 `prefers-reduced-motion` 与低数据/降载模式（`data-low-data`），避免动效与 blur 给敏感用户带来不适。

## 变更内容

1. **视觉系统收敛**：将卡片基础玻璃样式（blur/渐变边框/阴影基座）统一下沉到 `data-card`，组件层仅保留结构与差异化装饰。
2. **阴影层级入口**：新增 `data-elev="0..12"` 作为统一阴影层级控制入口（不再要求组件层硬写 `var(--shadow-*)`）。
3. **响应式栅格跨度**：补齐 `data-col-span-md` / `data-col-span-sm`（以及对应 start）等响应式控制能力，形成更完整的 12 栅格约束体系。
4. **长列表性能覆盖**：Tag/Category 页面在结果超过阈值时自动切换为 `VirtualizedGrid`，并在虚拟模式下降级卡片入场动效，确保滚动更稳。

## 影响范围

- **模块:**
  - Design System（`src/assets/styles/global.css`）
  - UI Components（多处 styled-components 卡片容器）
  - 列表页性能（Tag/Category）
  - 知识库（`helloagents/*`）
- **文件:**
  - `src/assets/styles/global.css`
  - `src/components/*`（若干）
  - `src/pages/*`（若干）
  - `helloagents/*`
- **API:** 无（纯前端静态数据与本地存储策略不变）
- **数据:** 无（localStorage 结构不变）

## 核心场景

### 需求: 视觉系统一致性

**模块:** Design System / UI Components

#### 场景: data-card 容器统一玻璃基座

当组件声明 `data-card` 时，应自动获得一致的：

- 毛玻璃 blur（可被 `data-low-data` / `data-no-blur` 降级）
- 动态渐变边框（hover 流光）
- 阴影基座（并支持 `data-elev` 覆盖）

#### 场景: 阴影层级可控

当组件声明 `data-elev="N"`（N=0..12）时，应得到对应层级的阴影基座，不需要在组件内部硬编码阴影。

#### 场景: 12 栅格响应式跨度

当栅格子项声明 `data-col-span-md` / `data-col-span-sm` 等属性时，能随断点自动调整跨度，减少组件层媒体查询重复。

### 需求: 长列表性能

**模块:** Pages / VirtualizedGrid

#### 场景: Tag/Category 大数据量自动虚拟滚动

当 Tag/Category 页面结果数超过阈值时：

- 自动使用 `VirtualizedGrid` 渲染窗口化列表
- 在虚拟化模式下禁用卡片入场动效，避免 transform/布局竞争造成掉帧

## 风险评估

- **风险:** CSS 收敛可能引发少量组件视觉差异（尤其是 hover/阴影细节）
  - **缓解:** 仅移除“重复的基础玻璃样式”，保留结构、padding、装饰层与业务态样式；并通过统一 tokens 控制 blur/阴影
- **风险:** Motion transform 与 CSS hover transform 叠加导致冲突
  - **缓解:** 交互位移优先使用 `translate/scale`（避免覆盖 `transform`）；虚拟化场景禁用入场动效；卡片基座尽量由 `data-card` 承担视觉，而非 transform 叠加
