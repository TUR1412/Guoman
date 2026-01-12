# Lighthouse 基线（Baseline）

> 说明：本仓库提供可执行的基线生成脚本 `npm run lighthouse:baseline`，用于在本地生成 Lighthouse 报告与得分摘要。
>
> 报告会写入 `reports/`（已在 `.gitignore` 中忽略），避免污染仓库 diff。

---

## 1) 前置条件

- Node.js v18+（与 CI 对齐）
- 本机可用的 Chromium 浏览器（Chrome / Edge）
  - Windows 推荐 Edge：`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`
  - 如脚本无法自动探测，请设置环境变量：`LIGHTHOUSE_CHROME_PATH`

示例（Windows PowerShell）：

```powershell
$env:LIGHTHOUSE_CHROME_PATH="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
```

---

## 2) 生成基线（推荐）

### 2.1 远程站点（GitHub Pages）

```bash
npm ci
npm run lighthouse:baseline -- --url https://tur1412.github.io/Guoman/
```

### 2.2 本地预览（build + preview）

```bash
npm ci
npm run lighthouse:baseline -- --local
```

> 说明：本地模式会先执行 `npm run build`，再拉起 `vite preview`，并对 `http://127.0.0.1:4173/Guoman/` 执行审计。

### 2.3 GitHub Actions（可选）

仓库内置了手动工作流：`.github/workflows/lighthouse.yml`。

- 触发方式：GitHub → Actions → `lighthouse-baseline` → Run workflow
- 产物：会将 `reports/` 以 artifact 形式上传（包含 `lighthouse-report.json/.html` 与 `lighthouse-baseline.json`）
- 支持参数：
  - `mode=remote`：对 GitHub Pages URL 执行审计（默认）
  - `mode=local`：CI 内 build + preview 后再审计

---

## 3) 输出文件

脚本会生成：

- `reports/lighthouse-report.json`：完整 LHR（可用于深挖具体问题）
- `reports/lighthouse-report.html`：可视化报告（默认开启，可用 `--no-html` 关闭）
- `reports/lighthouse-baseline.json`：得分摘要（便于对比回归）

---

## 4) 基线记录（建议维护）

> 说明：不同机器/网络的绝对得分会有波动，建议在“同一环境”下对比趋势。

| 指标           | 目标 | 记录值 |
| -------------- | ---- | ------ |
| Performance    | 90+  | TBD    |
| Accessibility  | 95+  | TBD    |
| Best Practices | 95+  | TBD    |
| SEO            | 95+  | TBD    |

---

## 5) 更新说明

- 若出现大幅回退（>5 分），请在 PR 描述中说明原因与修复计划。
- 每次视觉或性能大改动后建议更新基线（至少更新 `reports/lighthouse-baseline.json`）。
