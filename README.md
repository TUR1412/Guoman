<div align="center">
  <img src="docs/hero.svg" alt="国漫世界 Guoman World" width="100%" />
  <h1>国漫世界 Guoman World</h1>
  <p>
    未来感国漫探索中枢 · 纯前端 · 本地优先 · 细节控
    <br />
    Futuristic Guoman discovery hub · Frontend-only · Local-first · Detail-obsessed
  </p>
  <p>
    <a href="https://tur1412.github.io/Guoman/">在线预览</a>
    ·
    <a href="#-项目亮点--highlights">项目亮点</a>
    ·
    <a href="#-功能矩阵--feature-matrix">功能矩阵</a>
    ·
    <a href="#-快速开始--quick-start">快速开始</a>
    ·
    <a href="#-部署到-github-pages--deployment">部署</a>
  </p>
  <p>
    <img alt="GitHub License" src="https://img.shields.io/github/license/TUR1412/Guoman?style=flat-square" />
    <img alt="Build" src="https://img.shields.io/github/actions/workflow/status/TUR1412/Guoman/static.yml?branch=master&style=flat-square" />
    <img alt="Last Commit" src="https://img.shields.io/github/last-commit/TUR1412/Guoman?style=flat-square" />
    <img alt="Node" src="https://img.shields.io/badge/node-%3E%3D18-339933?style=flat-square" />
    <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=000&style=flat-square" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=fff&style=flat-square" />
    <img alt="Vitest" src="https://img.shields.io/badge/Vitest-tested-6E9F18?style=flat-square" />
    <img alt="ESLint" src="https://img.shields.io/badge/ESLint-enabled-4B32C3?style=flat-square" />
  </p>
</div>

---

## ✨ 项目亮点 | Highlights

- **未来感视觉体系**：Aurora Mesh + 玻璃层级 + 未来字体 + 空间级阴影，打造“顶级舰桥”的视觉质感。<br />
  **Futuristic Visual System**: aurora mesh, glass layers, modern typography, and cinematic depth.
- **内容智能洞察**：Tag Pulse 标签趋势、Studio Radar 工作室雷达、Audience Pulse 口碑脉冲。<br />
  **Content Insights**: tag momentum, studio radar, and audience pulse summaries.
- **观影计划器**：结合追更与观看进度，计算剩余时长与每日观看预算。<br />
  **Watch Planner**: turns progress into daily viewing budgets and ETA.
- **匹配度解释**：推荐卡片展示匹配度 + 推荐理由，让“为什么推荐”可视化。<br />
  **Match Score + Reasons**: transparent recommendation explanations.
- **本地优先**：收藏/进度/口味画像/视觉偏好全部 localStorage 持久化。<br />
  **Local-first**: all key user state stays in the browser.
- **性能 & 质量闸门**：Lighthouse 友好、Bundle Budget、ESLint + Vitest 全链路守门。<br />
  **Performance & Quality Gates**: lint, test, build, and bundle budget in CI.

---

## ✅ 功能矩阵 | Feature Matrix

| 模块 Module | 能力 Capabilities |
| --- | --- |
| 探索 & 推荐 | 口味画像、本地推荐、匹配度解释、标签趋势热力 |
| 追更 & 计划 | 追更提醒、观看进度、观影计划器、剩余时长估算 |
| 洞察与分析 | Studio Radar、Audience Pulse、足迹中心、成就系统 |
| 视觉体验 | 未来感主题、玻璃拟态、动态栅格、动效护栏 |
| 数据管理 | 收藏/分组/导入导出/Data Vault、本地占用统计 |
| 质量保障 | PWA、诊断面板、性能预算闸门、错误兜底 |

---

## 🧭 内容洞察 | Content Insights

- **Tag Pulse**：基于评分/人气/覆盖量输出势能标签。
- **Studio Radar**：识别高口碑工作室与代表作。
- **Audience Pulse**：用热度指数/均分/关键词总结口碑氛围。
- **Insight Cards**：推荐卡片补齐匹配度与理由。

---

## 🎨 视觉系统 | Design Language

- **字体体系**：Space Grotesk + Chakra Petch（科技感 Display），中文衬底 Noto / ZCOOL。
- **设计 Tokens**：黄金比例排版、12 栅格、玻璃卡片、0-12 阴影深度。
- **动效护栏**：Reduced Motion、低数据模式自动降载。

---

## 🧠 架构一览 | Architecture

```mermaid
flowchart TD
  User[User] --> Browser[Browser]
  Browser --> App[React SPA]

  App --> Router[React Router / Hash]
  App --> UI[styled-components UI]
  App --> Motion[Framer Motion]

  App --> Data[Local-first Data Layer]
  Data --> LS[(localStorage)]
  Data --> Queue[storageQueue]

  subgraph Build[Build & Deploy]
    Vite[Vite Build] --> Dist[dist/]
    Actions[GitHub Actions] --> Dist
    Dist --> Pages[GitHub Pages]
  end
```

---

## 🧩 技术栈 | Tech Stack

| 模块 | 技术 |
| --- | --- |
| 框架 | React 18 |
| 构建 | Vite 6 |
| 路由 | React Router (Hash Router) |
| 动效 | Framer Motion |
| 样式 | styled-components + Design Tokens |
| PWA | Web App Manifest + Service Worker |
| 测试 | Vitest + Testing Library |
| 部署 | GitHub Actions → GitHub Pages |

---

## 🗂️ 项目结构 | Structure

```txt
.
├── docs/                  # 文档与展示素材
├── public/                # 静态资源（manifest/favicon/sw）
├── scripts/               # SEO / bundle / lighthouse 等脚本
├── src/
│   ├── assets/            # 图片/样式
│   ├── components/        # 组件与 Providers
│   ├── data/              # 模拟数据（可替换为真实 API）
│   ├── pages/             # 页面级路由
│   ├── utils/             # 本地数据层 / 监控 / SEO 等工具
│   ├── App.jsx            # 根路由与布局
│   └── index.jsx          # 应用入口（主题/监控初始化）
├── 404.html               # GitHub Pages 深链兜底
├── index.html             # 首屏主题初始化 + 字体引入
└── vite.config.js         # build base 为 /Guoman/
```

---

## 🚀 快速开始 | Quick Start

> 建议 Node.js v18+（与 GitHub Actions 构建环境一致）

```bash
npm ci
npm run dev
```

---

## ✅ 质量闸门 | Quality Gates

```bash
npm run check
```

`check` 会依次执行：Prettier → ESLint → Vitest → Build → Bundle Budget。

---

## 🚢 部署到 GitHub Pages | Deployment

- `vite.config.js` 已配置 `base: '/Guoman/'`
- GitHub Actions 会在每次 push 后自动构建并发布 `dist/`
- 需要手动启用 `Settings → Pages → GitHub Actions`

---

## 📚 文档 | Docs

- `docs/ARCHITECTURE.md`：架构说明与关键决策
- `docs/DESIGN_TOKENS.md`：设计变量与组件规范
- `docs/DIAGNOSTICS.md`：诊断面板与性能预算
- `docs/QUARK_AUDIT.md`：夸克级审计与改进清单
- `docs/ITERATIONS.md`：迭代记录（原子级提交）

---

## 🤝 贡献与安全 | Contributing & Security

- 贡献指南：`CONTRIBUTING.md`
- 行为准则：`CODE_OF_CONDUCT.md`
- 安全问题：`SECURITY.md`

---

## 📄 许可证 | License

MIT
