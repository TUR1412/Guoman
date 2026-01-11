# how · Lighthouse Baseline Automation

## 方案概述

采用“增量扩展”的方式完善现有脚本，遵循开闭原则（不改动核心构建/路由架构）：

1. **脚本升级（无新增依赖）**
   - 将 `scripts/lighthouse-baseline.js` 从“占位输出”升级为可执行脚本。
   - 通过 `npx -y lighthouse@12.8.2` 按需运行，避免把 Lighthouse 引入常规 `npm ci` 依赖树。
2. **报告产出（可留档/可对比）**
   - 写入完整报告：`reports/lighthouse-report.json`
   - 写入基线摘要：`reports/lighthouse-baseline.json`（仅保留核心分数 + 元信息）
3. **环境兼容**
   - 优先使用 `LIGHTHOUSE_CHROME_PATH` 指定浏览器（Windows 可指向 Edge）
   - 未找到浏览器时输出明确提示（如何安装/如何设置环境变量）
4. **文档同步**
   - 更新 `docs/LIGHTHOUSE_BASELINE.md`：从“占位说明”升级为可执行说明
   - README 双语文档入口补齐 Lighthouse 基线文档

## 风险与规避

- **风险：Lighthouse 依赖体积大，拖慢 CI**
  - 规避：不写入 `package.json`，改为脚本内用 `npx` 拉起固定版本。
- **风险：本机没有 Chrome（或路径不可用）**
  - 规避：提供 `LIGHTHOUSE_CHROME_PATH`，并默认探测 Windows Edge 常见路径。
- **风险：报告文件污染 Git diff**
  - 规避：`/reports` 已在 `.gitignore` 中忽略，仍保持仓库干净。

## 验证

- `npm run check` 全绿（format/lint/test/build/budget）
- `npm run lighthouse:baseline` 能生成 report 与 baseline 文件（依赖本机浏览器可用）
