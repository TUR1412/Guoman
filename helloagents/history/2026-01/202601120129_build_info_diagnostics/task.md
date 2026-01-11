# 任务清单: 诊断包构建元信息（Build Info）

目录: `helloagents/plan/202601120129_build_info_diagnostics/`

---

## 1. 构建信息注入

- [√] 1.1 在 `vite.config.js` 注入 `__APP_VERSION__ / __BUILD_SHA__ / __BUILD_TIME__`
- [√] 1.2 在 `eslint.config.js` 声明上述全局常量为只读

## 2. 诊断包与 UI

- [√] 2.1 新增 `src/utils/buildInfo.js`：统一 build info 读取与 shortSha 计算
- [√] 2.2 更新 `src/utils/diagnosticsBundle.js`：增加 `build` 字段
- [√] 2.3 更新 `src/pages/DiagnosticsPage.jsx`：系统卡片展示版本与构建信息

## 3. 文档与测试

- [√] 3.1 更新 `docs/DIAGNOSTICS.md`：补齐 build 字段说明
- [√] 3.2 更新 `src/utils/diagnosticsBundle.test.js`：mock `buildInfo`，覆盖 bundle 结构
- [√] 3.3 更新知识库索引：`helloagents/history/index.md`、`helloagents/CHANGELOG.md`

## 4. 测试

- [√] 4.1 `npm run check`（本次提交前运行）
