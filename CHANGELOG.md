# Changelog

本项目遵循“原子级迭代”原则：每个 commit 尽量只做一件事，方便回滚与审查。

## [Unreleased]

- 命令面板升级：支持作品/标签/#tag/分类/静态页直达，搜索 action 作为兜底项保留（不抢占首选命令）
- 命令面板性能：高亮/hover 时 idle 预取目标路由 chunk，Enter 跳转更快
- 可观测性：新增本地日志模块（log store），诊断面板支持日志查看/清空/下载，性能卡片补齐 INP 指标
- 稳定性：路由懒加载动态 import 失败自动重试，并将异常写入本地日志（便于诊断与回溯）
- 崩溃兜底：ErrorBoundary 支持复制/下载诊断包（logs + errors + health snapshot），便于快速提交问题
- 诊断包增强：补齐 build 元信息（版本号/提交 SHA/构建时间），便于定位线上版本并回溯
- 诊断导出增强：复制失败自动打开手动复制窗口；浏览器支持时可下载 `.json.gz` 压缩诊断包（更易分享）
- PWA：新增 `public/offline.html` 离线兜底页，并升级 Service Worker cache version（确保离线导航更可控）
- 未来感 UI 重塑：Space Grotesk + Chakra Petch 字体体系与深浅主题色板升级
- 内容洞察引擎：新增 Tag Pulse 标签趋势、Studio Radar 工作室雷达、Audience Pulse 口碑脉冲
- 观影计划器：结合追更与观看进度计算剩余时长与每日观看预算
- 推荐解释升级：卡片新增匹配度与推荐理由

- 墨韵国风 UI 升级：新字体与极光背景
- 视觉系统强化：黄金比例排版/间距变量 + 12 列响应式栅格 + data-card 全局毛玻璃/动态渐变边框 + 0-12 阴影层级
- 加载动效：新增 SVG PathLoader（路径描边动画），接入开屏与路由加载状态
- 观看进度：集数 + 进度条 + 继续观看入口
- PWA：Service Worker 离线缓存 + 新版本可用提示
- Tokens 收口：控制/状态色/Overlay 统一
- 批次优化：PageShell 徽章/Meta、搜索热门标签、资讯 Bento 首卡
- 搜索历史：最近搜索记录与一键清空
- 搜索进化：Search 页面新增高级筛选（制作方/年份/评分/状态/类型/标签）+ 实时搜索预取缓存 + 埋点细化
- 收藏/分类/标签：新增排序切换
- 资讯详情：分享入口
- Icons 熵减：移除 react-icons，内置 Feather Icons（减少依赖面）
- 时间格式化：缓存 Intl.DateTimeFormat，收敛重复实现
- 长列表引擎：Search 页面改为“真实虚拟滚动”渲染（窗口化 DOM，滚动更稳）
- 数据传输压缩：用户中心支持导入/导出 gzip 压缩包（.json.gz）
- 工程自诊断：控制台健康全景图 `__GUOMAN_HEALTH__.print()`（LongTask/事件环路/内存/本地占用）
- 可视化诊断页：新增 `/diagnostics`（UI 快照 + 复制/下载诊断包 + 可启停采样）
- 数据导出安全：全量导出默认脱敏（同步 Token 等敏感键默认剔除，可显式包含）
- 性能预算闸门：新增 `npm run budget:bundle` 并接入 `npm run check`（CI 自动守住首屏体积）
- 依赖安全：Storybook 升级到修复版本（消除审计高危项）
- 移动端导航：新增底部 Dock（首页/搜索/收藏/追更/我的），单手操作更顺畅
- UI 交互：统一过渡曲线与 press feedback（避免 transition: all 的抖动），弹窗/Toast/提示条使用一致的 easing
- 细节修复：长文本改为渐隐遮罩截断（hover 可看 title），图标基线对齐更稳定
- 主题细化：theme-color 与首帧脚本统一，并在“未手动选择主题”时跟随系统主题变化
- 视觉设置：用户中心新增纸纹/极光/字号缩放/禁用玻璃 blur/强制减少动效（本地保存，可导出）
- 修复：海报工坊导出 SVG 使用 `downloadTextFile` 的参数不一致问题
- 省流降载：检测到 Save-Data/2G 时自动启用 low-data 模式（降低噪点/禁用卡片 blur/减缓 shimmer）
- 请求层预备：新增 `apiClient`（GET 去重、TTL 缓存、5xx/429 重试 + 退避），为未来接入真实 API 做准备

## [1.1.0] - 2025-12-19

- 新增「最近浏览」：记录最近访问作品，回到首页继续探索
- 动态 SEO：页面标题/描述自动更新，体验更接近多页应用
- 搜索体验：Header 搜索与 URL 查询参数同步
- A11y：主内容与路由加载状态补齐语义

## [1.0.0] - 2025-12-18

- 初始发布：React + Vite + Hash Router（GitHub Pages 适配）
- 主题原子性：深/浅主题 + 首帧初始化（减少闪烁）
- 对象恒常性：收藏/主题等状态本地持久化
- 工程化：ESLint + Prettier + Vitest + GitHub Actions 闸门
