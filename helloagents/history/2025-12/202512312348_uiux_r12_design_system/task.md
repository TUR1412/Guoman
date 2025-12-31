# 任务清单: UI/UX R12 · 设计系统与交互一致性

- [√] 1.1 基线校验：`npm run check` 通过（作为后续门禁）
- [√] 1.2 安全校验：`npm audit` 0 vulnerabilities

- [√] 2.1 新增 `src/ui/Button.jsx`（variants/sizes/disabled/focus-visible）
- [√] 2.2 新增 `src/ui/IconButton.jsx`（Header/toolbar 场景）
- [√] 2.3 更新 `src/ui/index.js` 导出与 Storybook 示例

- [√] 3.1 迁移 `src/components/Banner.jsx` 至 UI Button（减少重复样式）
- [√] 3.2 迁移 `src/components/Login.jsx` 至 UI Button（统一社交登录按钮交互）
- [√] 3.3 迁移 `src/components/NetworkStatusBanner.jsx` 至 UI Button（统一提示条交互）
- [√] 3.4 评估并迁移 `src/components/Header.jsx` 的关键按钮（保持行为不变）

- [√] 4.1 增强 `src/assets/styles/global.css` 的 `:focus-visible` 覆盖

- [√] 5.1 将 `public/robots.txt` 与 `public/sitemap.xml` 视为构建生成物（`.gitignore` + 从 Git 移除，避免 build 产生无意义 diff）
- [-] 5.2 必要时更新 `scripts/seo.test.js`（本轮无需变更）

- [√] 6.1 回归验证：`npm run check` 全绿
- [√] 6.2 同步知识库：`helloagents/CHANGELOG.md`、`helloagents/wiki/overview.md`
- [√] 6.3 迁移方案包：`helloagents/plan/...` → `helloagents/history/2025-12/...` 并更新 `helloagents/history/index.md`
