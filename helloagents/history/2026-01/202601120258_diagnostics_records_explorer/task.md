# 任务清单: Diagnostics Records Explorer（日志/错误浏览器增强）

目录: `helloagents/plan/202601120258_diagnostics_records_explorer/`

---

## 1. Diagnostics 页面（浏览体验增强）

- [√] 1.1 新增日志浏览器组件（筛选/检索/折叠/导出），集成到 `src/pages/DiagnosticsPage.jsx`，验证 why.md#需求-日志浏览器（筛选/检索/导出）-场景-现场排障快速定位
- [√] 1.2 新增错误浏览器组件（检索/折叠 stack/导出），集成到 `src/pages/DiagnosticsPage.jsx`，验证 why.md#需求-错误浏览器（展开-stack）-场景-复盘某次崩溃
- [√] 1.3 为“导入诊断包”增加拖拽导入 DropZone（不破坏原选择文件入口），验证 why.md#需求-导入体验（拖拽导入）-场景-对照排障

## 2. 安全检查

- [√] 2.1 执行安全检查（按G9: 不引入远程上报、避免敏感信息硬编码、导入解析限制大小、防御性错误处理）

## 3. 文档更新

- [√] 3.1 更新 `docs/DIAGNOSTICS.md`：补充日志/错误浏览器与拖拽导入说明
- [√] 3.2 更新 `README.md` 与 `README.en.md`：同步诊断页能力说明
- [√] 3.3 更新 `CHANGELOG.md`：记录新增能力
- [√] 3.4 更新 `helloagents/CHANGELOG.md` 与 `helloagents/history/index.md`（按知识库同步规则）

## 4. 测试

- [√] 4.1 新增/更新组件测试：覆盖日志过滤、关键词检索、展开细节等关键交互
- [√] 4.2 运行 `npm run check`，确保 format/lint/test/build/budget 全部通过
