# 任务清单: 诊断回放（导入 .json / .json.gz）

目录: `helloagents/plan/202601120220_diagnostics_bundle_import/`

---

## 1. 工具函数

- [√] 1.1 新增 `src/utils/diagnosticsImport.js`（解码 + schema 校验）
- [√] 1.2 新增 `src/utils/diagnosticsImport.test.js` 覆盖核心分支

## 2. UI 接入（/diagnostics）

- [√] 2.1 增加“导入诊断包”模块（文件选择 + 摘要展示）
- [√] 2.2 支持复制/下载导入包，并复用手动复制兜底

## 3. 文档更新

- [√] 3.1 更新 `docs/DIAGNOSTICS.md`：补齐导入说明
- [√] 3.2 更新 `README.md` / `README.en.md`
- [√] 3.3 更新 `CHANGELOG.md` / `helloagents/CHANGELOG.md`
- [√] 3.4 更新 `helloagents/history/index.md`

## 4. 质量验证

- [√] 4.1 `npm run check`
