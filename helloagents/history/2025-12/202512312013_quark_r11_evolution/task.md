# 任务清单: Quark R11 · 深度递归进化（视觉系统 + 质量门禁）

目录: `helloagents/plan/202512312013_quark_r11_evolution/`

---

## 1. 覆盖率门禁（Quality Gate）

- [√] 1.1 为 `src/utils/formatBytes.js` 补齐单测与分支覆盖，验证 why.md#需求-覆盖率门禁达标-场景-ci本地执行覆盖率- [√] 1.2 为 `src/utils/datetime.js` 补齐单测与边界覆盖（时区/空值/格式化），验证 why.md#需求-覆盖率门禁达标-场景-ci本地执行覆盖率- [√] 1.3 为 `src/utils/healthConsole.js` 补齐单测（日志 gating/快照结构），验证 why.md#需求-覆盖率门禁达标-场景-ci本地执行覆盖率- [√] 1.4 为 `src/utils/serviceWorker.js` 补齐单测（注册/更新/降级策略，使用 mock navigator），验证 why.md#需求-覆盖率门禁达标-场景-ci本地执行覆盖率- [√] 1.5 增强 `src/utils/animeFilterEngine.test.js` 覆盖典型筛选组合与边界条件，提升 branches 覆盖率，验证 why.md#需求-覆盖率门禁达标-场景-ci本地执行覆盖率- [√] 1.6 增强 `src/utils/apiClient.test.js` 覆盖错误分支与重试/超时策略（如有），验证 why.md#需求-覆盖率门禁达标-场景-ci本地执行覆盖率- [√] 1.7 增强 `src/utils/compression.test.js` 覆盖失败分支（输入异常/环境不支持），验证 why.md#需求-覆盖率门禁达标-场景-ci本地执行覆盖率- [√] 1.8 增强 `src/utils/download.test.js` 覆盖更多分支（兼容性/异常/回退），验证 why.md#需求-覆盖率门禁达标-场景-ci本地执行覆盖率- [√] 1.9 补齐 `src/utils/theme.test.js` 与 `src/utils/visualSettings.test.js` 的阈值缺口（lines/functions/branches），验证 why.md#需求-覆盖率门禁达标-场景-ci本地执行覆盖率- [√] 1.10 增强 `src/components/NetworkStatusBanner.test.jsx` 覆盖关键状态分支（online/offline/恢复提示），验证 why.md#需求-覆盖率门禁达标-场景-ci本地执行覆盖率

## 2. 视觉系统深化（UI/UX Evolution）

- [ ] 2.1 在 `src/ui/` 增加 tokens 映射/读取入口（避免硬编码色值/间距），验证 why.md#需求-视觉系统可复用与一致-场景-通用组件状态一致
- [ ] 2.2 强化基础组件（如 Card/Dialog/Skeleton）对状态与变体的支持（hover/active/focus/disabled/loading），验证 why.md#需求-视觉系统可复用与一致-场景-通用组件状态一致
- [ ] 2.3 动效遵循 reduced-motion：在关键微交互处接入 `prefers-reduced-motion` 降级策略，验证 why.md#需求-视觉系统可复用与一致-场景-通用组件状态一致

## 3. 可维护性重构（Large File Decomposition）

- [ ] 3.1 拆分 `src/components/AnimeDetail.jsx`：将视图/逻辑/子区块拆成可复用子组件，保持行为一致，验证 why.md#需求-大组件可维护性提升-场景-animedetail-可拆分而不破坏功能
- [ ] 3.2 拆分 `src/components/Header.jsx`：提取导航/搜索/用户状态等子模块，降低耦合并提升复用性，验证 why.md#需求-大组件可维护性提升-场景-animedetail-可拆分而不破坏功能

## 4. 依赖升级策略（Roadmap + Guardrails）

- [ ] 4.1 形成升级矩阵（版本/风险/迁移点/回归门禁），并按 ADR-001 分批执行第一批“低风险高收益”升级
- [ ] 4.2 每批次升级后执行 `npm run check` + `npm run test:coverage` + Storybook build（如纳入门禁），确保可回滚

## 5. 安全检查

- [ ] 5.1 执行安全检查（按G9: 输入验证、敏感信息处理、EHRB风险规避）

## 6. 文档更新

- [ ] 6.1 更新 README 与 docs：补充“设计系统/动效/质量门禁/升级策略”说明与 Mermaid 架构图

## 7. 测试

- [ ] 7.1 执行并确保通过：`npm run check`
- [ ] 7.2 执行并确保通过：`npm run test:coverage`
