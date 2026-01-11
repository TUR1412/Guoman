# 变更提案: 诊断导出兜底（手动复制 + gzip）

## 需求背景

诊断能力的价值在于“用户能交付、维护能定位”。但在部分环境中会遇到两个常见限制：

1. **剪贴板写入受限**：某些浏览器/隐私模式/权限策略会拒绝 `navigator.clipboard.writeText`，导致“一键复制”失败。
2. **诊断包体积偏大**：诊断 JSON 在包含日志、错误与快照时可能较大，不利于在 IM/工单系统中分享或留档。

为提升在真实环境中的可用性，需要提供更稳健的导出兜底：

- 复制失败时自动打开“手动复制”窗口（可选中后 Ctrl/⌘+C）
- 在浏览器支持 gzip 时提供 `.json.gz` 压缩诊断包下载（体积更小，便于分享）

## 变更内容

1. 新增通用组件 `ManualCopyDialog`：用于在剪贴板写入失败时提供手动复制入口
2. 诊断页与崩溃兜底页接入手动复制兜底
3. 诊断页与崩溃兜底页增加 gzip 压缩诊断包下载（可用时展示）
4. 文档同步：补齐诊断导出能力说明

## 影响范围

- **模块:** Diagnostics / Crash Recovery / UX
- **文件:**
  - `src/components/ManualCopyDialog.jsx`
  - `src/pages/DiagnosticsPage.jsx`
  - `src/components/AppErrorBoundary.jsx`
  - `docs/DIAGNOSTICS.md`

## 核心场景

### 需求: 复制失败兜底

**模块:** Diagnostics

#### 场景: 浏览器不允许写入剪贴板

- 点击“复制 JSON/复制诊断”后，如果无法自动复制
- 自动打开“手动复制”弹窗，并默认全选内容

### 需求: 压缩诊断包下载

**模块:** Diagnostics

#### 场景: 诊断信息需要低成本分享

- 浏览器支持 gzip 时，提供 `.json.gz` 下载按钮
- 文件体积更小，更适合在 IM/工单/邮件中传递

## 风险评估

- **风险:** gzip 下载依赖浏览器 `CompressionStream`；部分环境可能存在 API 但执行失败。
- **缓解:** 仅在检测支持时展示，并对导出结果做 gzip header 校验，失败时给出明确提示。
