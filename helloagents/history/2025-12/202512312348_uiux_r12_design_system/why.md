# 变更提案: UI/UX R12 · 设计系统与交互一致性（Design System + A11y）

## 需求背景

当前项目已经具备较完整的设计变量体系（`docs/DESIGN_TOKENS.md` + `src/assets/styles/global.css`），但在组件层仍存在明显的“重复造轮子”和交互一致性问题：

1. **按钮/可点击控件样式分散**：大量页面/组件内各自声明 `styled.button`，容易出现不同的 hover/active/focus 反馈、禁用态、尺寸体系不一致，维护成本高。
2. **A11y 交互反馈不足**：虽然存在 `:focus-visible` 处理，但覆盖面有限，容易在键盘导航、可访问性审计中暴露一致性缺口。
3. **构建副作用噪声**：`prebuild` 生成 SEO 资源（sitemap 等）会造成工作区污染风险；应确保输出**可复现**，避免“跑一次 build 就出现 diff”的体验。

## 变更内容

1. 新增 UI 基础组件（Design System primitives），以**设计变量**为唯一视觉来源，统一交互、尺寸、禁用态与可访问性。
2. 将核心入口组件逐步迁移到新组件之上，减少重复样式与隐性分叉。
3. 提升全局 `focus-visible` 与交互反馈覆盖，确保键盘/触屏/鼠标都拥有一致且克制的反馈。
4. 固化 SEO 生成的可复现性（deterministic），避免无意义的提交噪声。

## 影响范围

- **模块:** `src/ui/*`、`src/components/*`、`src/pages/*`、`scripts/*`、`src/assets/styles/*`
- **文件:** 以新增 UI primitives + 少量高频组件改造为主；脚本层做一次稳定性修复
- **风险:** 视觉样式与交互行为可能发生细微变化（需严格通过 `npm run check` 回归）

## 核心场景

### 需求: 统一按钮与交互反馈

**模块:** UI组件库 / 全局样式

#### 场景: 用户在不同页面点击/键盘导航

- 按钮 hover/active/focus 的反馈一致
- 禁用态一致且可读
- 键盘焦点可见且不刺眼（符合设计变量、支持 reduced motion）

### 需求: 构建可复现（避免工作区污染）

**模块:** scripts/SEO

#### 场景: 本地或 CI 多次执行 build/check

- 不因“当天日期/随机顺序”等因素产生无意义 diff
- 生成结果稳定，便于审计与发布
