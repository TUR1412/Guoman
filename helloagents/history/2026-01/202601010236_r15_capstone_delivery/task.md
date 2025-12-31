# 任务清单: R15 封顶交付（表单体系收敛 + 依赖升级）

目录: `helloagents/plan/202601010236_r15_capstone_delivery/`

---

## 1. UI 表单 primitives 补全（src/ui）

- [√] 1.1 新增 `src/ui/SelectField.jsx` + Storybook：统一 select 外观/状态，验证 why.md#需求-表单交互一致性（封顶）-场景-用户使用筛选器（搜索-追更-收藏）
- [√] 1.2 新增 `src/ui/TextAreaField.jsx` + Storybook：统一 textarea 外观/状态，验证 why.md#需求-表单交互一致性（封顶）-场景-用户提交反馈（静态页-用户中心）
- [√] 1.3 新增 `src/ui/RangeInput.jsx` 并导出：统一 range 基础外观，验证 why.md#需求-表单交互一致性（封顶）-场景-用户使用筛选器（搜索-追更-收藏）
- [√] 1.4 更新 `src/ui/index.js` 导出新增 primitives

## 2. 页面/模块迁移（全站收敛）

- [√] 2.1 迁移 `src/pages/StaticPage.jsx` 反馈表单：移除内联 input/textarea/button，改用 `TextField`/`TextAreaField`/`Button`
- [√] 2.2 迁移 `src/pages/UserCenterPage.jsx`：profile/token/feedback 输入改用 primitives（必要时补齐 labelSrOnly）
- [√] 2.3 迁移 `src/pages/SearchPage.jsx`：筛选 Select 改用 `SelectField`（保持筛选逻辑不变）
- [√] 2.4 迁移 `src/pages/FollowingPage.jsx`：筛选 Select 改用 `SelectField`
- [√] 2.5 迁移 `src/pages/FavoritesPage.jsx`：分组 Select 改用 `SelectField`
- [√] 2.6 迁移 `src/components/anime/detail/AnimeReviews.jsx`：评分 Select + 评论 textarea 改用 `SelectField`/`TextAreaField`

## 3. 依赖升级（最新稳定版）

- [√] 3.1 核心依赖版本核对（React/Router/Motion）：当前已在既定 Node18 基线的稳定版本范围内（无需额外升级），并完成 `npm run check` 验证
- [√] 3.2 工具链版本核对（Vite/Vitest/jsdom/Storybook）：当前已在既定 Node18 基线的稳定版本范围内（无需额外升级），并完成 `npm run check` + `npm run storybook:build` 验证

## 4. 安全检查

- [√] 4.1 执行安全检查（输入边界、XSS/URL 参数处理、无明文密钥、无高风险命令落地）

## 5. 文档更新（知识库同步）

- [√] 5.1 更新 `helloagents/project.md`：同步升级后的版本信息与 primitives 约定
- [√] 5.2 更新 `helloagents/wiki/overview.md`：补充表单 primitives 与迁移范围
- [√] 5.3 更新 `helloagents/CHANGELOG.md`：记录本轮封顶交付变更
- [√] 5.4 更新 `README.md`：同步 badge/版本信息（与升级后的技术栈一致）

## 6. 测试与门禁

- [√] 6.1 运行 `npm run format`
- [√] 6.2 运行 `npm run check`，确保通过
- [√] 6.3 运行 `npm run storybook:build`，确保通过
- [√] 6.4 运行 `npm audit --registry="https://registry.npmjs.org/"`，确保 0 vulnerabilities
