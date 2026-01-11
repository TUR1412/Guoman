# How: Diagnostics Local Timeline（本地 breadcrumbs 时间线）

## 方案概述

复用既有 `DiagnosticsTimelineExplorer` 组件的“聚合 + 筛选 + 下载”能力，只做页面层扩展：

- 在 `src/pages/DiagnosticsPage.jsx` 新增一张「本地时间线」卡片
- 传入本地 `logs/errors/events`（来自现有 state）
- 为本地与导入时间线分别提供下载处理（文件名区分 local/imported）

## 关键约束（开闭原则）

- 不修改 diagnostics bundle schema / 导入校验逻辑
- 不替代现有 logs/errors/events Explorer，仅提供聚合视图作为补强入口
- 下载仅为本地导出 JSON，不新增任何远程上传/上报路径

## 风险与规避

- **混淆风险**：本地与导入的时间线导出文件名容易混淆  
  → 使用明确前缀：`guoman-timeline-local-*` / `guoman-timeline-imported-*`
- **UI 拥挤风险**：新增卡片可能增加页面纵向长度  
  → 放置在本地 logs/errors/events 浏览器之前，作为“总览入口”，保留深挖卡片在后
