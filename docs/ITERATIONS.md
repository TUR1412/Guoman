# 轮询迭代记录（每轮 10 次）

> 目标：每次迭代只做一件事（原子级），并以独立 commit 推送到 `master`。
> 日期：2025-12-18（R1 + R2 + R3）

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
