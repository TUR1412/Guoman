# 技术设计: 诊断回放（导入 .json / .json.gz）

## 技术方案

### 核心技术

- `src/pages/DiagnosticsPage.jsx`：导入入口与摘要展示
- `src/utils/diagnosticsImport.js`：文件解码（JSON / gzip）与 schema 校验
- `src/utils/compression.js`：gzip 解压（DecompressionStream）
- `src/utils/share.js` + `src/components/ManualCopyDialog.jsx`：复制失败兜底
- `src/utils/download.js`：导入包下载为 `.json`

### 实现要点

#### 1) 文件导入与解码

- 使用 `<input type="file">` 选择本地文件，不触发任何网络请求。
- 读取 `file.arrayBuffer()` 得到 `Uint8Array`。
- gzip 判断逻辑：
  - 文件名后缀 `.gz` 或 magic header `0x1f 0x8b`
  - 若判断为 gzip 且 `canGzip()` 为 false → 直接提示“无法解压”
  - 否则走 `gzipDecompressToString`（非 gzip 会自然降级为 TextDecoder 解码）

#### 2) 诊断包 schema 校验

- `parseDiagnosticsBundleText(text)` 负责解析 JSON 并做最小必要字段校验：
  - `schemaVersion` 合法
  - `logs`/`errors` 必须是数组

#### 3) UI 展示与操作

- 展示导入摘要（文件/大小/build/日志与错误数量），避免用户必须打开原始 JSON 才能定位线索。
- 提供复制/下载入口，并复用 `ManualCopyDialog` 作为剪贴板不可用时的兜底。

## 测试与部署

- 新增 `src/utils/diagnosticsImport.test.js` 覆盖：
  - gzip 不可用时的明确失败分支
  - JSON 与 gzip JSON 的解码成功
  - schema 校验分支
- 质量闸门：`npm run check`
