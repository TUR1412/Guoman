# 技术设计: R15 封顶交付（表单体系收敛 + 依赖升级）

## 技术方案

### 核心技术

- React + styled-components
- UI primitives：`src/ui/*`
- 构建：Vite
- 测试：Vitest + Testing Library
- 组件工作台：Storybook

### 实现要点

#### 1) 表单 primitives 设计

新增组件（与 `TextField` 同一设计语言）：

- `SelectField`：提供 label/helper/error，内部使用原生 `select`，统一 focus ring/disabled/invalid。
- `TextAreaField`：提供 label/helper/error，内部使用原生 `textarea`，统一 focus ring/disabled/invalid 与 resize 策略。
- `RangeInput`：统一 `input[type="range"]` 的基础外观与可用性（宽度、accent-color、cursor）。

约定：

- primitives **可无 label 使用**（仅 placeholder），但页面级业务表单应尽量提供 label（可用 `labelSrOnly` 收敛视觉）。
- 所有表单控件统一 `aria-describedby` 拼接策略，与 `TextField` 对齐。

#### 2) 全站迁移策略

按“用户可感知 + 风险最小”原则迁移：

- 优先迁移存在内联样式的表单（StaticPage 反馈）→ 最大化一致性收益
- 迁移 UserCenterPage 的 profile/token/feedback 输入 → 用户高频编辑区域
- 迁移 Search/Following/Favorites 的 Select 控件 → 站内核心检索与筛选体验
- AnimeDetail 评论区 Select/TextArea 收敛 → 与 TextField 统一

迁移过程中保持：

- 数据逻辑（state / handler）不变
- DOM 结构最小变动（避免测试脆弱）
- 原有 CSS tokens 不变（统一复用 `--control-*` / `--field-bg*` / `--shadow-ring`）

#### 3) 依赖升级策略（稳定版）

升级目标（以 npm registry 最新稳定版为准）：

- React / React DOM
- React Router DOM
- Framer Motion
- Vite / @vitejs/plugin-react
- Vitest / @vitest/coverage-v8 / jsdom
- Storybook（react-vite 生态）

升级方式：

1. 更新 `package.json` 版本范围（必要时固定到明确版本，避免漂移）。
2. `npm install` 生成新 `package-lock.json`。
3. 每批升级后运行：
   - `npm run check`
   - `npm audit --registry="https://registry.npmjs.org/"`
   - `npm run storybook:build`（作为额外质量闸门）

如出现 breaking changes：

- 优先在本地最小修复（配置/少量 API 调整）
- 不引入非必要新依赖

## 安全与性能

- **安全:**
  - 不引入明文密钥/Token
  - 输入内容保持本地存储策略，避免 XSS 注入风险（React 默认转义 + 不使用 dangerouslySetInnerHTML）
  - 依赖升级后执行 `npm audit` 并保持 0 vulnerabilities
- **性能:**
  - primitives 仅增加轻量 styled-components 封装，不引入额外 runtime
  - 确保 bundle budget 闸门不退化（以 `scripts/bundle-budget.js` 为准）

## 测试与部署

- 测试：
  - `npm run test`（随 `npm run check` 执行）
  - Storybook build 作为额外回归
- 部署：
  - 维持 GitHub Actions + Pages 流程不变
