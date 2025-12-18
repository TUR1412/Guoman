# 夸克级审计（Quark Audit）

> 目的：以“更细粒度、更可持续、更像产品”的标准，对 **国漫世界（Guoman World）** 做工程与体验的深度审计，并以 **30 次原子迭代（30 commits）** 逐步完成升级。
>
> 原则：
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

