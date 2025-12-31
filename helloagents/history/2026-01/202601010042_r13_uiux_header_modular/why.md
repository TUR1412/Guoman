# 变更提案: R13 UI/UX - Header 模块化与输入组件一致性

## 需求背景

- `src/components/Header.jsx` 体积过大（高耦合、难维护），修改风险高、回归成本高。
- 导航/搜索/动作按钮等交互在多个页面存在实现差异，视觉与交互一致性不足。
- 项目已具备 UI primitives（如 `Button` / `IconButton` / `Card` / `Dialog` 等），但落地仍不均衡，需要继续推进设计系统化。

## 变更内容

1. **Header 模块化重构**：将 `Header` 拆分为可复用的子组件与样式模块，降低单文件复杂度。
2. **输入组件统一**：补齐并推广 `TextField`（含图标/状态/无障碍与一致的 focus 样式），逐步替换散落的输入实现。
3. **A11y 与键盘体验加强**：保持并强化命令面板、移动端菜单等核心路径的可访问性与可操作性。

## 影响范围

- **模块:**
  - 顶部导航（Header）
  - 搜索输入（Header / 搜索页）
  - UI primitives（Design System）
- **文件:**
  - `src/components/Header.jsx`（对外 API 保持不变）
  - `src/components/header/*`（新增：模块化实现）
  - `src/ui/TextField.jsx`（新增）
  - `src/ui/TextField.stories.jsx`（新增）
  - `src/ui/index.js`（导出新增 primitives）

## 核心场景

### 需求: 顶部导航稳定与可演进

**模块:** Header

#### 场景: 用户在任意页面进行导航与快速操作

- 预期结果: Header 展示稳定，移动端/桌面端交互一致，视觉符合设计 tokens。

### 需求: 搜索输入一致性

**模块:** UI primitives / Search

#### 场景: 用户在 Header 或搜索页输入关键词

- 预期结果: 输入框样式、焦点可见性、禁用/错误态表现一致。

### 需求: 命令面板快捷入口不回归

**模块:** Header / CommandPalette

#### 场景: 用户点击“打开命令面板”并使用 Esc 关闭

- 预期结果: 行为与可访问性标签保持一致，既有测试继续通过。

## 风险评估

- **风险:** Header 拆分可能引入交互回归（快捷键、路由高亮、移动端菜单状态）。
  - **缓解:** 保持对外组件 API 不变；补齐关键行为测试；迭代中每步跑 `npm run check`。
- **风险:** 引入 `TextField` 后样式/布局细节可能影响既有页面响应式。
  - **缓解:** 以渐进迁移为主；先覆盖 Header/搜索页关键输入；保留现有 tokens 与 CSS 变量。
