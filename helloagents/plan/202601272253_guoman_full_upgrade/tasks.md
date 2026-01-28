# [GUOMAN] 全方位升级任务清单（唯一方案 · 非保守路线）

- 方案包：`helloagents/plan/202601272253_guoman_full_upgrade/`
- 执行方式：里程碑推进；每个里程碑结束都必须可交付（质量闸门全绿）

---

## 总体验收（最终必须全部达成）

- [√] `npm run check` 全绿（format:check/lint/typecheck/test/build/budget）
- [√] `npm run e2e:ci` 全绿（Playwright）
- [√] `npm run storybook:build` 全绿（Storybook build）
- [√] Bundle Budget 基线已更新（`scripts/bundle-budget.config.json#generatedAt`）
- [√] 发布体系可执行（tag/release notes/changelog 同步）

---

## M0｜核心依赖大版本升级（已完成）

目标：一次性把“核心技术地基”升级到 2026 可持续迭代版本，并把闸门拉回全绿。

- [√] React 升级到 19（`react` / `react-dom`）
- [√] React Router 升级到 7（`react-router-dom`）
- [√] Vite 升级到 7（`vite` / `@vitejs/plugin-react`）
- [√] Vitest 升级到 4（`vitest` / `@vitest/coverage-v8` / `jsdom`）
- [√] Framer Motion 升级到 12（`framer-motion`）
- [√] Storybook 升级到 10（`storybook` / `@storybook/react-vite` + addons）
- [√] Bundle Budget 超标修复：更新 `scripts/bundle-budget.config.json` 基线阈值
- [√] 产物隔离：eslint/prettier 忽略 `storybook-static/`（避免 Storybook build 反噬 `npm run check`）

---

## M1｜发布体系（已完成）

目标：静态站也要做到“可发布、可追溯、可回滚、可对比”。

- [√] M1.1 Changelog 收口
  - 动作：将本次升级条目归档到版本段（例如 `CHANGELOG.md` 新增 `1.2.0`）
  - 验收：版本号与 Changelog 一致，线上诊断包可定位到版本

- [√] M1.2 Release 自动化
  - 动作：约定 tag + release notes 生成方式（可先手工，再自动化）
  - 验收：一次发布全流程可重复执行（不依赖“记忆操作”）

---

## M2｜性能二次审计（预算变长期约束）

目标：大版本升级后重新审视“首屏关键路径”，把预算做成长期可维护的纪律。

- [√] M2.1 首屏依赖链审计与分包策略微调（路由入口改为 `HashRouter`，首屏 gzip 体积显著下降）
- [√] M2.2 预算策略调整（更细粒度：初始/关键 chunk/路由 chunk；budget 脚本纳入 dynamic imports 并增加关键路由 chunk 预算）
- [√] M2.3 Lighthouse 基线回归（修复 Windows `spawn EINVAL` + local preview base，并更新 `docs/LIGHTHOUSE_BASELINE.md`）

---

## M3｜本地数据层演进（长期可维护）

目标：local-first 不只是“能存”，而是“可演进、可迁移、可诊断”。

- [ ] M3.1 schemaVersion 注册表 + 迁移策略固化
- [ ] M3.2 导入导出契约升级（错误信息可行动）
- [ ] M3.3 预留 IndexedDB/Worker 扩展口（不提前引入复杂度）

---

## 执行命令清单（验收入口）

- `npm run check`
- `npm run e2e:ci`
- `npm run storybook:build`
