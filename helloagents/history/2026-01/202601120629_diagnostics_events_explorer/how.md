# 技术设计: Diagnostics Events Explorer（诊断包事件回放浏览）

## 技术方案

### 核心技术
- React 18 + styled-components
- localStorage + storageQueue（合并写入/空闲刷新）
- Diagnostics Bundle（本地导出 JSON / gzip）

### 实现要点

1. **Analytics Store 增量扩展**
   - 在 `src/utils/analytics.js` 新增导出 `getEvents()`：返回事件明细（数组），并保持对异常存储内容的防御性处理。
   - 保持现有 `trackEvent/getEventStats/clearEvents` 的行为不变，避免破坏既有调用点。

2. **Diagnostics Bundle 增量扩展**
   - 在 `src/utils/diagnosticsBundle.js` 引入 `getEvents()` 并在 bundle 中新增字段 `events`。
   - 新增参数 `maxEvents`（默认裁剪），与 `maxLogs/maxErrors` 同类。
   - `schemaVersion` 保持不变（仍为 2），将 `events` 视作向后兼容的可选字段（不破坏导入与既有消费方）。

3. **Diagnostics Import 摘要扩展**
   - 在 `summarizeDiagnosticsBundle` 增加 `eventsCount`（可选字段，缺失时为 0）。
   - 保持 `parseDiagnosticsBundleText` 的必要字段校验逻辑不变（仍要求 `logs/errors` 为数组）。

4. **Events Explorer UI**
   - 新增组件 `DiagnosticsEventsExplorer`，交互与 `DiagnosticsLogsExplorer/DiagnosticsErrorsExplorer` 保持一致：
     - 关键词搜索（name/payload）
     - 事件名筛选（all + 按出现次数排序）
     - 展开查看 payload（JSON）
     - 下载筛选结果
     - 清空并重置（可选）
   - `DiagnosticsPage` 集成：
     - 导入包存在时：展示导入事件浏览器（空状态可定制）
     - 本地：展示本地事件浏览器，并提供清空按钮
     - 导入摘要与对照摘要新增 events 数量展示

## 安全与性能

- **安全（隐私）:** 不新增上传逻辑；导出仍为用户主动操作；文档提示脱敏。
- **性能:** Explorer 默认分页展示；payload 展开时才渲染详细 JSON；裁剪导出数量避免 bundle 过大。

## 测试与部署

- **单测:** Vitest
  - `analytics.getEvents` 覆盖正常读取/异常 JSON 容错
  - `diagnosticsBundle` 覆盖 events 注入与裁剪
  - `diagnosticsImport.summarizeDiagnosticsBundle` 覆盖 eventsCount
  - `DiagnosticsEventsExplorer` 覆盖筛选与下载
- **质量闸门:** `npm run check`（format/lint/test/build/budget）
- **部署:** 按现有 GitHub Actions 流程，无需新增配置

