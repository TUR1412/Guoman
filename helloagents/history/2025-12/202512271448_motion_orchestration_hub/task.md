# Task - Motion Orchestration Hub（动效编排中枢）

> 说明：任务状态符号遵循 HelloAGENTS 约定：`[ ]` 待执行 / `[√]` 已完成 / `[X]` 失败 / `[-]` 跳过

## 执行清单

- [√] 新增 `src/motion/`：tokens + presets + useAppReducedMotion
- [√] App 路由转场/幕布改用 presets，并统一 reduced motion 判定
- [√] Modal/Toast/Page 入场动效改用 presets（减少重复调参）
- [√] 全站交互组件将 `useReducedMotion()` 替换为 `useAppReducedMotion()`
- [√] 运行 `npm run check` 回归（格式/静态检查/单测/构建）
- [√] 同步知识库（`helloagents/wiki/*` + `helloagents/CHANGELOG.md`）
- [√] 迁移方案包至 `helloagents/history/2025-12/` 并更新 `helloagents/history/index.md`
