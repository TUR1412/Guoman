# 变更提案: 诊断回放（导入 .json / .json.gz）

## 需求背景

诊断体系的价值不止于“导出”，还在于“可读、可复现、可对照”：

1. **用户上报更真实**：用户在崩溃兜底或诊断页导出诊断包后，维护者往往需要快速查看构建信息、错误数量、日志线索与核心快照指标。
2. **跨环境对照更高效**：同一问题可能在不同版本/不同设备出现；导入后能在同一页面快速对照差异。
3. **保持 Local-first**：导入解析在本地完成，不上传网络，符合项目隐私与架构原则。

因此补齐“诊断回放”能力：在 `/diagnostics` 直接导入诊断包并显示摘要，作为排障的第一站。

## 变更内容

1. 新增 `src/utils/diagnosticsImport.js`：
   - 支持识别 gzip（文件后缀或 magic header）
   - 在支持 gzip 解压时解压并返回 JSON 文本
   - 校验诊断包 schema 的必要字段（`schemaVersion` / `logs[]` / `errors[]`）
2. 诊断页 `/diagnostics` 增加“导入诊断包”模块：
   - 支持选择 `.json` / `.json.gz`
   - 展示导入包摘要：文件名/大小/生成时间/build 信息/日志与错误数量
   - 支持复制/下载导入包，并在复制失败时提供手动复制兜底
3. 文档同步：补齐 `docs/DIAGNOSTICS.md` 与双语 README 的能力说明。

## 影响范围

- **模块:** Diagnostics / UX
- **文件:**
  - `src/pages/DiagnosticsPage.jsx`
  - `src/utils/diagnosticsImport.js`
  - `docs/DIAGNOSTICS.md`
  - `README.md` / `README.en.md`

## 风险评估

- **风险:** `.json.gz` 导入依赖浏览器 `DecompressionStream('gzip')`；部分环境不支持。
- **缓解:** 检测到 gzip 且环境不支持时明确提示用户（改用现代浏览器或先本地解压为 `.json`）。
