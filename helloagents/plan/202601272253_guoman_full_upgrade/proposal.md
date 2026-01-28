# [GUOMAN] 全方位升级计划书（唯一方案 · 非保守路线）

- 方案包：`helloagents/plan/202601272253_guoman_full_upgrade/`
- 计划类型：implementation（计划完成后进入落地实施）
- 日期：2026-01-27
- 目标发布：`v1.2.0`（已对齐 `package.json#version`）

---

## 1. 我想把它升级成什么（愿景）

我不做“修修补补”，我要把 Guoman World 升级到 **能长期迭代、能持续交付、能保持世界级审美与工程纪律的产品级前端工程**：

- **持续领先的技术地基**：关键依赖跟上大版本（React / Router / Vite / Vitest / Storybook），但不牺牲稳定性（以 `npm run check` 为硬门槛）。
- **可复现的质量闸门**：每次变更必须在本地与 CI 上可复现（format/lint/typecheck/test/build/budget + e2e）。
- **“产物不污染工程”**：Storybook/Lighthouse/Playwright 这类工具产物永远不反噬 lint/format（忽略规则与目录策略固化）。
- **版本可追溯**：版本号/构建元信息可在诊断包中落地，线上问题能回溯到确定的构建。

> 只做一条路线：**最符合“长期可维护 + 世界级交付 + 不保守”目标的路线**。

---

## 2. 现状基线（以代码/配置为准）

项目当前已经具备“产品级工程”的骨架：质量闸门、E2E、诊断面板、性能预算、CI/CD 都是实打实的资产。

升级落地后，我确认当前基线为：

- 运行时：Node.js `>=22`（本地与 CI 对齐）
- 前端：React 19 + React Router 7（Hash Router，GitHub Pages 友好）
- 构建：Vite 7（base 自动推导 + 手动分包 + build 元信息注入）
- 测试：Vitest 4（单测）+ Playwright（E2E）
- 组件工作台：Storybook 10（React-Vite，Docs/A11y/Vitest/Onboarding addons）
- 门禁：`npm run check`（format:check → lint → typecheck → test → build → bundle budget）

---

## 3. 升级原则（非保守路线的“纪律”）

- **大版本升级优先**：只要收益明确（生态兼容、性能、更长生命周期），就敢升。
- **门禁不妥协**：依赖升级必须把 `check` 拉回全绿；预算超标不是“关掉”，而是“重建基线 + 留出合理余量”。
- **产物隔离**：生成物（`dist/`、`storybook-static/`、`reports/` 等）必须被 lint/format 忽略，避免“开发工具污染工程质量”。
- **文档与代码一致**：文档不“写给自己看”，必须能作为新维护者的真指南。

---

## 4. 目标状态（Target State）

### 4.1 工程与依赖（已落地）

- React 19 / Router 7 / Vite 7 / Vitest 4 / Storybook 10 全量升级并稳定运行
- Bundle Budget 基线已更新（日期与阈值可追溯）
- Storybook build 不再影响 `npm run check`（eslint/prettier 忽略生成目录）
- 发布体系已固化：新增 `release` 工作流 + `docs/RELEASE.md`，并将 `CHANGELOG.md` 归档到 `1.2.0`

### 4.2 接下来可继续拉满的“全方位升级点”（待落地）

我把“可升级点”按价值密度与长期收益排序（只给一个最优顺序）：

1. **性能二次进化**：在 React/Router 大版本后重做一次“首屏关键路径审计”（把预算变成长期可维护的约束，而不是一次性数值）
2. **数据层演进**：对 localStorage store 做 schema/迁移注册表（为 IndexedDB/Worker 预留接口，但不提前复杂化）
3. **A11y 体系化**：Storybook A11y + Vitest 组合成“可自动回归的无障碍闸门”（先覆盖核心 UI primitives）
4. **SEO/分享体验**：为关键页面补齐 Open Graph / 分享海报链路与更强的 meta 策略（在 Hash Router 限制下做最优）

---

## 5. 里程碑路线图（唯一路线）

- **M0（已完成）**：核心依赖大版本升级 + 闸门恢复全绿（含预算基线更新、Storybook 产物隔离）
- **M1（已完成）**：发布体系（版本/Changelog/Release Notes）与基线策略固化
- **M2**：性能二次审计（预算目标重定、分包策略精炼、关键交互 INP 回归）
- **M3**：数据层迁移体系（schemaVersion 注册表 + 导入导出契约升级）
- **M4**：A11y 体系化回归（Storybook A11y + 自动化检查）

---

## 6. 风险清单与对策

- **Bundle 体积回退**（大版本升级常见）
  - 对策：不关预算，更新基线并保留合理余量；再用二次审计把预算“打回去”。
- **Storybook/工具链产物污染 lint**（本地常见坑）
  - 对策：eslint/prettier/gitignore 三重忽略，形成长期稳定的工程约束。
- **Peer deps 冲突**（React/Vite/Storybook 大版本联动）
  - 对策：升级时一次性对齐整条链路（framework + addons + builder），避免半升半留。

---

## 7. 验收标准（Definition of Done）

- `npm run check` 全绿
- `npm run e2e:ci` 全绿
- `npm run storybook:build` 可成功构建（且不污染 `check`）
- 文档/知识库中“技术栈基线”与代码一致（React/Vite/Router/Vitest/Storybook 版本不打架）
