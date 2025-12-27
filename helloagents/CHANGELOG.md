# Changelog

本文件记录项目所有重要变更。
格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 新增

- 视觉系统：新增黄金比例排版/间距变量、12 列响应式栅格工具、0-12 阴影层级，并为 `data-card` 容器统一注入毛玻璃 + 动态渐变边框（hover 动态流光）。
- 加载动效：新增 SVG PathLoader（路径描边动画），并接入开屏与路由 Suspense fallback。
- 搜索进化：Search 页面新增“多级智能筛选面板”（制作方/年份/最低评分/状态/类型/标签）+ 实时搜索预取（idle 缓存）+ 筛选埋点。
- 请求层：新增 `apiClient`（GET 去重、TTL 缓存、5xx/429 重试与退避策略），为未来接入真实 API 做准备。
- PWA：新增 Service Worker 离线缓存，并在检测到新版本时提示用户刷新以应用更新。
- 视觉设置：用户中心新增“视觉设置”面板（纸纹噪点/极光光晕/字号缩放/禁用 blur/强制减少动效），并持久化到本地。
- 组件工作台：新增 `src/ui/` 原语（Container/Stack/Grid/Card/Dialog/Skeleton）与 Storybook（React-Vite）配置 + Stories，便于组件级演示与视觉回归。

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
- 视觉系统：新增 `data-elev="0..12"` 作为阴影层级入口，并将卡片/按钮的 hover/press 位移升级为 `translate/scale`（避免覆盖 `transform`，与 Framer Motion 更好叠加）。
- 样式收敛：移除多处组件内重复的 `data-card` 玻璃基座实现（background/border/box-shadow/backdrop-filter），统一由 `global.css` 驱动。
- 页面性能：Tag/Category 页面在结果量较大时自动启用 `VirtualizedGrid`（并向 `AnimeCard` 传入 `virtualized` 降级入场动效）。
- 细节：长文本采用渐隐遮罩截断（并补齐 `title`），图标基线对齐更稳定（避免视觉偏移）。
- 主题：统一首帧脚本与运行时 `theme-color`，并在未手动选择主题时自动跟随系统主题变化。
- 性能：弱网/省流时自动启用 `data-low-data` 降载模式（降低噪点、禁用卡片 blur、减缓 shimmer）。
- Tokens：噪点/极光强度改为可配置 tokens（支持与 `data-low-data` 叠乘降载），并新增全站字号缩放变量 `--font-scale`。
- 动效：App Shell 的 MotionConfig 支持用户手动强制 reduced motion（等价于 `prefers-reduced-motion`）。
- 动效编排：新增 `src/motion/`（tokens/presets/useAppReducedMotion），将站内视觉设置的“强制减少动效”注入动效分支判定，统一 Route/Page/Modal/Toast 的转场参数。

### 修复

- 海报工坊：修复 SVG 导出调用 `downloadTextFile` 的参数不一致问题。

### 移除

- 依赖：移除 `react-icons`。
