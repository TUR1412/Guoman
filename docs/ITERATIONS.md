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
