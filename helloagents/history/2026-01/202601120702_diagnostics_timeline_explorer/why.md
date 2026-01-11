# 变更提案: Diagnostics Timeline Explorer（导入回放聚合时间线）

## 需求背景

当前诊断回放已支持导入后分别浏览 `logs/errors/events`，但在真实排障场景中，“线索” 往往是跨类型的：

- 一条用户行为（event）→ 触发某个页面跳转（log）→ 最终出现脚本异常（error）
- 分散浏览需要在多个列表之间切换，难以形成连续的“行为链路”

因此需要一个 **聚合时间线（breadcrumbs）**：把 `logs/errors/events` 合并为按时间排序的单一视图，用更低的认知成本还原用户路径。

本次变更遵循开闭原则：**不改变既有导入/导出 schema 约束，不破坏原浏览器交互**，仅通过新增组件与 UI 卡片扩展能力。

## 变更内容

1. 新增 `DiagnosticsTimelineExplorer`：
   - 将 `logs/errors/events` 归一化为 timeline records，并按 `at` 倒序展示
   - 支持类型筛选（all/log/error/event）与关键词检索（覆盖 message/source/context/stack/name/payload）
   - 支持展开详情，并可下载筛选结果（JSON）
2. Diagnostics 页面（导入回放区域）新增“导入时间线”卡片：导入包存在时即可使用聚合回放视图。
3. 文档与知识库同步：更新 `docs/DIAGNOSTICS.md` 与双语 README，补齐“时间线回放”入口与说明。

## 影响范围

- **模块:** Diagnostics UI / Replay
- **文件（预期）:**
  - `src/components/diagnostics/DiagnosticsTimelineExplorer.jsx`（新增）
  - `src/components/diagnostics/DiagnosticsTimelineExplorer.test.jsx`（新增）
  - `src/pages/DiagnosticsPage.jsx`
  - `docs/DIAGNOSTICS.md`
  - `README.md` / `README.en.md`
  - `CHANGELOG.md`
  - `helloagents/wiki/overview.md`
  - `helloagents/CHANGELOG.md`
  - `helloagents/history/index.md`

## 核心场景

### 需求: 导入诊断包的聚合回放

**模块:** Diagnostics UI

#### 场景: 维护者导入用户提供的诊断包

- 能在单一视图中按时间顺序看到 logs/errors/events
- 支持关键词检索快速定位“某次点击→某次报错”的前后文
- 支持下载筛选结果用于留档/共享

## 风险评估

- **风险: 列表过长导致渲染压力**
  - **缓解:** 默认分页展示（limit + “显示更多”）；仅在展开时渲染详情 JSON/stack。
- **风险: 信息重复（与各 Explorer 重叠）**
  - **缓解:** 时间线作为“聚合视图”，不替代现有 Explorer；保留 logs/errors/events 专用视图用于深挖。
