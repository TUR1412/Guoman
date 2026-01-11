# Why: Diagnostics Local Timeline（本地 breadcrumbs 时间线）

## 背景

当前 `/diagnostics` 已提供：

- 本地 logs / errors / events 三类记录的独立浏览器
- 导入诊断包后的 logs / errors / events 浏览器
- 导入诊断包的「导入时间线」聚合视图（breadcrumbs）

但在“排查当前会话问题”场景中，仍需要在三个浏览器之间反复切换（点击行为 → 日志 → 错误），链路还原成本偏高。

## 目标

在**完全不改变现有数据结构与核心逻辑**的前提下，新增一个“本地时间线”聚合视图：

- 将本地 logs / errors / events 按时间聚合为单一时间线
- 支持类型筛选、关键词检索、展开详情、下载筛选结果
- 与「导入时间线」保持一致的交互与视觉语言

## 成功标准

- `/diagnostics` 同时提供「本地时间线」与「导入时间线」
- `npm run check` 全绿（format/lint/test/build/budget）
- 文档与双语 README 同步更新，避免“代码已支持但文档缺失”
