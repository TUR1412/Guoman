<div align="center">
  <img src="docs/hero.svg" alt="国漫世界 Guoman World" width="100%" />

  <h1>国漫世界 (Guoman World)</h1>

  <p>
    一个为“发现国漫”打造的现代前端项目：更顺滑、更好看、更不丢数据。
    <br />
    Aurora 渐变 · Glass 玻璃拟态 · 深/浅主题 · 收藏 · 搜索 · 排行榜 · 资讯
  </p>

  <p>
    <a href="https://tur1412.github.io/Guoman/">在线预览</a>
    ·
    <a href="#-%E5%8A%9F%E8%83%BD%E4%B8%80%E8%A7%88">功能一览</a>
    ·
    <a href="#-%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B">快速开始</a>
    ·
    <a href="#-%E9%83%A8%E7%BD%B2%E5%88%B0-github-pages">部署</a>
    ·
    <a href="docs/DEPLOYMENT.md">部署文档</a>
  </p>

  <p>
    <img alt="GitHub License" src="https://img.shields.io/github/license/TUR1412/Guoman?style=flat-square" />
    <img alt="Build" src="https://img.shields.io/github/actions/workflow/status/TUR1412/Guoman/static.yml?branch=master&style=flat-square" />
    <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=000&style=flat-square" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=fff&style=flat-square" />
  </p>
</div>

---

## 📌 目录

- [✨ 项目亮点](#-项目亮点)
- [✨ 功能一览](#-功能一览)
- [🧪 质量保障](#-质量保障)
- [⚙️ 技术栈](#-技术栈)
- [🚀 快速开始](#-快速开始)
- [🧩 设计与可访问性](#-设计与可访问性)
- [🗂️ 项目结构](#-项目结构)
- [📦 部署到 GitHub Pages](#-部署到-github-pages)
- [🧭 Roadmap](#-roadmap)
- [📚 文档](#-文档)
- [🤝 贡献](#-贡献)
- [🧾 许可证](#-许可证)

---

## ✨ 项目亮点

- **产品级观感**：Aurora Mesh + Glassmorphism + 主题原子性
- **可持续工程**：Lint/Test/Build 单一闸门 + 迭代记录可回溯
- **体验完整**：收藏、搜索、排行榜、资讯、最近浏览
- **动态 SEO**：SPA 页面标题/描述随路由更新
- **稳定兜底**：错误边界 + 友好空状态

---

## ✨ 功能一览

- 🎨 **视觉体系**：Aurora Mesh 渐变 + Noise 纹理 + Glass 卡片层级（拒绝死白/死黑）
- 🌗 **主题切换**：深/浅主题一键切换，并持久化记忆（刷新不丢）
- 🕘 **最近浏览**：自动记录最近浏览作品，返回首页即可继续探索
- ⌨️ **快捷键**：Ctrl/? + K 一键聚焦搜索（更像“产品”而不是“页面”）
- 🔍 **站内搜索**：多关键词搜索（空格分隔），支持标题/原名/类型/标签/制作方（与 URL 同步）
- ❤️ **收藏系统**：一键收藏、收藏页汇总、卡片角标、清空收藏（本地持久化）
- 💾 **收藏备份**：收藏支持 **导出/导入**（合并/覆盖），便于换设备与防丢
- 🏆 **排行榜**：按“评分 / 人气”切换排序，Top 3 Bento Highlight
- 📰 **资讯模块**：资讯列表 + 文章详情（模拟数据，可替换为真实 API）
- 🧭 **路由骨架完整**：分类页、标签页、静态页、404 兜底（支持 GitHub Pages 深链）
- 🛡️ **稳健兜底**：Error Boundary 友好错误页（不在主 UI 裸露错误堆栈）
- 📈 **动态 SEO**：页面标题/描述自动更新（更像产品而非单页）

---

## 🧪 质量保障

- 
pm run lint：代码规范检查
- 
pm run test：Vitest 单元测试
- 
pm run build：生产构建
- 
pm run check：format + lint + test + build 一键闸门

---

## ⚙️ 技术栈

| 模块 | 技术 |
| --- | --- |
| 框架 | React 18 |
| 构建 | Vite 6 |
| 路由 | React Router（Hash Router） |
| 动效 | Framer Motion |
| 样式 | styled-components + Design Tokens |
| 测试 | Vitest + Testing Library |
| 部署 | GitHub Actions → GitHub Pages |

---

## 🚀 快速开始

> 建议 Node.js v18+（与 GitHub Actions 构建环境一致）。

### 1) 安装依赖

`ash
npm ci
`

### 2) 提交前建议（有限热同步）

`ash
npm run lint
npm run test
`

### 3) 本地开发（需要你手动执行）

> 本仓库默认使用 Hash Router，适配 GitHub Pages。

`ash
npm run dev
`

### 4) 构建与预览

`ash
npm run build
npm run preview
`

---

## 🧩 设计与可访问性

- **主题原子性**：切换主题同时更新背景/文字/边框/卡片底色（不出现“浅底浅字”）
- **滚动条治理**：页面以单主滚动为准，移动菜单打开时锁定 body 滚动，避免穿透
- **动效护栏**：尊重 prefers-reduced-motion，关键交互不会依赖“先隐藏再显示”
- **状态恒常性**：主题、收藏、筛选等关键状态写入 localStorage
- **语义补齐**：主内容、列表语义与 ria-live 提示

---

## 🗂️ 项目结构

`	xt
.
├── docs/                  # 文档与展示素材（README Hero 等）
├── public/                # 静态资源（favicon 等）
├── src/
│   ├── assets/            # 图片/样式等
│   ├── components/        # 组件（含 Providers）
│   ├── data/              # 模拟数据（可替换为真实 API）
│   ├── pages/             # 页面级路由
│   ├── utils/             # 工具函数（theme / meta / storage 等）
│   ├── App.jsx            # 根路由与布局
│   └── index.jsx          # 应用入口
├── 404.html               # GitHub Pages 深链兜底（路径 -> Hash）
├── index.html             # 主题首屏初始化 + 字体直链
└── vite.config.js         # build base 为 /Guoman/，dev 为 /
`

---

## 📦 部署到 GitHub Pages

- 本项目默认通过 GitHub Actions 构建并部署（见 .github/workflows/static.yml）。
- ite.config.js 在 uild 时自动使用 ase: /Guoman/，保证资源路径正确。
- 404.html 会把路径路由转换为 Hash 路由，尽量保留用户访问路径。

更详细说明见：docs/DEPLOYMENT.md

---

## 🧭 Roadmap

- [ ] 接入真实后端：账号、收藏云同步、评论
- [ ] 内容扩展：更多作品数据、更多标签/分类体系
- [ ] 性能升级：更细粒度拆包、预取策略、图片策略

---

## 📚 文档

- docs/DEPLOYMENT.md：部署与常见坑位说明
- docs/ARCHITECTURE.md：项目结构与关键设计决策
- docs/ITERATIONS.md：轮询迭代记录（原子级改进清单）
- docs/QUARK_AUDIT.md：夸克级审计与问题画像
- docs/DESIGN_TOKENS.md：设计变量与组件规范
- Task_Status.md：任务看板（工程记录）

---

## 🤝 贡献

欢迎 PR / Issue。建议先阅读：CONTRIBUTING.md

同时建议了解：

- CODE_OF_CONDUCT.md：社区行为准则
- SECURITY.md：安全问题上报流程（避免在公开 Issue 泄漏细节）

---

## 🧾 许可证

MIT