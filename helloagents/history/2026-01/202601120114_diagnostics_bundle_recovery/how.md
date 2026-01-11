# 技术设计: 崩溃兜底与诊断包导出

## 技术方案

### 核心技术

- React Error Boundary（兜底 UI + 防止错误扩散）
- Local-first stores：`logger` / `errorReporter` / `healthConsole`
- Clipboard API + `document.execCommand('copy')` 兜底
- `downloadTextFile`（生成文件下载）

### 实现要点

- 诊断包统一入口：新增 `src/utils/diagnosticsBundle.js`
  - 输出 `schemaVersion`、`generatedAt`、`userAgent`
  - 复用 `healthConsole` 的健康快照（性能/LongTask/事件循环延迟/React commit 等）
  - 汇总本地 `logs` 与 `errors`，并提供 `maxLogs/maxErrors` 上限裁剪
- 崩溃兜底升级：`src/components/AppErrorBoundary.jsx`
  - 捕获错误后写入 errorReporter（保持原有上报路径）
  - 提供复制/下载诊断包入口（失败时给出明确提示，不再静默失败）
  - DEV 环境展示错误栈（避免生产暴露）
- 诊断面板升级：`src/pages/DiagnosticsPage.jsx`
  - 生成诊断 JSON（与 ErrorBoundary 同源）
  - 提供复制/下载入口、错误/日志清空、存储占用统计与明细展示
  - 监控采样（LongTask/内存/延迟）由用户显式开关控制，避免默认带来额外开销
- 分享兜底：`src/utils/share.js`
  - 优先 Clipboard API
  - 不可用/拒绝时 fallback 到 `execCommand('copy')`
  - 返回 `{ ok, method }`，让调用方可给出用户可理解的反馈

## 安全与性能

- **安全:**
  - 诊断信息默认不出网；导出仅发生在用户显式点击“复制/下载”时
  - 诊断包字段可直观看到内容（JSON），便于用户自查后再分享
- **性能:**
  - `buildDiagnosticsBundle()` 为同步聚合，复用既有缓存/存储读取逻辑
  - 监控采样与刷新频率由用户控制（开启后每秒刷新；关闭则不产生定时器）
  - 导出内容做上限裁剪，避免超大 JSON 导致卡顿

## 测试与部署

- 单元测试：新增 diagnostics bundle 与剪贴板兜底分支覆盖
- 本地质量闸门：`npm run check`
- 部署：无额外配置变更，沿用现有 GitHub Actions → Pages 流程
