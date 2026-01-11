# 技术设计: Diagnostics Records Explorer（日志/错误浏览器增强）

## 技术方案

### 核心技术

- React 18 + styled-components
- 复用现有原子组件：`src/ui/TextField.jsx`、`src/ui/SelectField.jsx`、`src/ui/Button.jsx`
- 复用现有能力：`src/utils/logger.js`、`src/utils/errorReporter.js`、`src/utils/diagnosticsImport.js`、`src/utils/download.js`

### 实现要点

- 将 Diagnostics 页中“日志/错误明细”从固定 slice 展示升级为可交互浏览器：
  - 关键词检索：匹配 message/source，必要时对 context/stack 做安全字符串化
  - 日志级别过滤：all/debug/info/warn/error
  - 条目折叠：默认只展示摘要，展开后展示更多信息（context/stack）
  - 导出：支持下载“筛选后结果”JSON（本地）
- 导入诊断包增强：
  - 在现有 file input 基础上新增拖拽导入 DropZone（drag enter/over/drop）
  - 复用现有 `decodeDiagnosticsBytes` 与 `parseDiagnosticsBundleText`
  - 保持 local-first：不引入网络请求、不上传任何内容

## 架构决策 ADR

### ADR-001: 诊断浏览器作为增量扩展

**上下文:** 现有 `/diagnostics` 已稳定提供健康快照与导入/导出能力，目标是增强交互与排障效率。
**决策:** 采用“增量扩展”方式：复用现有数据源与 UI 体系，只新增浏览器组件与少量状态，不更改核心存储结构与采集逻辑。
**理由:** 符合开闭原则；风险更低；不破坏既有逻辑根基。
**替代方案:** 重写 Diagnostics 页整体布局与数据层 → 拒绝原因: 改动面过大，易引入回归。
**影响:** 代码更模块化（新增组件），Diagnostics 页体积降低，可维护性提升。

## 安全与性能

- **安全:** 不新增远程上报；导入仅在本地解析；展示内容默认不自动外传，复制/下载由用户主动触发。
- **性能:** 对筛选结果使用 `useMemo`；限制一次渲染数量；展开细节按需渲染。

## 测试与部署

- **测试:** 增加组件交互测试（筛选/检索/展开），确保核心浏览体验稳定。
- **部署:** 无额外部署步骤；沿用现有 `npm run check` 与 GitHub Pages 发布流程。
