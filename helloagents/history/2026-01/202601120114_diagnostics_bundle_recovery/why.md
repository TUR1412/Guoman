# 变更提案: 崩溃兜底与诊断包导出

## 需求背景

本项目坚持 **Local-first**：用户数据、偏好、诊断信息默认只存在浏览器本地，不依赖远程服务。

在真实使用中，偶发的脚本错误、浏览器兼容性差异、弱网/缓存不一致导致的 chunk 加载问题，都会让排障变得困难：用户无法清晰描述“发生了什么”，维护者也难以快速复现。

因此需要一个“**可复制、可下载、可分享**”的诊断包机制：

- 面向用户：遇到崩溃时能一键导出信息，减少沟通成本
- 面向维护：定位错误来源与性能尖刺更快，避免盲查

## 变更内容

1. 新增诊断包构建器：统一生成 `schemaVersion` + `snapshot` + `logs` + `errors` 的诊断 JSON
2. 崩溃兜底增强：在 Error Boundary 页面提供“复制诊断 / 下载诊断包”入口
3. 诊断面板增强：在 `/diagnostics` 提供 JSON 复制/下载能力，并展示本地存储占用、错误与日志明细
4. 分享能力增强：剪贴板写入支持 Clipboard API + `execCommand('copy')` 兜底路径（更广泛兼容）
5. 文档同步：补齐诊断包字段说明与 Web Vitals（含 INP）说明，并在 README 增加崩溃兜底亮点

## 影响范围

- **模块:** Diagnostics / Observability / Stability
- **文件:**
  - `src/utils/diagnosticsBundle.js`（新增）
  - `src/components/AppErrorBoundary.jsx`
  - `src/pages/DiagnosticsPage.jsx`
  - `src/utils/share.js`
  - `docs/DIAGNOSTICS.md`
  - `README.md` / `README.en.md`

## 核心场景

### 需求: 崩溃兜底（Crash Recovery）

**模块:** Stability / Error Handling

#### 场景: 页面渲染崩溃

当 React 渲染树抛出异常导致页面不可用时：

- 展示可理解的兜底页（刷新/返回首页）
- 提供“复制诊断 / 下载诊断包”入口，便于用户提交问题

### 需求: 诊断包导出（Diagnostics Bundle）

**模块:** Diagnostics / Observability

#### 场景: 手动导出排障信息

当用户进入 `/diagnostics` 主动排查时：

- 可生成包含健康快照 + 本地日志 + 本地错误的诊断 JSON
- 可复制到剪贴板或下载为文件，便于分享与留存

## 风险评估

- **风险:** 诊断包可能包含较敏感的上下文信息（例如错误栈、日志内容）。
- **缓解:**
  - 默认不出网、不自动上传，导出行为由用户显式触发
  - 对导出的日志/错误数量做上限裁剪，避免文件过大与信息过载
  - 文档明确提示：分享诊断包前应自查是否包含不希望公开的信息
