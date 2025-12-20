# 夸克级审计（Quark Audit）

> 目的：以“更细粒度、更可持续、更像产品”的标准，对 **国漫世界（Guoman World）** 做工程与体验的深度审计，并以 **30 次原子迭代（30 commits）** 逐步完成升级。
>
> 原则：
>
> - 每次迭代只做一件事（原子级），可独立回滚与评审
> - 不启动后台常驻服务；验证只跑 `lint/test/build`（有限热同步）
> - 主题原子性：不出现“只换背景不换文字”的视觉灾难
> - 不在主 UI 裸露 JSON/错误堆栈；错误讲人话

---

## 0. 基线信息（Baseline）

- 框架：React 18 + Vite 6
- 路由：React Router Hash Router（适配 GitHub Pages）
- 样式：styled-components + 全局 Design Tokens（CSS Variables）
- 动效：framer-motion（尊重 `prefers-reduced-motion`）
- 工程：ESLint + Prettier + Vitest（CI 闸门）
- 部署：GitHub Actions → GitHub Pages（`.github/workflows/static.yml`）

---

## 1. 夸克级问题画像（Problems as Atoms）

### 1.1 语义与无障碍（A11y）

典型可改进点（示例）：

- 交互嵌套：`<Link>` 内包 `<button>` 属于无效语义（潜在可访问性/事件问题）
- “只在 hover 可见”的按钮：键盘 Tab 聚焦时可能看不见（可访问性缺陷）
- “筛选/切换”类按钮缺少 `aria-pressed` / `role` 等语义提示（可改进）

### 1.2 主题原子性与视觉一致性（Theme Atomicity）

项目已有主题变量，但仍存在散落的硬编码 `rgba(255,255,255,...) / rgba(0,0,0,...)`：

- 在浅色主题下可能出现对比度偏低或“脏灰”的问题
- 不利于未来统一升级（例如升级为更系统的 Chip/Badge/Button 体系）

### 1.3 可迁移数据（Data Portability）

收藏等状态已做到“刷新不丢”，但还需要：

- **备份/迁移**：导出/导入（合并/覆盖）与格式可演进（schemaVersion）
- **可诊断性**：导入失败时错误信息要可理解、可行动

### 1.4 协作与可持续（Sustainability）

世界级项目不仅要“能跑”，还要“能长期迭代”：

- Issue/PR 模板、安全政策、行为准则、依赖更新策略
- 行尾/格式一致性（Windows/Unix）导致的噪音与 CI 波动需要治理

---

## 2. 30 次原子迭代清单（R4）

> 说明：下面是 30 个“可独立提交”的最小改进单元，完成后会在 `docs/ITERATIONS.md` 中记录 commit。

1. 文档：新增夸克级审计文档（本文件）并定义 30 迭代目标
2. A11y：修复 Banner 的 Link/Button 交互嵌套语义
3. Motion：Banner 尊重 `prefers-reduced-motion`（禁用自动播放/大幅动画）
4. A11y：AnimeCard 收藏按钮在 `:focus-visible` / `:focus-within` 时可见
5. Perf：图片统一补齐 `decoding="async"` 与关键位 `fetchPriority`
6. Theme：补齐 Chip/Badge/Button 的设计变量（dark/light）
7. Theme：News 标签筛选使用 token（替换硬编码 rgba）
8. Theme：Rankings 切换按钮使用 token（替换硬编码 rgba）
9. Theme：AnimeList Tabs 使用 token（替换硬编码 rgba）
10. Theme：About 页链接按钮使用 token（替换硬编码 rgba）
11. Theme：Toast 的 IconWrap/CloseButton 使用 token（替换硬编码 rgba）
12. A11y：筛选按钮补齐 `aria-pressed`（Tag/Toggle 等）
13. UX：移动菜单滚动锁增强（保留滚动位置，避免穿透）
14. A11y：移动菜单加入简单 Focus Trap（Tab 不逃逸）
15. Resilience：404.html catch 分支按 base 回退（避免跳错根路径）
16. Repo：新增 `.gitattributes` 统一 EOL，减少 CRLF/LF 噪音
17. Repo：新增 `.editorconfig`（缩进/换行/编码一致）
18. Build：基于 `package.json#homepage` 生成 `robots.txt`/`sitemap.xml`
19. Build：将生成脚本接入 `npm run build`/CI（避免人工忘记更新）
20. Test：为生成脚本添加最小测试（确保路径/日期格式正确）
21. Ops：新增 Dependabot 配置（npm + GitHub Actions）
22. Ops：新增 CODEOWNERS（协作路由）
23. CI：工作流改为执行 `npm run check`（单一真源）
24. CI：增加 workflow 触发策略（PR 也跑闸门）
25. Docs：README 补齐“安全/贡献/行为准则”入口与说明
26. Docs：新增 CHANGELOG（面向发布的版本记录）
27. Docs：补齐“设计变量/组件规范”说明（Design Tokens）
28. UX：EmptyState 支持使用 React Router 的 `Link`（避免不必要刷新）
29. A11y：细化表单/控件的 label/description 关联（更可读）
30. Docs：收口更新 `docs/ITERATIONS.md`（追加 R4 30 次迭代记录）

---

## 3. 30 次原子迭代清单（R5 · 2025-12-19）

1. SEO：新增 `pageMeta`，统一管理标题/描述
2. SEO：`PageShell` 自动注入页面 Meta
3. UX：新增最近浏览存储与工具层
4. UX：最近浏览独立组件（带清空入口）
5. UX：详情页记录最近浏览
6. UX：首页展示最近浏览
7. 搜索：Header 搜索与 URL 参数同步
8. 搜索：Header 搜索表单语义 + 自动完成关闭
9. A11y：主内容 `role="main"` + 加载提示语义
10. A11y：`PageShell` 区域语义与标题关联
11. 搜索：搜索页支持清空按钮与 ESC 快捷清除
12. 搜索：搜索页自动聚焦 + 输入框/按钮 tokens 化
13. Theme：新增 `primary-soft` 系列 tokens
14. Theme：搜索/找回密码/空状态按钮统一 tokens
15. Theme：收藏页按钮统一 tokens
16. Theme：详情页按钮/标签统一 tokens
17. A11y：AnimeGrid/AnimeCard 列表语义补齐
18. A11y：资讯列表语义补齐 + 空状态兜底
19. A11y：收藏计数区域 `aria-live` 提示
20. A11y：最近浏览区域语义与描述绑定
21. Motion：首页尊重 `prefers-reduced-motion`
22. Motion：Features 尊重 `prefers-reduced-motion`
23. UX：详情页无播放链接时禁用入口
24. A11y：Toast Host 增加 `aria-atomic`
25. Test：新增 `recentlyViewed` 基线测试
26. Test：新增 `pageMeta` 基线测试
27. Docs：README 一级美化与结构重写
28. Docs：ARCHITECTURE 补齐 Meta/最近浏览说明
29. Docs：DESIGN_TOKENS 补齐主色柔和 tokens
30. Docs：QUARK_AUDIT + ITERATIONS 追加 R5 记录

---

## 4. 50 次原子迭代清单（R6 · 2025-12-20）

1. 视觉：新增墨韵国风主色/副色/点缀色 tokens
2. 视觉：新增字体 tokens（正文/标题）并落地
3. 视觉：全局背景升级为墨韵 + 极光 Mesh
4. 视觉：新增控制类 tokens（control/progress/overlay）
5. 资源：引入 ZCOOL XiaoWei / Noto Serif SC 标题字体
6. 缓存：更新 favicon/manifest 版本号
7. Banner：遮罩改为 `--hero-overlay`
8. Banner：分页/导航按钮 tokens 化
9. Banner：CTA 渐变升级 + 阴影强化
10. Banner：新增“题签式”标签
11. Features：改为 Bento Grid 排布
12. Features：卡片 hover/边框 tokens 化
13. Features：图标改为“印章质感”胶囊
14. AnimeCard：收藏按钮 tokens 化
15. AnimeCard：收藏状态高亮统一
16. AnimeCard：新增观看进度浮层
17. ContinueWatching：新增组件骨架
18. Home：接入“继续观看”入口
19. watchProgress：新增持久化工具层
20. watchProgress：新增事件订阅/跨页同步
21. watchProgress：新增单元测试基线
22. AnimeDetail：新增观看进度面板
23. AnimeDetail：集数输入与进度滑块
24. AnimeDetail：快捷进度按钮（半程/追到最新）
25. AnimeDetail：进度清空入口
26. AnimeDetail：封面遮罩 tokens 化
27. AnimeList：查看更多按钮 tokens 化
28. Header：主题切换按钮 tokens 化
29. Header：移动登录按钮 hover tokens 化
30. Footer：社交按钮 tokens 化
31. EmptyState：图标渐变使用 accent tokens
32. NewsPage：卡片 hover 边框 tokens 化
33. NewsDetail：标签底色 tokens 化
34. ForgotPassword：成功提示 tokens 化
35. Toast：状态色 tokens 化
36. AppErrorBoundary：按钮/代码块 tokens 化
37. About：标题下划线渐变升级
38. About：数据数字改为金色强调
39. About：CTA 阴影与 hover 优化
40. Global：新增 success/info/warning 语义色 tokens
41. Global：新增 overlay/progress tokens
42. Global：标题字体统一为 display font
43. Global：背景噪点 + 纸张光晕层级化
44. Global：body 渐变强化暗/亮主题对比度
45. Docs：ARCHITECTURE 补齐观看进度说明
46. Docs：DESIGN_TOKENS 补齐新 tokens 说明
47. Docs：新增 1000 微任务清单
48. Task_Status：更新 R6 执行清单
49. ContinueWatching：区域语义与 aria-live 说明
50. AnimeCard：进度条对比度优化

---

## 5. 250 次原子迭代清单（R7 · 2025-12-20）

> 本轮采用“批次化”落地策略：详见 `docs/QUARK_BATCH_R7_250.md`（0001-0250）。

已落地（批次收口摘要）：

1. 主题层：新增 stamp/divider/scrollbar + text-on-primary/text-on-dark/品牌色 tokens
2. 全局质感：纸张纹理、光晕渐变、阴影体系收敛并通过 WCAG 对比度校验
3. Header：导航/搜索/操作区分区（Bento 栅格）
4. Banner：主视觉拆分 + 右侧速览卡（含节奏与阅读焦点）
5. AnimeDetail：封面/信息区 12 栅格重排 + 进度卡强化
6. Features/About/Footer/PageShell：统一 Bento 层级与焦点密度
7. 登录/找回密码：双栏结构 + 权益/安全提示侧栏
8. NewsDetail：正文 + 侧栏信息卡 + 分享入口
9. EmptyState/AppErrorBoundary/StaticPage/Toast：布局重组与视觉层级强化
10. R7 批次 0001-0250 全量落地完成（详见 QUARK_BATCH_R7_250）
