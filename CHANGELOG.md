# Changelog

本项目遵循“原子级迭代”原则：每个 commit 尽量只做一件事，方便回滚与审查。

## [Unreleased]

- 墨韵国风 UI 升级：新字体与极光背景
- 观看进度：集数 + 进度条 + 继续观看入口
- PWA：Service Worker 离线缓存 + 新版本可用提示
- Tokens 收口：控制/状态色/Overlay 统一
- 批次优化：PageShell 徽章/Meta、搜索热门标签、资讯 Bento 首卡
- 搜索历史：最近搜索记录与一键清空
- 收藏/分类/标签：新增排序切换
- 资讯详情：分享入口
- Icons 熵减：移除 react-icons，内置 Feather Icons（减少依赖面）
- 时间格式化：缓存 Intl.DateTimeFormat，收敛重复实现
- 长列表引擎：Search 页面改为“真实虚拟滚动”渲染（窗口化 DOM，滚动更稳）
- 数据传输压缩：用户中心支持导入/导出 gzip 压缩包（.json.gz）
- 工程自诊断：控制台健康全景图 `__GUOMAN_HEALTH__.print()`（LongTask/事件环路/内存/本地占用）

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
