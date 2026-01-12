# 任务清单: Diagnostics Timeline Drilldown（时间线一键定位到浏览器）

目录: `helloagents/plan/202601120757_diagnostics_timeline_drilldown/`

---

## 1. 组件增强

- [√] 1.1 更新 `src/components/diagnostics/DiagnosticsTimelineExplorer.jsx`：条目详情新增“定位到浏览器”动作（可选 onJump）
- [√] 1.2 更新 `src/components/diagnostics/DiagnosticsLogsExplorer.jsx`：支持 focus 驱动的外部筛选（一次性应用）
- [√] 1.3 更新 `src/components/diagnostics/DiagnosticsErrorsExplorer.jsx`：支持 focus 驱动的外部筛选（一次性应用）
- [√] 1.4 更新 `src/components/diagnostics/DiagnosticsEventsExplorer.jsx`：支持 focus 驱动的外部筛选（一次性应用）

## 2. 页面接入

- [√] 2.1 更新 `src/pages/DiagnosticsPage.jsx`：为本地/导入时间线接入 onJump，并滚动定位到目标浏览器卡片

## 3. 文档与知识库

- [√] 3.1 更新 `docs/DIAGNOSTICS.md`：补齐 drilldown 使用说明
- [√] 3.2 更新 `README.md` / `README.en.md`：补齐“时间线可一键定位”说明
- [√] 3.3 更新 `CHANGELOG.md` 与 `helloagents/CHANGELOG.md`
- [√] 3.4 更新 `helloagents/wiki/overview.md` 与 `helloagents/history/index.md`

## 4. 验证与交付

- [√] 4.1 执行 `npm ci`
- [√] 4.2 执行 `npm run check`
- [√] 4.3 标准 Git 流程提交并 push 到 `origin/master`
- [√] 4.4 迁移方案包至 `helloagents/history/2026-01/` 并更新 `helloagents/history/index.md`

