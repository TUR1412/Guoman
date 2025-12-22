# [GUOMAN-WORLD4-20251220-R10] 任务看板

> **环境**: Windows 11 + pwsh (-NoLogo -NoProfile wrapper) | **框架**: React + Vite | **档位**: 4档 (架构重构)
> **已激活矩阵**: [模块 A: 视觉矫正] + [模块 B: 逻辑直通] + [模块 E: 幽灵防御] + [模块 F: 需求镜像/靶向验证]
> **最后更新**: 2025-12-22 | **最新提交**: 999b43e (已推送 origin/master)

## 1. 需求镜像 (Requirement Mirroring)

> **我的理解**: 启动 **R10 批次 250 条** 原子级改造（对应 `docs/QUARK_BACKLOG_1000.md` 的 0751-1000），重点推进 **路由拆分与预取、性能与 SEO 工程、数据持久化与导入导出、用户中心能力** 的全量覆盖。本轮 **暂不推送、暂不删除** 本地仓库（等待你后续指令）。
> **不做什么**: 不后台启动长期驻留服务（dev server）；不抢占端口；不在主 UI 裸露 JSON/错误堆栈；不提交敏感信息；不引入必须依赖后端的功能（保持静态站可独立运行）；不在未授权情况下推送/删除仓库。

> **补充（第二轮递归进化）**: 聚焦 **微交互** + **深层性能压榨** + **单测覆盖率极限拉升**；允许推送；明确 **取消删除本地克隆**。
>
> **补充（视觉与功能裂变模式 123）**: 聚焦“更惊艳的微交互”：收藏页 **拖拽排序 + 分组拖放**、成就解锁 **全屏庆祝叠层**、全局 **Pointer Glow**（RAF 节流避免 React 重渲染）；并补齐 README 动效演示与单测。明确：**不删除本地仓库**，允许推送。

> **补充（全路径融合飞升模式）**: 合并 A/B/D 与潜在优化项：以“渲染成本压榨”为主线（减少不必要重渲染与事件监听数量），并增强“电影级转场”观感；所有改动保持 reduced-motion 护栏与质量闸门闭环。

## 2. 审计发现 (Atomic Findings)

- [!] **性能工程**：路由 chunk 拆分、图片/字体加载策略、CLS 监控与虚拟滚动预案。
- [!] **SEO 工程**：结构化数据、OG/Twitter、sitemap/robots 刷新。
- [!] **业务持久化**：观看进度/收藏/搜索/评论/通知/反馈全量本地化。

## 3. 执行清单 (Execution)

- [x] 生成 R10 250 批次清单（docs/QUARK_BATCH_R10_250.md）
- [x] 工程：路由拆分与 hover/idle 预取、bundle 报告与 SVG 优化
- [x] 性能：CLS/LCP/FID 监控 + 虚拟滚动预案 + 关键图片占位
- [x] SEO：结构化数据 + OG/Twitter + sitemap/robots 刷新
- [x] 业务：用户中心 + 全量本地持久化 + 导入/导出
- [x] R10 批次进度：已完成 250 / 250（详见 docs/QUARK_BATCH_R10_250.md）
- [x] 第二轮递归进化：微交互（路由转场 / Tab 指示器 / 收藏按钮动效）+ 渲染优化（memo/索引/事件去重）
- [x] 第二轮递归进化：Vitest 覆盖率阈值生效（per-file）+ 覆盖率极限拉升（utils ≈ 99%）
- [x] 视觉与功能裂变（123）：收藏页自定义排序（Reorder 拖拽）+ 拖拽到分组（Chip Drop）
- [x] 视觉与功能裂变（123）：成就解锁全屏庆祝叠层（Combo + Confetti 多点爆发）
- [x] 视觉与功能裂变（123）：Pointer Glow（CSS 变量 + RAF 节流 + reduced-motion 护栏）
- [x] 文档：README 新增动效演示图（收藏 Drag & Drop / Pointer Glow）
- [x] 单测：新增 `usePointerGlow` / `ConfettiBurst` 覆盖
- [x] 全路径融合飞升：watchProgress 订阅单例化（O(1) window listeners）+ 兼容 `guoman:storage`
- [x] 全路径融合飞升：收藏拖拽排序持久化降噪（拖拽中仅更新 draft，DragEnd 才写入 localStorage）
- [x] 全路径融合飞升：路由转场电影级升级（spring + curtain overlay，reduced-motion safe）
- [x] 已推送到远程：origin/master（commit 999b43e）
- [x] 本地仓库保留（用户已取消删除）
