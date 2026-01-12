# How: Diagnostics Timeline Drilldown（时间线一键定位到浏览器）

## 方案概述

1. `DiagnosticsTimelineExplorer` 增加可选 `onJump` 回调，并在条目详情中渲染“定位”按钮。
2. `DiagnosticsLogsExplorer` / `DiagnosticsErrorsExplorer` / `DiagnosticsEventsExplorer` 增加可选 `focus` 入参：
   - `focus.token` 变化时触发一次性应用
   - 自动写入 query/level/eventName，并重置 limit（避免“跳转后看不到结果”）
3. `DiagnosticsPage` 增加本地与导入两套 focus 状态 + 滚动定位：
   - 本地时间线 → 本地 logs/errors/events 浏览器
   - 导入时间线 → 导入 logs/errors/events 浏览器
   - 统一导出文件名：local/imported 前缀保持不混淆

## 关键约束

- 仅做 UI 层增强，不修改诊断包 schema / 导入解析规则
- 不替代原有浏览器组件，仅增加“从时间线跳到浏览器”的入口
