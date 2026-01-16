# 技术设计: R16 NeoGlass UI & 功能进化

## 技术方案

### 1) NeoGlass 设计系统（CSS Tokens + data-attr 体系）

- 继续使用现有的 `global.css` tokens 与 `[data-card] / [data-pressable]` 语义化属性作为 SSOT。
- 通过重设颜色、阴影、边框与背景层级实现整体风格切换，避免逐组件逐页“手工涂色”。
- 保留 Reduced Motion 与 low-data 降载策略，确保移动端/弱网体验一致。

### 2) Saved Views（保存视图）

- 新增 `savedViews` 本地存储模块：
  - `schemaVersion` + `createdAt/updatedAt` + `scope`（search/rankings 等）
  - `payload` 存储可序列化的筛选条件（例如 Search 的 `q + filters`）
- Search 页面提供：
  - “保存当前视图”对话框（使用 `ui/Dialog` + `ui/TextField`）
  - “应用/删除”已保存视图
- 将新 key 纳入 `dataVault`，保证导入导出覆盖完整。

### 3) Compare Mode（作品对比）

- 新增 `compareStore`：
  - 本地保存对比清单（最多 2 个 animeId）
  - 复用 `useStorageSignal` 触发 UI 更新
- 新增 `/compare` 页面：
  - 顶部提供两个选择器（快速切换对比对象）
  - 并排展示核心指标（年份/集数/评分/人气/工作室/状态/标签等）
  - 提供“交换/清空”操作
- 在 `AnimeCard` 中增加轻量“加入对比”入口（不破坏现有收藏/追更结构）。

### 4) Pinned Tags（常用标签）

- 新增 `pinnedTags` 存储模块（数组 + 去重 + 上限）。
- Tag 页面提供“钉住/取消钉住”按钮；首页/搜索页展示常用标签快捷入口。

### 5) 轻量数据可视化（SVG Mini Charts）

- 新增 `SparkBar` 组件（纯 SVG，无额外依赖）：
  - 输入：`[{ label, value }]`
  - 输出：迷你柱状分布，支持 aria-label 与 reduced motion
- Tag/Category 页面：
  - 基于结果集按 `releaseYear` 生成分布，并渲染为迷你图（帮助快速理解该标签/分类的年代覆盖）。

## GitHub Pages 部署

- `vite.config.js` 中 `base` 改为函数：
  1. 若存在 `process.env.VITE_BASE` / `process.env.BASE_PATH` → 直接使用
  2. 若存在 `process.env.GITHUB_REPOSITORY` → `/${repo}/`
  3. 否则尝试从 `package.json.homepage` 解析路径前缀
  4. 兜底 `/`
- 继续保留 HashRouter，并将 `404.html` 复制到 `dist/`，保障深链刷新。

## 安全与合规

- 不引入外部可疑依赖；不写入任何密钥；所有数据保持 local-first。
- 导出数据默认排除敏感字段（复用现有 `dataVault` redaction 机制）。

## 测试与验证

- 运行 `npm run check`（format/lint/test/build/budget）。
- 重点回归：Search、Tag、AnimeCard、Header/BottomNav、Compare 页基础交互。
