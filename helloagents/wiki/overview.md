# 国漫世界（Guoman World）

> 本文件包含项目级别的核心信息。更完整的项目文档与展示素材见仓库 `docs/` 与根目录 `README.md`。

---

## 1. 项目概述

### 目标与背景

“国漫世界”是一个面向国漫爱好者的纯前端静态站，主打墨韵国风与玻璃拟态的视觉体系，并采用本地优先（Local-first）策略保存用户数据（收藏、追更、观看进度等）。

### 范围

- **范围内:** 国漫内容浏览（模拟数据/可替换 API）、收藏与分组、追更提醒、搜索与推荐、观影计划器、内容洞察（Tag Pulse / Studio Radar / Audience Pulse）、海报生成、足迹与成就、PWA 离线体验。
- **范围外:** 服务端鉴权与真实支付、跨端同步、多用户协作、生产级后台管理。

---

## 2. 模块索引

| 模块名称            | 职责                                                                      | 状态   | 文档                                                                                                                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App Shell / Router  | 路由组织、页面加载、布局骨架                                              | ✅稳定 | `README.md` / `docs/ARCHITECTURE.md`                                                                                                                                                                                                                        |
| UI Components       | 组件库、可访问性、交互一致性（含 UI 原语与 Stories）                      | ✅稳定 | `src/components/`<br/>`src/ui/`<br/>`.storybook/`                                                                                                                                                                                                           |
| Design System       | 12 栅格/阴影层级（data-elev）/黄金比例排版/玻璃容器（data-card）          | ✅稳定 | `src/assets/styles/global.css`                                                                                                                                                                                                                              |
| Motion System       | Framer Motion 动效预设（Route/Page/Modal/Toast）+ Reduced Motion 策略收敛 | ✅稳定 | `src/motion/` + `src/App.jsx`                                                                                                                                                                                                                               |
| Visual Settings     | 用户可调视觉参数（噪点/极光/blur/字号）                                   | ✅稳定 | `src/utils/visualSettings.js`                                                                                                                                                                                                                               |
| Local-first Data    | localStorage 数据层、队列写入、导入导出                                   | ✅稳定 | `src/utils/`                                                                                                                                                                                                                                                |
| Search Intelligence | 多级筛选引擎 + 实时搜索预取 + 虚拟滚动（Search/Tag/Category）             | ✅稳定 | `src/utils/animeFilterEngine.js` + `src/pages/SearchPage.jsx` + `src/pages/TagPage.jsx` + `src/pages/CategoryPage.jsx`                                                                                                                                      |
| Content Insights    | 标签趋势/工作室雷达/观众口碑脉冲                                          | ✅稳定 | `src/utils/contentInsights.js`<br/>`src/pages/RecommendationsPage.jsx`<br/>`src/pages/InsightsPage.jsx`<br/>`src/components/anime/detail/AudiencePulse.jsx`                                                                                                 |
| Watch Planner       | 观影计划器：剩余时长与每日观看预算                                        | ✅稳定 | `src/utils/watchPlanner.js`<br/>`src/pages/FollowingPage.jsx`                                                                                                                                                                                               |
| API Client          | 通用请求层：重试 + 去重 + 缓存策略                                        | ✅稳定 | `src/utils/apiClient.js`                                                                                                                                                                                                                                    |
| PWA                 | Service Worker 离线缓存与更新提示                                         | ✅稳定 | `public/sw.js` + `src/utils/serviceWorker.js`                                                                                                                                                                                                               |
| Diagnostics         | 控制台健康全景图 + UI 诊断页（支持导入/导出诊断包）                       | ✅稳定 | `src/utils/healthConsole.js`<br/>`src/utils/buildInfo.js`<br/>`src/utils/diagnosticsBundle.js`<br/>`src/utils/diagnosticsImport.js`<br/>`src/pages/DiagnosticsPage.jsx`<br/>`src/components/AppErrorBoundary.jsx`<br/>`src/components/ManualCopyDialog.jsx` |
| Build & Deploy      | Vite 构建、Bundle Budget 闸门、GitHub Actions 部署                        | ✅稳定 | `docs/DEPLOYMENT.md`<br/>`scripts/bundle-budget.js`<br/>`scripts/bundle-budget.config.json`                                                                                                                                                                 |

---

## 3. 快速链接

- [技术约定](../project.md)
- [架构设计](arch.md)
- [项目 README](../../README.md)

## 质量门禁（本地）

- `npm run check`：一键执行 `format:check` + `lint` + `test` + `build` + `budget:bundle`。
- 覆盖率门禁（需要时）：`npm run test:coverage`。
- `npm audit`：如遇镜像源不支持 audit endpoint，可用 `npm audit --registry="https://registry.npmjs.org/"` 获取完整结果。

## UI 组件库（Design System）

- 入口：`src/ui/index.js`
- Primitives：`Button`、`IconButton`、`TextField`、`SelectField`、`TextAreaField`、`RangeInput`（统一 variants/sizes/disabled/focus-visible/表单交互一致性）
- 约定：页面/组件优先复用 primitives，避免重复声明 `styled.button` 导致交互分叉
- 渐进式模块化：`Header` 相关拆分组件放在 `src/components/header/`，对外入口仍为 `src/components/Header.jsx`
- 命令面板入口：`src/components/header/paletteActions.jsx` 统一收口 Command Palette actions（支持作品/标签/#tag/分类/静态页直达）
- 命令面板预取：`src/components/CommandPalette.jsx` 在高亮/hover action 时读取 `prefetchPath` 并调用 `src/utils/routePrefetch.js` 提前加载目标路由 chunk（提升跳转响应）
- 日志监控（Local-first）：`src/utils/logger.js` 记录关键行为与异常线索，并在 `/diagnostics` 支持查看/清空/下载日志（不出本地）
- 性能指标：`src/utils/performance.js` 采集 CLS/LCP/FID，并补齐 INP（用于交互体验诊断）
- 路由容错：`src/utils/lazyWithRetry.js` 为 route lazy 加载提供失败重试，并将异常写入日志（应对弱网/缓存不一致导致的 chunk 加载失败）
- 崩溃兜底：`src/components/AppErrorBoundary.jsx` 提供“复制/下载诊断包”入口（logs + errors + health snapshot），便于快速提交问题
- 诊断回放：`src/pages/DiagnosticsPage.jsx` 支持导入 `.json` / `.json.gz` 诊断包并展示摘要，便于对照排障（不出网）
- 分类映射 SSOT：`src/data/categoryMap.js`（分类 slug → 标签映射，被 CategoryPage 与命令面板共同复用）
- 渐进式模块化：`AnimeDetail` 拆分组件放在 `src/components/anime/detail/`（`AnimeProgressCard`、`AnimeReviews`、`styles.js`），对外入口仍为 `src/components/AnimeDetail.jsx`
- 表单一致性：Search/Favorites/Following 的 Select、StaticPage/UserCenterPage 的反馈输入、AnimeDetail 的评分/评论/进度滑条已收敛到 `TextField`/`SelectField`/`TextAreaField`/`RangeInput`；后续新增输入优先复用 primitives，避免原生控件样式与交互分叉

## 构建生成物

- `public/robots.txt`、`public/sitemap.xml` 为 `npm run build` 的 `prebuild` 阶段生成物，已从 Git 移除并加入 `.gitignore`。
- PWA 离线兜底页：`public/offline.html` 由 Service Worker 在离线导航时作为 fallback 返回（配合 `public/sw.js` precache）
