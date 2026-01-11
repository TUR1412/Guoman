# 技术设计: Diagnostics Timeline Explorer（导入回放聚合时间线）

## 技术方案

### 核心技术

- React 18 + styled-components
- 复用 Diagnostics Explorer 的交互范式：filters → summary → records → download

### 实现要点

1. **归一化模型（本地计算，不改 schema）**
   - log → `{ kind:'log', at, level, message, source, context, raw }`
   - error → `{ kind:'error', at, message, source, stack, raw }`
   - event → `{ kind:'event', at, name, payload, raw }`
   - 将 `raw` 保留为原始对象，用于下载时尽量保持完整信息

2. **过滤策略**
   - `kind`：all / log / error / event
   - `query`：小写 trim 后全文检索（message/source/context/stack/name/payload）

3. **导出策略**
   - 下载筛选结果为 JSON 数组（normalized record），包含 `kind/at` 等字段，便于后续二次处理

4. **页面集成**
   - `DiagnosticsPage`：仅在 `importedBundle` 存在时渲染“导入时间线”卡片
   - 保持原有 `导入错误/日志/事件浏览器` 不变

## 安全与性能

- **安全:** 不新增上传；导出仍为用户主动下载；文档提示脱敏。
- **性能:** `useMemo` 缓存归一化与过滤结果；分页展示；展开详情延迟渲染。

## 测试与部署

- **单测:** `DiagnosticsTimelineExplorer.test.jsx` 覆盖：
  - 类型筛选与关键词筛选
  - 下载回调收到的 filtered records
- **质量闸门:** `npm run check`
- **部署:** 复用现有 GitHub Actions，无需变更
