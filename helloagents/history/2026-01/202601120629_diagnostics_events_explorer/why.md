# 变更提案: Diagnostics Events Explorer（诊断包事件回放浏览）

## 需求背景

项目已具备本地埋点能力（`trackEvent` 写入 localStorage），并在用户中心展示事件总数用于观测；但当前诊断链路仍缺少“事件明细”的导出/导入/回放能力：

- 排障时仅有 `logs/errors` 仍不足以还原“用户到底点击了什么、按什么顺序触发了哪些动作”
- 诊断包导入回放已经支持 `logs/errors` 的筛选与下载，但无法覆盖埋点事件这一关键线索
- 本项目坚持 Local-first，事件数据也应当能在本地被查看、导出并在导入包中回放（不出网）

目标是在 **不破坏现有核心架构与业务逻辑根基** 的前提下，遵循开闭原则（增量扩展），补齐“事件回放”这一行业常见可观测性能力。

## 变更内容

1. 诊断包（Diagnostics Bundle）增量扩展：在现有 `logs/errors/snapshot/build` 基础上新增可选字段 `events`（埋点事件明细），并提供导出数量上限裁剪。
2. 诊断页新增 Events Explorer：
   - 本地事件浏览器：关键词筛选、名称筛选、展开详情、下载筛选结果、清空并重置
   - 导入事件回放浏览器：导入包包含 `events` 时可直接回放浏览（保持与 logs/errors 同一交互范式）
3. 诊断摘要补齐 `eventsCount`，用于当前/导入对照与导入元信息概览。
4. 文档与知识库同步：更新 `docs/DIAGNOSTICS.md` 与双语 README；同步 helloagents 知识库与变更历史索引。

## 影响范围

- **模块:**
  - Analytics（本地埋点事件存储）
  - Diagnostics（bundle/import/replay UI）
  - Docs / Knowledge Base（文档与变更记录）
- **文件:**
  - `src/utils/analytics.js`
  - `src/utils/diagnosticsBundle.js`
  - `src/utils/diagnosticsImport.js`
  - `src/pages/DiagnosticsPage.jsx`
  - `src/components/diagnostics/DiagnosticsEventsExplorer.jsx`
  - `docs/DIAGNOSTICS.md`
  - `README.md` / `README.en.md`
  - `CHANGELOG.md`
  - `helloagents/wiki/overview.md`
  - `helloagents/CHANGELOG.md`
  - `helloagents/history/index.md`

## 核心场景

### 需求: 导出诊断包携带事件明细
**模块:** Diagnostics Bundle / Analytics

#### 场景: 用户在崩溃兜底页导出诊断包
- 诊断包包含 `events`（裁剪后的明细），用于还原关键行为路径
- 导出不出网，仍符合 Local-first

### 需求: 导入诊断包回放事件线索
**模块:** Diagnostics UI

#### 场景: 维护者导入用户提供的 `.json/.json.gz` 诊断包
- 可在 “导入事件浏览器” 中按关键词/事件名检索
- 可展开查看 payload 详情，并可下载筛选结果以便归档/共享

### 需求: 本地事件可视化与清理
**模块:** Diagnostics UI / Analytics

#### 场景: 开发或排障时验证某个修复是否生效
- 可清空本地事件并重置筛选条件
- 不影响其他模块数据（遵循最小影响原则）

## 风险评估

- **风险: 数据量导致 UI 卡顿 / 文件过大**
  - **缓解:** 事件最大存储量已上限（200），诊断包导出再做 `maxEvents` 裁剪；Explorer 默认分页展示（limit）。
- **风险: 事件 payload 可能包含隐私信息**
  - **缓解:** 本次变更不新增任何远程上传；文档强调“导出前请自查脱敏”；保持 “仅本地解析/不出网” 的原则。

