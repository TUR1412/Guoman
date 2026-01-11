# 任务清单: 崩溃兜底与诊断包导出

目录: `helloagents/plan/202601120114_diagnostics_bundle_recovery/`

---

## 1. 诊断包能力

- [√] 1.1 新增 `src/utils/diagnosticsBundle.js`：统一构建诊断包（schemaVersion + snapshot + logs + errors）
- [√] 1.2 新增 `src/utils/diagnosticsBundle.test.js`：覆盖 bundle 结构与裁剪逻辑

## 2. 崩溃兜底（Error Boundary）

- [√] 2.1 升级 `src/components/AppErrorBoundary.jsx`：提供复制/下载诊断包入口与清晰反馈（失败可见）

## 3. 诊断面板（/diagnostics）

- [√] 3.1 升级 `src/pages/DiagnosticsPage.jsx`：复制/下载 JSON、监控开关、错误/日志清空、本地占用与明细展示

## 4. 分享与剪贴板兼容

- [√] 4.1 升级 `src/utils/share.js`：Clipboard API + `execCommand('copy')` fallback，并返回 `{ ok, method }`
- [√] 4.2 升级 `src/utils/share.test.js`：补齐 clipboard/execCommand/异常分支覆盖

## 5. 文档同步

- [√] 5.1 更新 `docs/DIAGNOSTICS.md`：补齐 logs/errors 字段说明与 INP 指标说明
- [√] 5.2 更新 `README.md` / `README.en.md`：补齐崩溃兜底亮点
- [√] 5.3 更新知识库：`helloagents/wiki/overview.md`、`helloagents/history/index.md`

## 6. 安全检查

- [√] 6.1 执行安全检查（按G9：默认不出网、无敏感信息硬编码、无生产环境操作）

## 7. 测试

- [√] 7.1 `npm run format:check`
- [√] 7.2 `npm run lint`
- [√] 7.3 `npm test`
- [√] 7.4 `npm run build`
- [√] 7.5 `npm run budget:bundle`
