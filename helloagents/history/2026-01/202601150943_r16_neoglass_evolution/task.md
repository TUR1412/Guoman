# 任务清单: R16 NeoGlass UI & 功能进化

目录: `helloagents/plan/202601150943_r16_neoglass_evolution/`

---

## 1. 设计系统（NeoGlass）

- [-] 1.1 在 `src/assets/styles/global.css` 中升级 NeoGlass tokens（颜色/阴影/边框/背景层级），确保移动端与桌面端一致。（本轮以复用既有 tokens 为主）
- [-] 1.2 调整 `src/components/PageShell.jsx` 的头部样式，使其与新设计语言一致。（本轮未改动，沿用现有骨架）
- [-] 1.3 调整 `src/components/Header.jsx` / `src/components/BottomNav.jsx` 的视觉细节（对齐/间距/交互态），保持 Dashboard 逻辑不臃肿。（本轮聚焦功能进化，未做额外视觉重绘）

## 2. Saved Views（保存视图）

- [√] 2.1 在 `src/utils/dataKeys.js` 中加入 `savedViews` key，并纳入 `src/utils/dataVault.js` 的 FEATURE_MAP。
- [√] 2.2 新增 `src/utils/savedViews.js`（create/list/apply/delete），做到 schemaVersion 与上限控制。
- [√] 2.3 在 `src/pages/SearchPage.jsx` 增加“保存当前视图/应用/删除”交互（Dialog + Toast）。

## 3. Compare Mode（作品对比）

- [√] 3.1 在 `src/utils/dataKeys.js` 中加入 `compareList` key，并纳入 `src/utils/dataVault.js`。
- [√] 3.2 新增 `src/utils/compareStore.js`（toggle/list/clear），并提供稳定的读取/写入与上限控制（max 2）。
- [√] 3.3 新增 `src/pages/ComparePage.jsx` 并在 `src/App.jsx` 注册路由 `/compare`，同时补齐 Header/Command Palette 入口。
- [√] 3.4 在 `src/components/anime/AnimeCard.jsx` 增加“加入/移出对比”入口，并更新对应测试。

## 4. Pinned Tags（常用标签）

- [√] 4.1 在 `src/utils/dataKeys.js` 中加入 `pinnedTags` key，并纳入 `src/utils/dataVault.js`。
- [√] 4.2 新增 `src/utils/pinnedTags.js`（toggle/list/clear）。
- [√] 4.3 在 `src/pages/TagPage.jsx` 增加“钉住/取消钉住”按钮；在 `src/pages/HomePage.jsx` 增加常用标签区块。

## 5. 轻量可视化（SparkBar）

- [√] 5.1 新增 `src/components/charts/SparkBar.jsx`（纯 SVG，支持 aria-label）。
- [√] 5.2 在 `src/pages/TagPage.jsx` 添加“年份分布”迷你图（Tag Insights）。

## 6. GitHub Pages 与质量闸门

- [√] 6.1 更新 `vite.config.js`：base 自动推导 + 可环境变量覆盖。
- [√] 6.2 清除所有 `console.*`（含 scripts），并在 `eslint.config.js` 中改为完全禁止 `console.*`。
- [√] 6.3 更新 `README.md`：新增“效果演示”占位区、补齐快速开始/贡献指引信息密度与可读性。
- [√] 6.4 运行 `npm run check` 并修复失败项。
