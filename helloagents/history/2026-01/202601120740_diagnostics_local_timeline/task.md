# 任务清单: Diagnostics Local Timeline（本地 breadcrumbs 时间线）

目录: `helloagents/plan/202601120740_diagnostics_local_timeline/`

---

## 1. Diagnostics UI

- [√] 1.1 更新 `src/pages/DiagnosticsPage.jsx`：新增「本地时间线」卡片，聚合本地 logs/errors/events
- [√] 1.2 区分本地/导入时间线下载文件名（避免混淆）

## 2. 文档与知识库

- [√] 2.1 更新 `docs/DIAGNOSTICS.md`：补齐本地时间线说明
- [√] 2.2 更新 `README.md` / `README.en.md`：补齐本地/导入时间线能力说明
- [√] 2.3 更新 `CHANGELOG.md` 与 `helloagents/CHANGELOG.md`
- [√] 2.4 更新 `helloagents/wiki/overview.md` 与 `helloagents/history/index.md`

## 3. 安全检查

- [√] 3.1 确认未新增远程请求/上传（仅本地聚合与下载）

## 4. 测试与交付

- [√] 4.1 执行 `npm ci`
- [√] 4.2 执行 `npm run check`
- [√] 4.3 标准 Git 流程提交并 push 到 `origin/master`
- [√] 4.4 迁移方案包至 `helloagents/history/2026-01/` 并更新 `helloagents/history/index.md`
