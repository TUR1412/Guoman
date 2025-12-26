# 任务清单: 无限进化协议（视觉系统收敛 + 交互性能进化）

目录: `helloagents/plan/202512270347_infinite_evolution_protocol/`

---

## 1. 视觉系统收敛（Design Tokens → data-attr）

- [√] 1.1 在 `src/assets/styles/global.css` 增加 `data-elev` 阴影层级入口（0-12），并让 `data-card` 使用 `--card-shadow` 变量；同时将 hover/press 位移升级为 `translate/scale`（避免覆盖 `transform`），验证 why.md#需求-视觉系统一致性-场景-阴影层级可控
- [√] 1.2 审计并确认 `src/assets/styles/global.css` 已包含 12 栅格响应式跨度规则（`data-col-span-sm/md/lg/xl` + `data-col-start-*`），验证 why.md#需求-视觉系统一致性-场景-12-栅格响应式跨度
- [√] 1.3 收敛组件层重复的玻璃样式（background/border/box-shadow/backdrop-filter），优先保留布局与差异化装饰，验证 why.md#需求-视觉系统一致性-场景-data-card-容器统一玻璃基座

## 2. 交互性能进化（长列表 60FPS 兜底目标）

- [√] 2.1 在 `src/pages/TagPage.jsx` 与 `src/pages/CategoryPage.jsx` 为大数据量结果自动启用 `VirtualizedGrid`，并在虚拟化模式下降级卡片动效，验证 why.md#需求-长列表性能-场景-tag-category-大数据量自动虚拟滚动

## 3. 安全检查

- [√] 3.1 执行安全检查（不引入敏感信息、不新增危险命令、不破坏 localStorage 结构）

## 4. 文档更新（SSOT 同步）

- [√] 4.1 更新 `helloagents/project.md` 与 `helloagents/wiki/overview.md`：补齐 `data-elev` / 响应式栅格跨度 / 虚拟滚动覆盖面的说明
- [√] 4.2 更新 `helloagents/CHANGELOG.md` 记录本次收敛与性能进化

## 5. 测试

- [√] 5.1 执行 `npm run check`（Prettier → ESLint → Vitest → Build）确保质量闸门通过

## 6. 迁移方案包（强制）

- [√] 6.1 更新本 task.md 状态并迁移到 `helloagents/history/2025-12/202512270347_infinite_evolution_protocol/`，并更新 `helloagents/history/index.md`
