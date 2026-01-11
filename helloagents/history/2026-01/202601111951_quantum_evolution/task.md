# 任务清单: 量子未来体验与内容智能扩展

目录: `helloagents/plan/202601111951_quantum_evolution/`

---

## 1. 视觉体系升级

- [√] 1.1 在 `src/assets/styles/global.css` 中升级未来感 tokens 与背景层级，验证 why.md#需求-未来视觉与性能-场景-首屏沉浸
- [√] 1.2 在 `index.html` 中更新字体与主题首帧配置，验证 why.md#需求-未来视觉与性能-场景-首屏沉浸
- [√] 1.3 在 `src/components/PageShell.jsx` 中升级页头视觉骨架，验证 why.md#需求-未来视觉与性能-场景-首屏沉浸

## 2. 观影计划器

- [√] 2.1 在 `src/utils/watchPlanner.js` 中实现观影计划器逻辑，验证 why.md#需求-智能观影计划器-场景-计划生成
- [√] 2.2 在 `src/pages/FollowingPage.jsx` 中接入计划器 UI，验证 why.md#需求-智能观影计划器-场景-计划生成

## 3. 推荐解释与标签趋势

- [√] 3.1 在 `src/utils/contentInsights.js` 中实现标签趋势算法，验证 why.md#需求-标签趋势热力-场景-热力探索
- [√] 3.2 在 `src/components/anime/AnimeCard.jsx` 中扩展匹配度展示能力，验证 why.md#需求-Taste-DNA-20-场景-匹配解释
- [√] 3.3 在 `src/pages/RecommendationsPage.jsx` 中接入匹配度与标签热力，验证 why.md#需求-Taste-DNA-20-场景-匹配解释

## 4. Studio Radar 与 Audience Pulse

- [√] 4.1 在 `src/utils/contentInsights.js` 中实现工作室雷达与口碑摘要算法，验证 why.md#需求-Studio-Radar-场景-工作室洞察
- [√] 4.2 在 `src/pages/InsightsPage.jsx` 中接入工作室雷达模块，验证 why.md#需求-Studio-Radar-场景-工作室洞察
- [√] 4.3 在 `src/components/AnimeDetail.jsx` 中接入口碑脉冲展示，验证 why.md#需求-Audience-Pulse-场景-口碑摘要

## 5. 关键组件重塑

- [√] 5.1 在 `src/components/Banner.jsx` 中升级未来感首屏视觉，验证 why.md#需求-未来视觉与性能-场景-首屏沉浸
- [√] 5.2 在 `src/components/Header.jsx` 与 `src/components/Footer.jsx` 中统一未来感导航与底部区，验证 why.md#需求-未来视觉与性能-场景-首屏沉浸

## 6. 文档更新

- [√] 6.1 更新 `README.md` 双语文档与结构展示
- [√] 6.2 同步更新知识库（helloagents/wiki/\*, helloagents/CHANGELOG.md）

## 7. 安全检查

- [√] 7.1 执行安全检查（按G9: 输入验证、敏感信息处理、权限控制、EHRB风险规避）

## 8. 测试

- [√] 8.1 执行 npm run lint / test / build（如环境允许）
