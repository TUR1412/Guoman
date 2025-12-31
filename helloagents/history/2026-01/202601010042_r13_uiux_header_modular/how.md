# 技术设计: R13 UI/UX - Header 模块化与输入组件一致性

## 技术方案

### 核心技术

- React 18 + Vite
- styled-components（现有样式体系）
- 既有 UI primitives（`src/ui/*`）

### 实现要点

- **渐进式重构：**
  - 保持 `src/components/Header.jsx` 作为对外入口（避免全站 import 路径改动）。
  - 新增 `src/components/header/` 目录承载拆分后的实现与样式组织。
- **输入组件统一：**
  - 新增 `src/ui/TextField.jsx`，使用现有 tokens（`--field-*` / `--control-*` / `--border-radius-*` / `--transition` 等）。
  - 支持图标、label（可选）、帮助文本（可选）、错误态（可选）、禁用态与可访问性属性。
  - Storybook 增加 `TextField.stories.jsx`，以便可视化回归。
- **无障碍与可操作性：**
  - 保留 `Header` 现有的 aria-label / role 语义。
  - 确保所有可点击元素具备 `:focus-visible` 清晰轮廓并可键盘触达。

## 架构决策 ADR

### ADR-013: Header 采用“薄入口 + 模块化目录”的渐进拆分

**上下文:** `Header.jsx` 体积过大且承担过多职责，直接大改会造成广泛回归风险。  
**决策:** 保留对外入口文件不变，在 `src/components/header/` 下按职责拆分实现。  
**替代方案:** 直接在原文件内重写（拒绝原因: 回归风险与可维护性差）。  
**影响:** 提升可维护性与可复用性，为后续继续拆分（SearchPage/AnimeDetail）提供可复制模式。

## 安全与性能

- **安全:** 本轮不引入新外部依赖；不处理敏感信息；输入仅作为本地 UI 状态与路由参数使用时需保持转义与边界处理（沿用现有实现）。
- **性能:** 通过拆分降低重复渲染风险；对频繁变化的状态保持局部化；避免在渲染路径中创建大对象/大数组。

## 测试与部署

- **测试:** 运行 `npm run check`（format/lint/test/build/budget）与 `npm audit`。
- **部署:** 无额外部署变更；保持现有 GitHub Pages/静态站构建流程。
