# 轮询迭代记录（10 次）

> 目标：每次迭代只做一件事（原子级），并以独立 commit 推送到 `master`。
> 日期：2025-12-18（本轮执行）

| 迭代 | Commit     | 原子改进                                                              |
| ---- | ---------- | --------------------------------------------------------------------- |
| 1    | `b5ddc79`  | 构建拆包：`manualChunks` 拆分 vendor，消除大包告警、降低首包压力      |
| 2    | `47aed7d`  | 无障碍：修复 HashRouter 下 skip-link 破坏路由；路由切换聚焦主内容     |
| 3    | `6cc0149`  | Reduced Motion：用户偏好减少动效时禁用页面过渡                        |
| 4    | `b993a75`  | 导航语义：`aria-current="page"` 标注当前页（桌面 + 移动）             |
| 5    | `f0384d5`  | SEO：增加 OG/Twitter 分享卡片元信息 + `public/og.svg`                 |
| 6    | `22c7fff`  | SEO：新增 `robots.txt` 与 `sitemap.xml`（适配 GitHub Pages 子路径）   |
| 7    | `36e953e`  | 工程抽象：分享/复制链接逻辑下沉为 `src/utils/share.js`（含测试）      |
| 8    | `853fbb4`  | 深链兜底：`404.html` 自动识别 GitHub Pages 子路径，兼容自定义域根路径 |
| 9    | `78d403e`  | 性能：空闲时间预取核心路由 chunk（尊重 Save-Data/2G）                 |
| 10   | （本提交） | 文档收口：补齐迭代记录与任务看板（本文件 + README/Task_Status）       |
