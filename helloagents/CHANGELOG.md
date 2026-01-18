# Changelog

本文件记录项目所有重要变更。
格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

- ✅ Saved Views：Search 页面新增“保存/应用/删除”搜索视图（关键词 + 高级筛选一键复用，Local-first）。
- ✅ Compare Mode：新增作品对比页 `/compare`，支持从 AnimeCard 一键加入/移除并并排对比关键指标（Data Vault 已纳入导入导出）。
- ✅ Pinned Tags：标签页支持一键钉住/取消钉住，首页新增“常用标签”快捷入口（Local-first）。
- ✅ Mini Insights：标签页新增年份分布 SparkBar（纯 SVG，轻量可视化）。
- ✅ GitHub Pages：`vite.config.js` base 支持自动推导与环境变量覆盖，配合 Hash Router + `404.html` 深链兜底。
- ✅ 质量与洁癖：清除所有 `console.*`，统一走本地 `logger/errorReporter`，并升级 ESLint 为完全禁止 `console.*`。

- UI：为 Header/ Footer 的 Logo 入口补齐 `data-pressable` 物理微交互与 `:focus-visible` 光环，增强可点击反馈与键盘可达性（保持业务逻辑不变）。
- UI：为 Banner「剧集速览」卡片引入 `data-pointer-glow` 指针辉光（尊重 reduced motion），增强“玻璃层级 + 光谱”视觉纵深（保持业务逻辑不变）。
- UI：增强 `[data-card]` 的键盘可达性微交互：`:focus-within` 时同步触发边框渐变 位移，确保非 hover 场景也具备清晰的层级反馈（保持业务逻辑不变）。
- UI：为 `html` 引入 `scrollbar-gutter: stable` 与滚动条配色/宽度策略，并同步 `html::-webkit-scrollbar*` 规则，减少弹窗打开/关闭导致的布局跳动并统一滚动条质感（保持业务逻辑不变）。
- UI：为滚动条 Thumb 增加 hover/active 质感（hover-safe），并补齐 `--scrollbar-thumb-hover/active` tokens，提升细节触感与层次（保持业务逻辑不变）。
- UI：增强 `usePointerGlow` 的触屏点击反馈：在 `pointerdown` 时写入辉光坐标并点亮 active，且在离开/抬起时仅熄灭 active，避免 fade-out 期间辉光“跳位”（保持业务逻辑不变）。
- UI：将 `usePointerGlow` 的 pointer-glow 事件监听做成 touch-safe（忽略 touch 的 `pointermove`，并在非 mouse 的 `pointerup/pointercancel` 时复位），避免触屏/触控笔导致辉光粘滞（保持业务逻辑不变）。
- UI：为 `src/ui/TextField` / `SelectField` / `TextAreaField` 增加 hover-safe 的边框/背景/图标反馈，并补齐 disabled cursor 语义（保持业务逻辑不变）。
- UI：将 AnimeCard 收藏/追更按钮的“父级 hover 显示”限制为 hover 设备，并为 `(hover: none) and (pointer: coarse)` 设备默认常显，避免触屏 hover 粘滞同时保证入口可见（保持业务逻辑不变）。

- UI：将 Header 导航/登录入口的 hover 视觉反馈限制为 hover 设备（`(hover: hover) and (pointer: fine)`），避免触屏 hover 粘滞（保持业务逻辑不变）。

- UI：批量将多页面/多组件的 hover 视觉反馈限制为 hover 设备（`(hover: hover) and (pointer: fine)`），避免触屏 hover 粘滞（保持业务逻辑不变）。

- UI：将 AnimeDetail 关键操作按钮（Watch/Secondary/Tag/Comment）的 hover 视觉反馈限制为 hover 设备（`(hover: hover) and (pointer: fine)`），避免触屏 hover 粘滞（保持业务逻辑不变）。

- UI：将 `src/ui/Button` 的 hover 视觉反馈限制为 hover 设备（`(hover: hover) and (pointer: fine)`），避免触屏 hover 粘滞（保持业务逻辑不变）。

- UI：为 `src/ui/Button` 引入“光泽 Sheen”覆盖层（hover/focus-visible 触发）与轻微 press 质感（filter），强化按钮的层级与触感（保持业务逻辑不变）。

- UI：修复移动端首页 Banner 在小屏下内容被裁切的问题（提升小屏 banner 高度并调整内容底部间距，保持业务逻辑不变）。

- UI：为 `[data-pressable]` 补齐 `:focus-visible` 光环与 disabled 光标语义（cursor），提升键盘可达性与可点击反馈一致性（保持业务逻辑不变）。

- UI：升级 `[data-pressable]` 物理微交互为变量驱动（`--pressable-*`），支持 X/Y offset、hover 距离与 active scale，并仅在 hover 设备启用 hover 反馈（避免触屏粘滞 hover），保持逻辑不变。
- UI：将按钮/卡片/详情相关推荐封面的 hover 位移/缩放动效统一限制为 hover 设备（`(hover: hover) and (pointer: fine)`），修复触屏设备 hover 粘滞导致的“误浮起/误缩放”。
- UI：补齐 danger 状态色 Tokens（`--danger-*`），并将表单/Diagnostics 的错误态颜色与进度轨道从硬编码收敛为 token（保持业务逻辑不变）。
- UI：补齐遮罩层级 Tokens（`--overlay-soft` / `--overlay-medium` / `--overlay-strong`），并统一导航/庆祝层的遮罩与动效入口（保持业务逻辑不变）。
- UI：视觉体系升级为 Vercel/Apple 风格（中性精致的主题色板、Mesh 背景、统一的微交互与弹簧动效预设）。

- CI：新增 GitHub Actions `quality.yml` 工作流（lint/format:check/test/build/budget:bundle），为 push/PR 提供质量闸门
- CI：新增 GitHub Actions `lighthouse.yml` 手动工作流（remote/local）并上传 `reports/` artifact，便于回归对比

- ✅ Command Palette：支持作品/标签/#tag/分类/静态页直达，搜索 action 下沉为兜底项（不抢占首选命令）。
- ✅ Command Palette：高亮/hover action 时 idle 预取目标路由 chunk（更快跳转）。
- ✅ Observability：新增 `src/utils/logger.js` 本地日志模块，并在 `/diagnostics` 增加日志查看/清空/下载；性能监控补齐 INP 指标。
- ✅ 稳定性：新增 `src/utils/lazyWithRetry.js`，路由懒加载 dynamic import 失败自动重试，并记录日志便于排障。
- ✅ Crash Recovery：`AppErrorBoundary` 支持复制/下载诊断包（logs + errors + health snapshot），便于快速提交问题与回溯。
- ✅ Diagnostics：诊断包补齐 build 元信息（版本号/提交 SHA/构建时间），更易定位线上版本。
- ✅ Diagnostics：复制失败自动打开手动复制窗口；浏览器支持时可下载 `.json.gz` 压缩诊断包（更易分享）。
- ✅ Diagnostics：支持导入 `.json` / `.json.gz` 诊断包并解析展示摘要（本地完成，不出网）。
- ✅ Diagnostics：新增日志/错误浏览器（关键词检索、级别筛选、展开详情、下载筛选结果）并支持拖拽导入诊断包。
- ✅ Diagnostics：导入回放增强：导入诊断包后可直接浏览导入的 logs/errors（筛选/检索/展开/下载筛选结果），无需复制 JSON 手动排查。
- ✅ Diagnostics：事件回放增强：诊断包新增 `events`（本地埋点事件），诊断面板支持本地/导入事件浏览器（事件名筛选、展开 payload、下载筛选结果）。
- ✅ Diagnostics：本地/导入时间线：新增 breadcrumbs 聚合时间线（logs/errors/events），支持类型筛选/关键词检索/下载筛选结果，并支持一键定位到对应浏览器。
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
- ✅ Lighthouse Baseline：升级 `npm run lighthouse:baseline`，支持 remote/local 自动生成报告（HTML/JSON）与得分基线摘要（按需 `npx`，避免 CI 依赖膨胀）。
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
