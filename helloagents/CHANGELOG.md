# Changelog

本文件记录项目所有重要变更。
格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 新增

- PWA：新增 Service Worker 离线缓存，并在检测到新版本时提示用户刷新以应用更新。

### 变更

- Icons：移除 `react-icons` 依赖，改为内置 Feather Icons（更可控、更利于包体优化与缓存命中）。
- 日期时间：抽取 `Intl.DateTimeFormat` 缓存工具，减少重复创建 formatter 的开销与重复代码。
- 去重复：新增 `useStorageSignal` Hook，收敛页面/组件的 storage 监听逻辑并统一 key 过滤策略。
- 构建：Vite/Rollup 调整 tree-shaking 策略（`moduleSideEffects: 'no-external'`）并移除 build 产物中的 legal comments。
- 文档：README 增加「未来进化蓝图」板块，给出 3 个版本的可落地迭代方向。
- 长列表：替换 `VirtualizedGrid` 为真实虚拟滚动窗口化渲染（面向超大数据量更稳）。
- 压缩：用户中心支持导入/导出 `.json.gz`（gzip 压缩）以降低文件体积。
- 诊断：新增控制台健康全景图（`__GUOMAN_HEALTH__.print()` / `__GUOMAN_HEALTH__.start()`），实时观察 LongTask/事件环路/内存趋势等。
- UI：全局过渡从 `transition: all` 收敛为可控属性集合，并统一弹窗/Toast/提示条的 easing 曲线。
- 细节：长文本采用渐隐遮罩截断（并补齐 `title`），图标基线对齐更稳定（避免视觉偏移）。
- 主题：统一首帧脚本与运行时 `theme-color`，并在未手动选择主题时自动跟随系统主题变化。

### 修复

- 海报工坊：修复 SVG 导出调用 `downloadTextFile` 的参数不一致问题。

### 移除

- 依赖：移除 `react-icons`。
