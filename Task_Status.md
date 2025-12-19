# [GUOMAN-WORLD2-20251219-R5] 任务看板

> **环境**: Windows 11 + pwsh (-NoLogo -NoProfile wrapper) | **框架**: React + Vite | **档位**: 4档 (架构重构)
> **已激活矩阵**: [模块 A: 视觉矫正] + [模块 B: 逻辑直通] + [模块 E: 幽灵防御] + [模块 F: 需求镜像/靶向验证]

## 1. 需求镜像 (Requirement Mirroring)

> **我的理解**: 对 `TUR1412/Guoman` 进行**夸克级审计 → 修复 → 升级扩展**，并完成 **30 次原子迭代** 记录；同步提升体验/可访问性/工程化/SEO，完成 **GitHub Markdown 一级美化**。全部完成后 **推送到** `origin/master`，随后 **安全删除本地克隆目录**（以你的本机实际路径为准，例如：`C:\Users\Kong\Downloads\Guoman`）。
> **不做什么**: 不后台启动长期驻留服务（dev server）；不抢占端口；不在主 UI 裸露 JSON/错误堆栈；不提交敏感信息；不引入必须依赖后端的功能（保持静态站可独立运行）。

## 2. 审计发现 (Atomic Findings)

- [!] **SEO**：SPA 页面标题/描述不随路由更新。
- [!] **体验**：缺少“最近浏览”入口，回到首页后无法继续探索。
- [!] **搜索**：Header 搜索未与 URL 查询参数同步，刷新/回退易割裂。
- [!] **可访问性**：主内容/列表语义与加载状态提示不够完整。
- [!] **一致性**：部分按钮仍使用硬编码 `rgba`，主题原子性需进一步收口。

## 3. 执行清单 (Execution)

- [x] 新增页面 Meta 管理（标题/描述随路由更新）
- [x] 最近浏览：记录 + 首页展示 + 清空入口
- [x] 搜索体验：Header 与 URL 同步，搜索页支持清空/ESC
- [x] 可访问性：`role="main"`、`aria-live`、列表语义补齐
- [x] 主题一致性：引入 `primary-soft` tokens 并替换硬编码 rgba
- [x] 动效降级：首页/Features 尊重 `prefers-reduced-motion`
- [x] 新增测试：`pageMeta` + `recentlyViewed` 基线
- [x] 文档与 MD 美化：README/迭代/架构/审计更新
- [x] 有限热同步验证：`npm ci` → `npm run lint` → `npm run test` → `npm run build`
- [ ] 推送至 `origin/master`
- [ ] 物理断点确认后删除本地克隆目录