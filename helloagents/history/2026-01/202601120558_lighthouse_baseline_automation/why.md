# why · Lighthouse Baseline Automation

## 目标

在不引入“常驻服务”和不破坏现有构建/质量闸门的前提下，补齐一个工程级缺口：**可重复、可留档的 Lighthouse 基线生成能力**。

让项目在追求“Lighthouse 满分”的过程中，有一个可执行、可对比、可回归的事实基线，而不是停留在文档建议与手工操作。

## 问题

当前仓库存在 `npm run lighthouse:baseline`，但脚本仅生成占位 JSON：

- 不能自动执行 Lighthouse
- 不能产出报告（HTML/JSON）
- 不能沉淀可对比的得分基线

这会导致“追求满分”缺少客观锚点，迭代中很难快速判断是否发生体验回归。

## 成功标准（可验证）

1. `npm run lighthouse:baseline` 可直接生成：
   - `reports/lighthouse-report.json`（完整 LHR）
   - `reports/lighthouse-baseline.json`（提炼后的得分基线）
2. 默认不把 Lighthouse 依赖写入 `package.json`（避免 CI/开发安装成本暴涨），按需通过 `npx` 拉起指定版本。
3. 在 Windows/CI 环境下可通过 `LIGHTHOUSE_CHROME_PATH` 指定浏览器路径；未提供时给出可行动的错误提示。
