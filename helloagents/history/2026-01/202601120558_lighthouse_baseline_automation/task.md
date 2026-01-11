# 任务清单: Lighthouse Baseline Automation

目录: `helloagents/history/2026-01/202601120558_lighthouse_baseline_automation/`

---

## 1. 脚本能力补齐

- [√] 1.1 升级 `scripts/lighthouse-baseline.js`：执行 Lighthouse 并输出 report/baseline
- [√] 1.2 支持 `--url` 参数与 `LIGHTHOUSE_CHROME_PATH` 浏览器路径指定
- [√] 1.3 生成文件落地到 `reports/`（保持 `.gitignore` 生效）

## 2. 文档同步

- [√] 2.1 更新 `docs/LIGHTHOUSE_BASELINE.md`：从占位说明升级为可执行指引
- [√] 2.2 更新 `README.md` / `README.en.md`：补齐 Lighthouse 基线文档入口
- [√] 2.3 更新 `CHANGELOG.md` 与 `helloagents/CHANGELOG.md`
- [√] 2.4 更新 `helloagents/history/index.md` 并迁移方案包至 history

## 3. 质量闸门

- [√] 3.1 运行 `npm run check` 确保全绿
