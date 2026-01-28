# Lighthouse 基线（Baseline）

> 说明：本仓库提供可执行的基线生成脚本 `npm run lighthouse:baseline`，用于在本地生成 Lighthouse 报告与得分摘要。
>
> 报告会写入 `reports/`（已在 `.gitignore` 中忽略），避免污染仓库 diff。

---

## 1) 前置条件

- Node.js v22+（与 CI 对齐）
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

> 说明：为确保参数 **100% 传入脚本**（避免 `npm run ... -- --no-xxx` 被 npm 自己解析掉），推荐使用环境变量传参。

**Windows PowerShell：**

```powershell
npm ci
$env:LH_MODE="remote"
$env:LH_URL="https://tur1412.github.io/Guoman/"
npm run lighthouse:baseline
```

**macOS / Linux（bash/zsh）：**

```bash
npm ci
LH_MODE=remote LH_URL="https://tur1412.github.io/Guoman/" npm run lighthouse:baseline
```

### 2.2 本地预览（build + preview）

**Windows PowerShell：**

```powershell
npm ci
$env:LH_MODE="local"
npm run lighthouse:baseline
```

**macOS / Linux（bash/zsh）：**

```bash
npm ci
LH_MODE=local npm run lighthouse:baseline
```

> 说明：本地模式会先执行 `npm run build`，再拉起 `vite preview`，并对 `http://127.0.0.1:4173/Guoman/` 执行审计。
> 如端口冲突，可设置 `LH_PORT=4174`（并相应调整目标 URL）。

### 2.3 可选参数

- 关闭 HTML 输出（只要 JSON + baseline 摘要）：`LH_HTML=false`
- 指定预设（桌面/移动）：`LH_PRESET=desktop|mobile`
- 指定远程 URL：`LH_URL=https://...`

> 如果你更喜欢命令行参数（而不是环境变量），请直接运行脚本：\n> `node ./scripts/lighthouse-baseline.js --remote --url https://... --no-html`

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

最近一次基线（2026-01-27，`local` + `desktop`，build + preview）：

| 指标           | 目标 | 记录值 |
| -------------- | ---- | ------ |
| Performance    | 90+  | 94     |
| Accessibility  | 95+  | 100    |
| Best Practices | 95+  | 100    |
| SEO            | 95+  | 100    |

> 说明：`remote`（GitHub Pages）得分会受到网络/缓存/线上资源波动影响。建议用 `local` 作为“代码级基线”，用 `remote` 作为“线上体感回归”。

---

## 5) 更新说明

- 若出现大幅回退（>5 分），请在 PR 描述中说明原因与修复计划。
- 每次视觉或性能大改动后建议更新基线（至少更新 `reports/lighthouse-baseline.json`）。
