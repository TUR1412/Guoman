# how · Diagnostics Imported Records Explorer

## 方案概述

以“开闭原则”为约束，采用 **增量扩展** 的方式实现导入回放增强：

1. **组件扩展（向后兼容）**
   - 为 `DiagnosticsLogsExplorer` / `DiagnosticsErrorsExplorer` 增加可选 props（如 `title`、空状态文案覆盖），默认行为不变，保证现有页面/测试零破坏。
2. **页面接入（只做组合，不动底层导入协议）**
   - 在 `DiagnosticsPage` 中新增“导入日志/错误浏览器”区域，数据源来自 `importedBundle.logs` / `importedBundle.errors`。
   - 复用现有 `downloadFilteredLogs` / `downloadFilteredErrors` 下载能力。
3. **导入入口收敛**
   - 将 DropZone 固定落在“导入诊断包”卡片中（点击/拖拽都可触发导入），删除其它重复入口，降低 UI 噪音并避免用户困惑。

## 风险与规避

- **风险：导入包缺少 logs/errors 字段或为空**
  - 规避：在导入浏览器中使用可覆盖的空状态文案，明确提示“导入包未包含记录”。
- **风险：页面过长**
  - 规避：导入浏览器仅在 `importedBundle` 存在时渲染；本地浏览器保持原位置，避免布局大幅重排。
- **风险：破坏既有样式体系**
  - 规避：继续复用 Diagnostics 专用 UI 原语（`diagnosticsUi.jsx`）与现有 tokens，不引入新的全局主题改动。

## 验证

- `npm run check` 全绿（format/lint/test/build/budget）。
- 关键交互自测：
  - 导入 `.json` / `.json.gz` 后可浏览导入 logs/errors 并下载筛选结果
  - 清空导入后相关 UI 消失，页面回到“未导入”状态
