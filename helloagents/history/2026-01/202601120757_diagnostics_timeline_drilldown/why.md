# Why: Diagnostics Timeline Drilldown（时间线一键定位到浏览器）

## 背景

`/diagnostics` 目前已经具备：

- 本地与导入的 logs / errors / events 浏览器（筛选/检索/展开/下载）
- 本地与导入的 breadcrumbs 时间线（聚合回放，按时间倒序）

时间线适合“快速扫一遍发生了什么”，但当需要进一步查看细节（例如某条 log 的 context、某条 error 的 stack、某个 event 的 payload），用户仍需要手动切换到对应浏览器并重新输入筛选条件，链路衔接成本偏高。

## 目标

在不改变现有数据结构与核心交互的前提下，为时间线提供“下一跳”能力：

- 时间线条目支持“一键定位到对应浏览器”
- 自动填充推荐筛选条件（例如：日志按 level + source/关键字、事件按 event name）
- 自动滚动到目标浏览器卡片，减少用户上下文切换成本

## 成功标准

- 本地时间线与导入时间线均支持 drilldown
- 不引入任何远程请求/上传路径（仍为 local-first）
- `npm run check` 全绿
