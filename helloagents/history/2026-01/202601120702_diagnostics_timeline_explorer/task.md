# 任务清单: Diagnostics Timeline Explorer（导入回放聚合时间线）

目录: `helloagents/plan/202601120702_diagnostics_timeline_explorer/`

---

## 1. Diagnostics UI

- [√] 1.1 新增 `src/components/diagnostics/DiagnosticsTimelineExplorer.jsx`（聚合 logs/errors/events → timeline，支持筛选/展开/下载），验证 why.md#需求-导入诊断包的聚合回放
- [√] 1.2 新增 `src/components/diagnostics/DiagnosticsTimelineExplorer.test.jsx` 覆盖筛选与下载行为，验证 why.md#需求-导入诊断包的聚合回放
- [√] 1.3 更新 `src/pages/DiagnosticsPage.jsx`：导入包存在时新增“导入时间线”卡片，并接入下载，验证 why.md#变更内容

## 2. 文档与知识库

- [√] 2.1 更新 `docs/DIAGNOSTICS.md`：补齐 timeline 聚合回放说明
- [√] 2.2 更新 `README.md` / `README.en.md`：补齐 timeline 能力说明
- [√] 2.3 更新 `CHANGELOG.md` 与 `helloagents/CHANGELOG.md`
- [√] 2.4 更新 `helloagents/wiki/overview.md`：补齐 Diagnostics 能力索引

## 3. 安全检查

- [√] 3.1 执行安全检查（按G9：敏感信息、潜在 PII、危险调用），确认未新增远程上传路径

## 4. 测试与交付

- [√] 4.1 执行 `npm ci`
- [√] 4.2 执行 `npm run check`（format/lint/test/build/budget）
- [√] 4.3 按标准 Git 流程提交并 push 到 `origin/master`
- [√] 4.4 迁移方案包至 `helloagents/history/2026-01/` 并更新 `helloagents/history/index.md`
