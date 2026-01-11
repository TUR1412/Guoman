# 技术设计: 诊断导出兜底（手动复制 + gzip）

## 技术方案

### 核心技术

- `src/ui/Dialog`：作为兜底弹窗容器
- `src/ui/TextAreaField`：承载可复制的长文本（readOnly）
- `src/utils/share.js`：自动复制（Clipboard API + execCommand 兜底）
- `src/utils/compression.js`：gzip 压缩（CompressionStream）
- `src/utils/download.js`：二进制下载（Blob）

### 实现要点

- `src/components/ManualCopyDialog.jsx`
  - 打开时自动 focus + select 文本（便于 Ctrl/⌘+C）
  - 提供“全选”与“关闭”按钮
  - 支持自定义标题/描述/文本内容
- `src/pages/DiagnosticsPage.jsx`
  - 自动复制失败 → 打开 `ManualCopyDialog`
  - `canGzip()` 为 true 时展示“下载 .gz”
  - 使用 `gzipCompressString` 压缩后校验 gzip header（0x1f 0x8b）
  - 下载使用 `downloadBinaryFile({ mimeType: 'application/gzip' })`
- `src/components/AppErrorBoundary.jsx`
  - 复制失败 → 打开 `ManualCopyDialog`
  - `canGzip()` 为 true 时展示 “下载 .gz” 按钮

## 安全与性能

- **安全:** 仍保持“默认不出网”；导出由用户显式触发；弹窗提示建议脱敏后分享。
- **性能:** gzip 仅在用户点击下载时执行；导出失败会降级为明确提示，不静默失败。

## 测试与部署

- 质量闸门：`npm run check`
- 无额外部署改动：沿用现有 GitHub Actions → Pages 流程
