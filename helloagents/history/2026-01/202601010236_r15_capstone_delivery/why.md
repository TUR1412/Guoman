# 变更提案: R15 封顶交付（表单体系收敛 + 依赖升级）

## 需求背景

当前项目已完成 `TextField` / `Button` 等 UI 原语收敛，但仍存在少量页面与分区使用：

- 内联样式 `input/textarea/button`
- 页面级 `styled.select` / `styled.textarea` / `styled.input[type="range"]`

这会导致：

1. **交互分叉**：focus ring / hover/press / disabled 状态在不同表单控件上不一致。
2. **可访问性缺口**：部分输入缺少明确 label 与 aria 语义（仅 placeholder）。
3. **维护成本上升**：同类控件的样式与行为散落在页面内，难以集中演进。

同时，核心依赖（React/Vite/Router/Motion/Vitest/Storybook 等）存在明显代际差，升级到最新稳定版将获得：

- 更好的性能与构建能力
- 更完整的生态工具链兼容
- 更低的安全与维护风险（长期）

## 变更内容

1. **UI 表单体系补全**：在 `src/ui/` 增加缺失的表单 primitives（Select / TextArea / Range）。
2. **全站迁移收敛**：将仍在使用内联样式或页面级表单控件的区域迁移到 primitives。
3. **依赖升级（稳定版）**：升级关键框架与工具链到最新稳定版，并修复由此引发的兼容问题。
4. **文档同步**：更新知识库与 README 中的技术栈版本与约定，确保 SSOT 与代码一致。

## 影响范围

- **模块:**
  - UI Components（`src/ui/`）
  - Pages（`src/pages/*`）
  - Anime Detail（`src/components/anime/detail/*`）
  - Build & Tooling（`package.json` / `vite.config.js` / `vitest.config.js` / `.storybook/*`）
  - Knowledge Base（`helloagents/*`）
- **文件:** 见 task.md 分任务列举
- **API:** 无对外 API 变更（纯前端站点）
- **数据:** 无数据模型变更（local-first 存储结构保持不变）

## 核心场景

### 需求: 表单交互一致性（封顶）

**模块:** UI Components / Pages

将站内所有用户可编辑输入（文本、选择、长文本、滑条）统一到同一套 primitives，确保：

- focus-visible 一致
- disabled/invalid 一致
- label/aria 语义一致

#### 场景: 用户提交反馈（静态页/用户中心）

用户在反馈页填写联系方式与反馈内容并提交。

- 输入组件外观与交互一致（与 Search/Header 等一致）
- 键盘导航可用（Tab 顺序、focus ring 清晰）
- 提交与清空按钮的交互一致

#### 场景: 用户使用筛选器（搜索/追更/收藏）

用户在筛选器中切换下拉选项并立即看到结果刷新。

- Select 与 TextField 的视觉与交互一致
- 无障碍：label 或 aria-label 完整

### 需求: 技术栈升级到最新稳定版

**模块:** Build & Tooling

升级 React/Vite/Router/Motion/Vitest/Storybook 等依赖到最新稳定版本，并保持：

- `npm run check` 全绿
- bundle budget 不退化（以现有闸门为准）
- Storybook 可正常运行/构建

## 风险评估

- **风险:** 大版本升级引入 breaking changes（Router/Vite/Storybook/Vitest/React）。
  - **缓解:** 分批升级 → 每批执行 `npm run check` 与 Storybook build；必要时做兼容层或最小代码调整。
- **风险:** 表单控件迁移引发 UI 细节回归。
  - **缓解:** 对照现有 tokens（`global.css`）统一 focus/hover；增加 Storybook stories 作为可视化回归入口。
