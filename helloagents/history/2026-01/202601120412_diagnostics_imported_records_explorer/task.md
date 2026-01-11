# 任务清单: Diagnostics Imported Records Explorer（导入回放增强）

目录: `helloagents/history/2026-01/202601120412_diagnostics_imported_records_explorer/`

---

## 1. 组件扩展（向后兼容）

- [√] 1.1 扩展 `DiagnosticsLogsExplorer`：支持自定义标题/空状态文案（默认保持不变）
- [√] 1.2 扩展 `DiagnosticsErrorsExplorer`：支持自定义标题/空状态文案（默认保持不变）
- [√] 1.3 更新/补齐单测：覆盖 title 覆盖与导入场景空状态

## 2. 页面接入（导入浏览器）

- [√] 2.1 `DiagnosticsPage`：将 DropZone 收敛到“导入诊断包”区域，移除重复入口
- [√] 2.2 `DiagnosticsPage`：导入包存在时渲染“导入错误/日志浏览器”，支持筛选/检索/下载

## 3. 文档与变更记录

- [√] 3.1 更新 `docs/DIAGNOSTICS.md`：补充导入包可浏览 logs/errors 说明
- [√] 3.2 更新 `README.md` 与 `README.en.md`：同步导入回放增强能力
- [√] 3.3 更新 `CHANGELOG.md` 与 `helloagents/CHANGELOG.md`
- [√] 3.4 更新 `helloagents/history/index.md` 并迁移方案包至 history

## 4. 质量闸门

- [√] 4.1 运行 `npm run check` 确保全绿
