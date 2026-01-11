# 任务清单: Diagnostics Events Explorer（诊断包事件回放浏览）

目录: `helloagents/history/2026-01/202601120629_diagnostics_events_explorer/`

---

## 1. Analytics / Diagnostics Bundle
- [√] 1.1 在 `src/utils/analytics.js` 增加 `getEvents()` 导出，返回事件明细列表（防御性容错）
- [√] 1.2 在 `src/utils/analytics.test.js` 补齐 `getEvents()` 的单测覆盖（正常读取/异常 JSON）
- [√] 1.3 在 `src/utils/diagnosticsBundle.js` 将 `events` 纳入 bundle，并增加 `maxEvents` 裁剪参数
- [√] 1.4 在 `src/utils/diagnosticsBundle.test.js` 增加 events 注入与裁剪的单测

## 2. Diagnostics Import / Summary
- [√] 2.1 在 `src/utils/diagnosticsImport.js` 的 `summarizeDiagnosticsBundle` 中增加 `eventsCount`
- [√] 2.2 在 `src/utils/diagnosticsImport.test.js` 补齐 `eventsCount` 的单测覆盖

## 3. Diagnostics UI
- [√] 3.1 新增 `src/components/diagnostics/DiagnosticsEventsExplorer.jsx`（筛选/展开/下载/清空可选）
- [√] 3.2 新增 `src/components/diagnostics/DiagnosticsEventsExplorer.test.jsx` 覆盖筛选与下载行为
- [√] 3.3 更新 `src/pages/DiagnosticsPage.jsx`：集成本地/导入 Events Explorer，补齐导入摘要与对照摘要中的 events 数量展示

## 4. 文档与知识库
- [√] 4.1 更新 `docs/DIAGNOSTICS.md`：补齐 diagnostics bundle 的 `events` 字段说明与 Explorer 入口
- [√] 4.2 更新 `README.md` / `README.en.md`：补齐事件回放能力说明与 Docs 入口
- [√] 4.3 更新 `CHANGELOG.md` 与 `helloagents/CHANGELOG.md`
- [√] 4.4 更新 `helloagents/wiki/overview.md`：补齐 Diagnostics 可观测性能力索引

## 5. 安全检查
- [√] 5.1 执行安全检查（按G9：敏感信息、潜在 PII、危险调用），并确认未新增远程上传路径

## 6. 测试与交付
- [√] 6.1 执行 `npm ci` 安装依赖
- [√] 6.2 执行 `npm run check`，确保闸门全绿
- [√] 6.3 按标准 Git 流程提交并 push 到 `origin/master`
- [√] 6.4 迁移方案包至 `helloagents/history/2026-01/` 并更新 `helloagents/history/index.md`

