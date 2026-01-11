# 变更提案: 诊断包构建元信息（Build Info）

## 需求背景

诊断包的核心价值是让问题“可复现、可定位”。但在没有构建元信息（版本号、提交 SHA、构建时间）的情况下，排障经常会遇到两个典型问题：

1. **无法确认线上跑的是哪一版**：用户反馈的问题可能已经在本地修复，但无法确定线上是否已部署。
2. **无法区分 dev/preview/production 行为差异**：某些问题只在生产构建（压缩、代码分包、缓存）后出现。

因此需要补齐行业常见的 build info，让诊断包具备“定位到版本”的能力。

## 变更内容

1. 在构建阶段注入 build info（版本号 / 提交 SHA / 构建时间）
2. 诊断包增加 `build` 字段，导出时携带 build info
3. `/diagnostics` UI 在“系统”卡片展示版本与构建信息，便于现场快速核对

## 影响范围

- **模块:** Build & Deploy / Diagnostics / Observability
- **文件:**
  - `vite.config.js`
  - `eslint.config.js`
  - `src/utils/buildInfo.js`（新增）
  - `src/utils/diagnosticsBundle.js`
  - `src/pages/DiagnosticsPage.jsx`

## 核心场景

### 需求: 快速核对线上版本

**模块:** Diagnostics

#### 场景: 用户提交诊断包后无法复现

- 维护者可从诊断包 `build` 字段直接确认：版本号、提交 SHA、构建时间
- 如与当前主分支不一致，可快速判断是否为“未部署/缓存未刷新/用户本地旧版本”引起

## 风险评估

- **风险:** 生产构建中注入构建时间会导致每次 build 的产物哈希变化（符合预期，且本项目已使用 hash 资产文件名）。
- **缓解:** build info 仅在 `command === "build"` 时注入；开发环境保持 `null`，避免引入不必要的变量。
