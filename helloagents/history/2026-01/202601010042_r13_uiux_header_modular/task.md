# 任务清单: R13 UI/UX - Header 模块化与输入组件一致性

目录: `helloagents/plan/202601010042_r13_uiux_header_modular/`

---

## 1. Header 模块化（渐进拆分）

- [√] 1.1 在 `src/components/header/` 下拆分 Header 子组件与样式组织，保持 `src/components/Header.jsx` 对外 API 不变，验证 why.md#需求-顶部导航稳定与可演进-场景-用户在任意页面进行导航与快速操作
- [√] 1.2 将 Header 内部按钮统一迁移到 `src/ui/Button.jsx` / `src/ui/IconButton.jsx`，验证 why.md#需求-命令面板快捷入口不回归-场景-用户点击“打开命令面板”并使用-esc-关闭

## 2. TextField primitives（设计系统补齐）

- [√] 2.1 新增 `src/ui/TextField.jsx`（支持 icon/label/help/error/disabled），验证 why.md#需求-搜索输入一致性-场景-用户在-header-或搜索页输入关键词
- [√] 2.2 新增 `src/ui/TextField.stories.jsx` 作为视觉回归入口
- [√] 2.3 在 `src/ui/index.js` 导出 `TextField`

## 3. 关键页面渐进迁移

- [√] 3.1 在 `src/components/Header.jsx`（或其拆分子组件）中使用 `TextField` 替代现有搜索输入
- [√] 3.2 在 `src/pages/SearchPage.jsx` 中渐进替换主搜索输入为 `TextField`（保持现有功能与参数行为不变）

## 4. 安全检查

- [√] 4.1 执行安全检查（输入边界、XSS/URL参数处理、无明文密钥、无高风险命令落地）

## 5. 文档更新（知识库同步）

- [√] 5.1 更新 `helloagents/wiki/overview.md`：补充 `TextField` 与 Header 模块化说明
- [√] 5.2 更新 `helloagents/CHANGELOG.md`：记录本轮 UI/架构变更

## 6. 测试与门禁

- [√] 6.1 运行 `npm run check`，确保通过
- [√] 6.2 运行 `npm audit --registry="https://registry.npmjs.org/"`，确保 0 vulnerabilities
