# 任务清单: 诊断导出兜底（手动复制 + gzip）

目录: `helloagents/plan/202601120149_diagnostics_export_fallback/`

---

## 1. 手动复制兜底

- [√] 1.1 新增 `src/components/ManualCopyDialog.jsx`（Dialog + TextAreaField）
- [√] 1.2 诊断页复制失败时打开手动复制弹窗
- [√] 1.3 ErrorBoundary 复制失败时打开手动复制弹窗

## 2. gzip 诊断包下载

- [√] 2.1 诊断页：浏览器支持 gzip 时提供 `.json.gz` 下载
- [√] 2.2 ErrorBoundary：浏览器支持 gzip 时提供 `.json.gz` 下载
- [√] 2.3 gzip 下载校验 header，失败给出明确提示

## 3. 文档更新

- [√] 3.1 更新 `docs/DIAGNOSTICS.md`：补齐 `.json.gz` 与手动复制兜底说明
- [√] 3.2 更新 `CHANGELOG.md` / `helloagents/CHANGELOG.md`
- [√] 3.3 更新 `helloagents/history/index.md`

## 4. 测试

- [ ] 4.1 `npm run check`
