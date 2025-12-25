# 任务清单: 墨韵视觉进化（Visual Settings + UI 体系强化）

目录: `helloagents/history/2025-12/202512252118_ink_visual_evolution/`

---

## 1. 视觉设置（Local-first）

- [√] 1.1 在 `src/utils/dataKeys.js` 中新增 `STORAGE_KEYS.visualSettings`（版本化 key），并补齐 Data Vault 映射，验证 why.md#需求-视觉设置可控-场景-降低噪点与极光强度
- [√] 1.2 新增 `src/utils/visualSettings.js`：实现读取/容错/持久化/apply/init，验证 why.md#需求-视觉设置可控-场景-降低噪点与极光强度
- [√] 1.3 在 `src/index.jsx` 中首帧调用 `initVisualSettings()`（与 initTheme 同级），验证 why.md#需求-视觉设置可控-场景-字号缩放

## 2. Design Tokens 与全局样式

- [√] 2.1 在 `src/assets/styles/global.css` 引入 `--paper-noise-opacity`、`--aurora-opacity`、`--font-scale` 等 tokens，并将 `data-low-data` 从“写死 opacity”调整为“multiplier 叠乘”，验证 why.md#需求-视觉设置可控-场景-降低噪点与极光强度
- [√] 2.2 增加 `data-no-blur` 与 `data-reduced-motion` 的全局策略（覆盖 blur/动效），验证 why.md#需求-视觉设置可控-场景-禁用玻璃模糊 与 why.md#需求-视觉设置可控-场景-强制减少动效

## 3. App Shell 联动

- [√] 3.1 在 `src/App.jsx` 中监听 `visualSettings` 变化并重新 apply，同时让 `MotionConfig reducedMotion` 与设置联动，验证 why.md#需求-视觉设置可控-场景-强制减少动效

## 4. 用户中心 UI

- [√] 4.1 在 `src/pages/UserCenterPage.jsx` 增加“视觉设置”面板（range/toggle/恢复默认），并确保即时生效与可访问性，验证 why.md#需求-视觉设置可控-场景-字号缩放

## 5. 测试

- [√] 5.1 新增 `src/utils/visualSettings.test.js` 覆盖默认值/容错/apply 行为
- [√] 5.2 更新现有相关测试（如 Data Vault/Theme），确保 `npm run test` 通过

## 6. 安全检查

- [√] 6.1 执行安全检查（输入边界、localStorage 容错、无敏感信息硬编码、无危险 API），并记录在方案总结

## 7. 文档与知识库同步

- [√] 7.1 更新 `docs/DESIGN_TOKENS.md` 补齐新 tokens 与策略说明
- [√] 7.2 更新根目录 `README.md` 增加“视觉设置”与可访问性/性能说明
- [√] 7.3 更新 `helloagents/wiki/overview.md` / `helloagents/wiki/arch.md` / `helloagents/project.md` 与 `helloagents/CHANGELOG.md`

## 8. 质量闸门与交付

- [√] 8.1 执行 `npm run check`（Prettier → ESLint → Vitest → Build）并确保通过
- [√] 8.2 更新版本号与变更记录（如需要），完成后提交并推送到远程仓库
- [√] 8.3 **【强制】** 迁移方案包至 `helloagents/history/2025-12/202512252118_ink_visual_evolution/`，并更新 `helloagents/history/index.md`
