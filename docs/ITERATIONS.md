# 轮询迭代记录（原子级提交）

> 目标：每次迭代只做一件事（原子级），并以独立 commit 推送到 `master`。
> 日期：2025-12-18（R1 + R2 + R3 + R4） / 2025-12-19（R5）

## 第 1 轮（R1）

| 迭代 | Commit    | 原子改进                                                              |
| ---- | --------- | --------------------------------------------------------------------- |
| 1    | `b5ddc79` | 构建拆包：`manualChunks` 拆分 vendor，消除大包告警、降低首包压力      |
| 2    | `47aed7d` | 无障碍：修复 HashRouter 下 skip-link 破坏路由；路由切换聚焦主内容     |
| 3    | `6cc0149` | Reduced Motion：用户偏好减少动效时禁用页面过渡                        |
| 4    | `b993a75` | 导航语义：`aria-current="page"` 标注当前页（桌面 + 移动）             |
| 5    | `f0384d5` | SEO：增加 OG/Twitter 分享卡片元信息 + `public/og.svg`                 |
| 6    | `22c7fff` | SEO：新增 `robots.txt` 与 `sitemap.xml`（适配 GitHub Pages 子路径）   |
| 7    | `36e953e` | 工程抽象：分享/复制链接逻辑下沉为 `src/utils/share.js`（含测试）      |
| 8    | `853fbb4` | 深链兜底：`404.html` 自动识别 GitHub Pages 子路径，兼容自定义域根路径 |
| 9    | `78d403e` | 性能：空闲时间预取核心路由 chunk（尊重 Save-Data/2G）                 |
| 10   | `5cfcf52` | 文档收口：补齐迭代记录与任务看板（本文件 + README/Task_Status）       |

## 第 2 轮（R2）

| 迭代 | Commit     | 原子改进                                                            |
| ---- | ---------- | ------------------------------------------------------------------- |
| 1    | `e12c774`  | SEO：补齐 canonical + `og:site_name`                                |
| 2    | `58fd32d`  | 无障碍：移动菜单支持 Esc 关闭，并在打开后聚焦搜索框                 |
| 3    | `2073136`  | CI/格式：增加 `format:check` 并兼容 CRLF/LF（`endOfLine: auto`）    |
| 4    | `20cd1fd`  | 工程脚本：新增 `npm run check`（format + lint + test + build）      |
| 5    | `0b50a6f`  | 无障碍：Footer 社交外链补齐 `aria-label/title`                      |
| 6    | `9d4daae`  | 性能：关键图片补齐 `loading/decoding/fetchPriority`                 |
| 7    | `9982607`  | 无障碍：表单/移动菜单语义补齐（`aria-expanded`、`autocomplete` 等） |
| 8    | `ca84e4b`  | SEO：新增 `site.webmanifest` 并在 `index.html` 引用                 |
| 9    | `9f5be94`  | 缓存：为 `favicon.svg` / `site.webmanifest` 增加版本号参数          |
| 10   | （本提交） | 文档收口：追加第 2 轮迭代记录                                       |

## 第 3 轮（R3）

| 迭代 | Commit    | 原子改进                                                       |
| ---- | --------- | -------------------------------------------------------------- |
| 1    | `34b2e7c` | 收藏备份：新增导出/导入（合并/覆盖）+ 解析与测试基线           |
| 2    | `81a18b8` | 快捷键：`Ctrl/⌘ + K` 聚焦搜索（桌面/外接键盘）                 |
| 3    | `62c4f8a` | 协作模板：Issue/PR 模板 + `SECURITY.md` + `CODE_OF_CONDUCT.md` |

## 第 4 轮（R4 · 夸克级 30 次）

| 迭代 | Commit     | 原子改进                                    |
| ---- | ---------- | ------------------------------------------- |
| 1    | `7e06919`  | 文档：新增夸克级审计与 30 次迭代清单        |
| 2    | `451ce5a`  | A11y：修复 Banner CTA 交互嵌套语义          |
| 3    | `74271e8`  | Motion：Banner 尊重“减少动效”偏好           |
| 4    | `d5b55e0`  | A11y：AnimeCard 收藏按钮键盘聚焦可见        |
| 5    | `564fa75`  | Perf：图片补齐 `decoding="async"`           |
| 6    | `0e52ef6`  | Theme：新增 tokens + 主色 RGB（消除硬编码） |
| 7    | `9cf00a5`  | Theme：资讯标签切换使用 Chip tokens         |
| 8    | `613942b`  | Theme：排行榜 Toggle/Badge 使用 tokens      |
| 9    | `288275c`  | Theme：AnimeList Tabs 使用 tokens           |
| 10   | `6d7476f`  | Theme：About 页按钮使用 tokens              |
| 11   | `755b584`  | Theme：Toast 组件使用 tokens                |
| 12   | `31d411b`  | A11y：筛选/切换按钮补齐 `aria-pressed`      |
| 13   | `00869fb`  | UX：移动菜单滚动锁增强（保留滚动位置）      |
| 14   | `93324bc`  | A11y：移动菜单 Focus Trap（Tab 不逃逸）     |
| 15   | `3452eac`  | Resilience：404 兜底回退到相对路径          |
| 16   | `79d079d`  | Repo：添加 `.gitattributes` 统一换行        |
| 17   | `ad364f4`  | Repo：添加 `.editorconfig`                  |
| 18   | `3fd4626`  | Build：新增 sitemap/robots 生成脚本         |
| 19   | `1eec72c`  | Build：接入 prebuild 自动生成 SEO 文件      |
| 20   | `b0aaf51`  | Test：SEO 生成脚本基线覆盖                  |
| 21   | `b9fa4b7`  | Ops：添加 Dependabot 配置                   |
| 22   | `e915ada`  | Ops：添加 CODEOWNERS                        |
| 23   | `6b63093`  | CI：用 `npm run check` 作为单一闸门         |
| 24   | `b1be61a`  | CI：PR 也运行闸门，push 才部署 Pages        |
| 25   | `ee7c805`  | Docs：README 补齐安全与社区入口             |
| 26   | `fcee6eb`  | Docs：新增 CHANGELOG                        |
| 27   | `b8779cf`  | Docs：补齐 Design Tokens 规范               |
| 28   | `5beb8fb`  | UX：EmptyState 支持 Router Link 导航        |
| 29   | `042ca7d`  | A11y：补齐 sr-only 与描述关联               |
| 30   | （本提交） | 文档：追加第 4 轮迭代记录                   |

## 第 5 轮（R5 · 夸克级 30 次）

| 迭代 | Commit     | 原子改进 |
| ---- | ---------- | ---------------------------------------------- |
| 1    | （本提交） | SEO：新增 `pageMeta`，统一管理标题/描述         |
| 2    | （本提交） | SEO：`PageShell` 自动注入页面 Meta             |
| 3    | （本提交） | UX：新增最近浏览存储与工具层                   |
| 4    | （本提交） | UX：最近浏览独立组件（带清空入口）             |
| 5    | （本提交） | UX：详情页记录最近浏览                         |
| 6    | （本提交） | UX：首页展示最近浏览                            |
| 7    | （本提交） | 搜索：Header 搜索与 URL 参数同步               |
| 8    | （本提交） | 搜索：Header 搜索表单语义 + 自动完成关闭       |
| 9    | （本提交） | A11y：主内容 `role=\"main\"` + 加载提示语义     |
| 10   | （本提交） | A11y：`PageShell` 区域语义与标题关联            |
| 11   | （本提交） | 搜索：搜索页支持清空按钮与 ESC 快捷清除        |
| 12   | （本提交） | 搜索：搜索页自动聚焦 + 输入框/按钮 tokens 化    |
| 13   | （本提交） | Theme：新增 `primary-soft` 系列 tokens         |
| 14   | （本提交） | Theme：搜索/找回密码/空状态按钮统一 tokens      |
| 15   | （本提交） | Theme：收藏页按钮统一 tokens                    |
| 16   | （本提交） | Theme：详情页按钮/标签统一 tokens               |
| 17   | （本提交） | A11y：AnimeGrid/AnimeCard 列表语义补齐          |
| 18   | （本提交） | A11y：资讯列表语义补齐 + 空状态兜底             |
| 19   | （本提交） | A11y：收藏计数区域 `aria-live` 提示             |
| 20   | （本提交） | A11y：最近浏览区域语义与描述绑定                |
| 21   | （本提交） | Motion：首页尊重 `prefers-reduced-motion`       |
| 22   | （本提交） | Motion：Features 尊重 `prefers-reduced-motion` |
| 23   | （本提交） | UX：详情页无播放链接时禁用入口                  |
| 24   | （本提交） | A11y：Toast Host 增加 `aria-atomic`             |
| 25   | （本提交） | Test：新增 `recentlyViewed` 基线测试            |
| 26   | （本提交） | Test：新增 `pageMeta` 基线测试                  |
| 27   | （本提交） | Docs：README 一级美化与结构重写                 |
| 28   | （本提交） | Docs：ARCHITECTURE 补齐 Meta/最近浏览说明       |
| 29   | （本提交） | Docs：DESIGN_TOKENS 补齐主色柔和 tokens         |
| 30   | （本提交） | Docs：QUARK_AUDIT + ITERATIONS 追加 R5 记录     |

## 第 6 轮（R6 · 夸克级 50 次）

| 迭代 | Commit     | 原子改进 |
| ---- | ---------- | ---------------------------------------------- |
| 1    | （本提交） | 视觉：新增墨韵国风主色/副色/点缀色 tokens         |
| 2    | （本提交） | 视觉：新增字体 tokens（正文/标题）并落地           |
| 3    | （本提交） | 视觉：全局背景升级为墨韵 + 极光 Mesh              |
| 4    | （本提交） | 视觉：新增 control/progress/overlay tokens        |
| 5    | （本提交） | 资源：引入 ZCOOL XiaoWei / Noto Serif SC         |
| 6    | （本提交） | 缓存：更新 favicon/manifest 版本号               |
| 7    | （本提交） | Banner：遮罩改为 `--hero-overlay`                |
| 8    | （本提交） | Banner：分页/导航按钮 tokens 化                   |
| 9    | （本提交） | Banner：CTA 渐变升级 + 阴影强化                   |
| 10   | （本提交） | Banner：新增“题签式”标签                          |
| 11   | （本提交） | Features：改为 Bento Grid 排布                   |
| 12   | （本提交） | Features：卡片 hover/边框 tokens 化              |
| 13   | （本提交） | Features：图标改为“印章质感”胶囊                  |
| 14   | （本提交） | AnimeCard：收藏按钮 tokens 化                    |
| 15   | （本提交） | AnimeCard：收藏状态高亮统一                      |
| 16   | （本提交） | AnimeCard：新增观看进度浮层                      |
| 17   | （本提交） | ContinueWatching：新增组件骨架                   |
| 18   | （本提交） | Home：接入“继续观看”入口                         |
| 19   | （本提交） | watchProgress：新增持久化工具层                  |
| 20   | （本提交） | watchProgress：新增事件订阅/跨页同步             |
| 21   | （本提交） | watchProgress：新增单元测试基线                  |
| 22   | （本提交） | AnimeDetail：新增观看进度面板                    |
| 23   | （本提交） | AnimeDetail：集数输入与进度滑块                  |
| 24   | （本提交） | AnimeDetail：快捷进度按钮（半程/追到最新）        |
| 25   | （本提交） | AnimeDetail：进度清空入口                        |
| 26   | （本提交） | AnimeDetail：封面遮罩 tokens 化                  |
| 27   | （本提交） | AnimeList：查看更多按钮 tokens 化                |
| 28   | （本提交） | Header：主题切换按钮 tokens 化                   |
| 29   | （本提交） | Header：移动登录按钮 hover tokens 化             |
| 30   | （本提交） | Footer：社交按钮 tokens 化                       |
| 31   | （本提交） | EmptyState：图标渐变使用 accent tokens           |
| 32   | （本提交） | NewsPage：卡片 hover 边框 tokens 化              |
| 33   | （本提交） | NewsDetail：标签底色 tokens 化                   |
| 34   | （本提交） | ForgotPassword：成功提示 tokens 化               |
| 35   | （本提交） | Toast：状态色 tokens 化                          |
| 36   | （本提交） | AppErrorBoundary：按钮/代码块 tokens 化          |
| 37   | （本提交） | About：标题下划线渐变升级                        |
| 38   | （本提交） | About：数据数字改为金色强调                      |
| 39   | （本提交） | About：CTA 阴影与 hover 优化                     |
| 40   | （本提交） | Global：新增 success/info/warning 语义色 tokens  |
| 41   | （本提交） | Global：新增 overlay/progress tokens             |
| 42   | （本提交） | Global：标题字体统一为 display font              |
| 43   | （本提交） | Global：背景噪点 + 纸张光晕层级化                |
| 44   | （本提交） | Global：主题背景提升对比度                       |
| 45   | （本提交） | Docs：ARCHITECTURE 补齐观看进度说明              |
| 46   | （本提交） | Docs：DESIGN_TOKENS 补齐新 tokens 说明           |
| 47   | （本提交） | Docs：新增 1000 微任务清单                       |
| 48   | （本提交） | Task_Status：更新 R6 执行清单                    |
| 49   | （本提交） | ContinueWatching：区域语义与 aria-live 提示      |
| 50   | （本提交） | AnimeCard：进度条对比度优化                      |

## 第 7 轮（R7 · 夸克级 250 次）

| 迭代 | Commit     | 原子改进 |
| ---- | ---------- | ---------------------------------------------- |
| 1    | （本提交） | 批次开启：生成 R7 250 清单文档                 |
| 2    | （本提交） | PageShell：新增徽章/Meta 行与装饰光晕          |
| 3    | （本提交） | 全局：新增 stamp/divider/scrollbar tokens      |
| 4    | （本提交） | 排行榜：Top3 卡片加入封面遮罩                  |
| 5    | （本提交） | 搜索页：热门标签快选                           |
| 6    | （本提交） | 收藏页：显示最近更新时间                       |
| 7    | （本提交） | 资讯列表：首卡放大（Bento）                    |
| 8    | （本提交） | 继续观看：时间提示                             |
| 9    | （本提交） | 最近浏览：数量提示                             |
| 10   | （本提交） | 多页面：新增 badge 元信息                       |
| 11   | （本提交） | 排行榜：Top3 卡片可点击跳转详情                |
| 12   | （本提交） | 搜索页：新增搜索历史与清空入口                 |
| 13   | （本提交） | 收藏页：新增排序切换                           |
| 14   | （本提交） | 分类页：新增排序切换                           |
| 15   | （本提交） | 标签页：新增排序切换                           |
| 16   | （本提交） | 资讯详情：新增分享入口                         |
| 17   | （本提交） | 搜索页：热门标签点击同步历史                   |
| 18   | （本提交） | Theme：新增主色阴影/文字光晕/禁用态 tokens     |
| 19   | （本提交） | Theme：CTA/登录/详情按钮阴影统一为 tokens      |
| 20   | （本提交） | Theme：EmptyState/PageShell 渐变 tokens 化     |
| 21   | （本提交） | Theme：WCAG AA 对比度增强（文本/边框/控件）    |
| 22   | （本提交） | Theme：滚动条/徽章/卡片对比度提升              |
| 23   | （本提交） | Glass：AnimeCard/Features/Login 增强玻璃层级   |
| 24   | （本提交） | Glass：AnimeDetail 详情块统一 blur 层          |
| 25   | （本提交） | Theme：新增 pill 圆角 token 并替换硬编码       |
| 26   | （本提交） | Theme：统一圆角等级（卡片/标签/输入/滚动条）   |
| 27   | （本提交） | Theme：surface tokens 注入纸张纹理渐变         |
| 28   | （本提交） | Theme：surface-ink/surface-glass 质感升级      |
| 29   | （本提交） | Theme：优化 divider/hero/app-bg 渐变过渡       |
| 30   | （本提交） | Theme：新增背景光晕层以提升层次                |
| 31   | （本提交） | Theme：新增 shadow-ring token 并替换徽标阴影   |
| 32   | （本提交） | Theme：阴影体系收敛到单一 token 集             |
| 33   | （本提交） | Layout：AnimeGrid 启用 Bento 栅格与焦点规则    |
| 34   | （本提交） | Layout：分类/标签/收藏/搜索/排行落地 Bento     |
| 35   | （本提交） | Layout：资讯列表 Bento 化并强化首卡焦点        |
| 36   | （本提交） | Header：导航/搜索/操作分区重构（Bento）        |
| 37   | （本提交） | Banner：主视觉拆分 + 右侧速览卡                |
| 38   | （本提交） | AnimeDetail：封面/信息区 12 栅格重排           |
| 39   | （本提交） | Features：升级 12 栅格并重设跨度规则           |
| 40   | （本提交） | About：数据统计改为 Bento 卡片                 |
| 41   | （本提交） | Footer：品牌卡片强化 + 栅格对齐                |
| 42   | （本提交） | PageShell：标题区升级 12 栅格布局              |
| 43   | （本提交） | Login：双栏 Bento + 权益侧栏                   |
| 44   | （本提交） | ForgotPassword：表单/提示双卡布局              |
| 45   | （本提交） | NewsDetail：正文 + 侧栏信息卡                  |
| 46   | （本提交） | EmptyState：图标/内容栅格重排                  |
| 47   | （本提交） | AppErrorBoundary：主信息 + 快速排查侧栏        |
| 48   | （本提交） | StaticPage：内容卡片 Bento 网格                |
| 49   | （本提交） | Toast：提示卡片升级为 12 栅格                  |
| 50   | （本提交） | Tokens：新增反白文字 + 社交品牌色              |

## 第 8 轮（R8 · 夸克级 250 次）

| 迭代 | Commit     | 原子改进 |
| ---- | ---------- | ---------------------------------------------- |
| 1    | （本提交） | 批次开启：生成 R8 250 清单文档                 |
| 2    | （本提交） | 设计 tokens：新增排版/行高层级变量             |
| 3    | （本提交） | 设计 tokens：新增微间距 spacing 变量           |
| 4    | （本提交） | 全组件字号/行高替换为 tokens                   |
| 5    | （本提交） | 全组件 padding/gap 替换为 spacing tokens       |
| 6    | （本提交） | 全组件：Divider 标记与 Card/Pressable 统一     |
| 7    | （本提交） | 全局：Hover/Active/Disabled 统一交互状态        |
| 8    | （本提交） | 全局：响应式断点缩放（spacing/header/字号）     |
| 9    | （本提交） | Motion：stagger/视差/点击反馈统一机制           |
| 10   | （本提交） | 路由：LayoutGroup + 页面 layout 动效贯通       |
| 11   | （本提交） | A11y：列表语义/aria-selected/控件标签补齐      |
| 12   | （本提交） | UI：修复若干间距/拼写/样式异常                  |

## 第 9 轮（R9 · 夸克级 250 次）

| 迭代 | Commit     | 原子改进 |
| ---- | ---------- | ---------------------------------------------- |
| 1    | （本提交） | 批次开启：生成 R9 250 清单文档                 |
| 2    | （本提交） | Motion：prefers-reduced-motion 全量覆盖        |
| 3    | （本提交） | Motion：关键 CTA shimmer/focus-guide 补齐      |
| 4    | （本提交） | 体验：骨架淡入与滚动定位柔性过渡               |
| 5    | （本提交） | 体验：图片加载渐显与动效性能稳定               |
| 6    | （本提交） | A11y：Header/搜索表单 label 关联补齐           |
| 7    | （本提交） | A11y：登录/找回密码/详情表单 label 补齐         |
| 8    | （本提交） | A11y：列表语义与描述关联完善                   |
| 9    | （本提交） | A11y：EmptyState/Toast/ErrorBoundary 语义补齐  |
| 10   | （本提交） | UI：多页面 CTA 统一 shimmer/focus 引导         |

## 第 10 轮（R10 · 夸克级 250 次）

| 迭代 | Commit     | 原子改进 |
| ---- | ---------- | ---------------------------------------------- |
| 1    | （本提交） | 批次开启：生成 R10 250 清单文档                |
| 2    | （本提交） | 工程：路由 chunk 拆分 + hover/idle 预取        |
| 3    | （本提交） | 性能：CLS/LCP/FID 监控与关键图片占位           |
| 4    | （本提交） | SEO：结构化数据 + OG/Twitter + sitemap 更新    |
| 5    | （本提交） | 资源：字体预连接/预加载与 SVG 优化脚本         |
| 6    | （本提交） | 工具：Bundle 报告 + Lighthouse 基线生成        |
| 7    | （本提交） | 业务：用户中心与本地数据仓库导入导出            |
| 8    | （本提交） | 业务：收藏分组/评论/通知/反馈持久化             |
| 9    | （本提交） | 体验：空状态引导与虚拟滚动预案                  |
| 10   | （本提交） | 测试：新增数据仓库/缓存单元测试                |
