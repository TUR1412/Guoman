# 技术设计: Quark R11 · 深度递归进化（视觉系统 + 质量门禁）

## 技术方案

### 核心技术

- React + Vite（静态站点）
- styled-components（组件样式与可复用 UI）
- framer-motion（动效与微交互）
- react-router-dom（路由与页面组织）
- Vitest + Testing Library（测试与质量门禁）
- Storybook（组件开发/展示/回归基线）

### 实现要点

- **质量门禁优先**：把覆盖率阈值作为“硬门槛”，补齐测试缺口，保证后续视觉与架构重构不被回归风险拖累。
- **Tokens 作为 SSOT**：以现有 CSS 变量 tokens 为基础，建立组件层的“tokens 读取/映射”策略（避免散落的硬编码色值/间距）。
- **组件 API 语义化**：为基础组件提供稳定的变体与状态（variant/intent/size/state），减少业务页面自定义样式分叉。
- **渐进式拆分大组件**：以“行为不变 + 先拆结构再拆逻辑”为原则，对超大组件做分层拆分（View/Controller/Utils）。
- **依赖升级分批**：建立 upgrade matrix，按“低风险→高收益→高风险”排序迭代，保证每批次可回滚。

## 架构设计

本轮为“增量演进”，不引入新的框架范式，仅强化现有模块边界与复用层。

```mermaid
flowchart TD
  App[App / Router] --> Pages[pages/*]
  Pages --> Components[components/*]
  Components --> UI[ui/* 组件库]
  Components --> Utils[utils/* 业务与基础工具]
  UI --> Tokens[Design Tokens (CSS vars + mapping)]
  Pages --> Data[data/*]
  App --> Motion[motion/* 动效预设]
  UI --> Motion
```

## 架构决策 ADR

### ADR-001: 依赖升级采用“分批升级”而非“一次性升级”

**上下文:** 多个核心依赖存在大版本跃迁窗口；一次性升级会把路由/构建/动效/组件生态的风险叠加，导致定位困难与回滚成本高。

**决策:** 采用“分批升级”，每批次只升级一类依赖并设置明确门禁（lint/test/build/budget/coverage/storybook build）。

**理由:** 风险隔离、可追溯、可回滚；同时更适合持续迭代的前端工程实践。

**替代方案:** 一次性升级（React 19 + Router 7 + Vite 7 + Storybook 10 + framer-motion 12）
→ 拒绝原因: 风险叠加过高、回归定位困难、可能引入不可控 breaking changes。

**影响:** 需要在 task.md 中拆分多个批次任务，并在每批次后跑全量门禁验证。

### ADR-002: Tokens 的 SSOT 以 CSS 变量为主，组件侧做映射与约束

**上下文:** 项目已有完整的 CSS tokens（含 glass / spacing / typography / motion 等），但组件层可能存在重复定义与“临时值”。

**决策:** 以 CSS variables 为 SSOT；在 `src/ui/` 增加轻量映射层，统一读写入口，组件只通过 tokens/映射使用颜色/间距/阴影等关键视觉要素。

**理由:** 与现有实现最兼容；无需引入新主题系统；支持运行时主题切换与用户视觉设置。

**替代方案:** JS tokens 作为 SSOT（完全由 styled-components ThemeProvider 驱动）
→ 拒绝原因: 与现有全局 CSS tokens 重叠，迁移成本高且容易造成双源不一致。

**影响:** 需要补齐组件层 tokens 使用规范与 lint/测试保障，避免回退到硬编码。

## 安全与性能

- **安全:** 保持零 `dangerouslySetInnerHTML`；外部输入统一走过滤/白名单；本地存储读写具备版本与容错。
- **性能:** 继续遵守 bundle budget；大组件拆分时避免不必要的重新渲染；动效在 reduced-motion 下自动降级。

## 测试与部署

- **测试:**
  - 覆盖率门禁：补齐缺口，确保 `npm run test:coverage` 通过
  - 关键交互：对核心组件状态、错误边界、网络状态等补齐测试
  - Storybook：作为视觉回归基线（build 通过，必要时补充 stories）
- **部署:** 维持 GitHub Pages 静态部署链路不变；所有变更必须保证 `npm run build` 可产出 `dist/` 且路由回退 `404.html` 仍生效
