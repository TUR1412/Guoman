# Changelog

本文件记录项目所有重要变更。
格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

- ✅ Command Palette：支持作品/标签/#tag/分类/静态页直达，搜索 action 下沉为兜底项（不抢占首选命令）。
- ✅ Command Palette：高亮/hover action 时 idle 预取目标路由 chunk（更快跳转）。
- ✅ Observability：新增 `src/utils/logger.js` 本地日志模块，并在 `/diagnostics` 增加日志查看/清空/下载；性能监控补齐 INP 指标。
- ✅ 稳定性：新增 `src/utils/lazyWithRetry.js`，路由懒加载 dynamic import 失败自动重试，并记录日志便于排障。
- ✅ Crash Recovery：`AppErrorBoundary` 支持复制/下载诊断包（logs + errors + health snapshot），便于快速提交问题与回溯。
- ✅ Diagnostics：诊断包补齐 build 元信息（版本号/提交 SHA/构建时间），更易定位线上版本。
- ✅ Diagnostics：复制失败自动打开手动复制窗口；浏览器支持时可下载 `.json.gz` 压缩诊断包（更易分享）。
- ✅ Diagnostics：支持导入 `.json` / `.json.gz` 诊断包并解析展示摘要（本地完成，不出网）。
- ✅ PWA：新增 `public/offline.html` 离线兜底页，并升级 Service Worker cache version（确保更新一致性）。

- ✅ 表单体系收敛：新增 `SelectField` / `TextAreaField` / `RangeInput` primitives，并迁移 Search/Favorites/Following/StaticPage/UserCenterPage/AnimeDetail 的表单控件以统一 focus/disabled/invalid 交互。

- ✅ UI 组件库：新增 `TextField`（统一输入外观/label/icon/状态展示，收敛输入交互分叉）。
- ✅ Header：搜索输入迁移到 `TextField`，并将 `navItems` / `HeaderSearch` 渐进拆分到 `src/components/header/`。
- ✅ SearchPage：主搜索输入迁移到 `TextField`（保持 URL 参数与 ESC 清空逻辑不变）。
- ✅ AnimeDetail：观看进度与评论分区模块化到 `src/components/anime/detail/`（`AnimeProgressCard` / `AnimeReviews`），并将 styled-components 定义集中到 `styles.js`，统一“当前集数 / 昵称”输入到 `TextField`。

- ✅ UI 组件库：新增 `Button`/`IconButton` primitives（统一 variants/sizes/disabled/focus）。
- ✅ 交互一致性：Banner / Login / Header / NetworkStatusBanner 关键按钮迁移到 UI primitives。
- ✅ A11y：补齐全局 `:focus-visible` 基线样式（支持键盘导航）。
- ✅ 工程体验：`public/robots.txt` 与 `public/sitemap.xml` 改为构建生成物（避免本地 build 产生无意义 diff）。
- ✅ 质量门禁：修复覆盖率门禁相关失败（补齐关键分支测试，`npm run check` 全绿）。
- ✅ 可测试性：`registerServiceWorker({ forceProd })` 支持注入生产分支以便稳定覆盖。
- ✅ 稳定性：避免 `apiClient` 中未消费的 Promise `finally` 链触发未处理拒绝告警。

### 新增

- 内容洞察引擎：新增 Tag Pulse 标签趋势、Studio Radar 工作室雷达、Audience Pulse 口碑脉冲。
- 观影计划器：结合追更与观看进度生成每日观看预算与完结预测。
- 推荐解释：AnimeCard 新增匹配度与推荐理由标签。
- 详情洞察：AnimeDetail 接入口碑脉冲卡片。
- 视觉系统：新增黄金比例排版/间距变量、12 列响应式栅格工具、0-12 阴影层级，并为 `data-card` 容器统一注入毛玻璃 + 动态渐变边框（hover 动态流光）。
- 加载动效：新增 SVG PathLoader（路径描边动画），并接入开屏与路由 Suspense fallback。
- 搜索进化：Search 页面新增“多级智能筛选面板”（制作方/年份/最低评分/状态/类型/标签）+ 实时搜索预取（idle 缓存）+ 筛选埋点。
- 请求层：新增 `apiClient`（GET 去重、TTL 缓存、5xx/429 重试与退避策略），为未来接入真实 API 做准备。
- PWA：新增 Service Worker 离线缓存，并在检测到新版本时提示用户刷新以应用更新。
- 视觉设置：用户中心新增“视觉设置”面板（纸纹噪点/极光光晕/字号缩放/禁用 blur/强制减少动效），并持久化到本地。
- 组件工作台：新增 `src/ui/` 原语（Container/Stack/Grid/Card/Dialog/Skeleton）与 Storybook（React-Vite）配置 + Stories，便于组件级演示与视觉回归。
- 诊断：新增 UI 诊断页 `/diagnostics`（可视化健康快照 + 可复制/下载诊断包 + 可启停采样）。
- 性能预算：新增 `scripts/bundle-budget.js` + `scripts/bundle-budget.config.json`，并接入 `npm run check` 作为 CI 体积闸门。
- 移动端导航：新增底部 Dock（首页/搜索/收藏/追更/我的），并为主内容/页脚预留安全区（避免遮挡）。

### 变更

- 视觉升级：全站字体与未来感色板升级，Banner/Header/Footer/PageShell 视觉骨架重塑。
- 文档更新：README 重写为双语版本，突出未来感视觉与内容洞察能力。
- Icons：移除 `react-icons` 依赖，改为内置 Feather Icons（更可控、更利于包体优化与缓存命中）。
- 日期时间：抽取 `Intl.DateTimeFormat` 缓存工具，减少重复创建 formatter 的开销与重复代码。
- 去重复：新增 `useStorageSignal` Hook，收敛页面/组件的 storage 监听逻辑并统一 key 过滤策略。
- 构建：Vite/Rollup 调整 tree-shaking 策略（`moduleSideEffects: 'no-external'`）并移除 build 产物中的 legal comments。
- 文档：README 增加「未来进化蓝图」板块，给出 3 个版本的可落地迭代方向。
- 长列表：替换 `VirtualizedGrid` 为真实虚拟滚动窗口化渲染（面向超大数据量更稳）。
- 压缩：用户中心支持导入/导出 `.json.gz`（gzip 压缩）以降低文件体积。
- 诊断：新增控制台健康全景图（`__GUOMAN_HEALTH__.print()` / `__GUOMAN_HEALTH__.start()`），实时观察 LongTask/事件环路/内存趋势等。
- 数据导出：全量/单模块导出默认脱敏（同步 Token 等敏感键默认剔除，可显式包含）。
- 工程：质量闸门 `npm run check` 增加 Bundle Budget（构建后校验首屏依赖链 gzip 体积）。
- 依赖：Storybook 升级到修复版本（消除审计高危项）。
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
