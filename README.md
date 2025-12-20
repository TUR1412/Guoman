<div align="center">
  <img src="docs/hero.svg" alt="国漫世界 Guoman World" width="100%" />

  <h1>国漫世界 (Guoman World)</h1>

  <p>
    墨韵国风 × 极光光晕的国漫探索站。
    <br />
    更顺滑、更好看、更不丢数据：收藏 · 搜索 · 排行榜 · 资讯 · 继续观看
  </p>

  <p>
    <a href="https://tur1412.github.io/Guoman/">在线预览</a>
    ·
    <a href="#-功能一览">功能一览</a>
    ·
    <a href="#-快速开始">快速开始</a>
    ·
    <a href="#-部署到-github-pages">部署</a>
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

## ✨ 目录

- [项目亮点](#-项目亮点)
- [功能一览](#-功能一览)
- [快速开始](#-快速开始)
- [设计与可访问性](#-设计与可访问性)
- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [部署到 GitHub Pages](#-部署到-github-pages)
- [文档](#-文档)
- [Roadmap](#-roadmap)
- [贡献与安全](#-贡献与安全)
- [许可证](#-许可证)

---

## 🌟 项目亮点

- **墨韵国风 UI**：纸感纹理 + Aurora Mesh + Glass 层级
- **继续观看**：观看进度持久化，首页可直接续播
- **体验完整**：收藏、搜索、排行榜、资讯、最近浏览
- **动态 SEO**：SPA 标题/描述随路由更新
- **稳健兜底**：Error Boundary + 友好空状态

---

## ✅ 功能一览

- 🎴 **视觉体系**：墨韵纸感 + Aurora 渐变 + Glassmorphism（拒绝死白/死黑）
- 🎛️ **主题切换**：深/浅主题一键切换并持久化
- ⏱️ **观看进度**：集数 + 进度滑条 + 继续观看入口
- 🔍 **站内搜索**：多关键词搜索（标题/原名/类型/标签/制作方）
- ❤️ **收藏系统**：收藏页、卡片角标、批量清空、本地持久化
- 📌 **收藏备份**：导出/导入（合并/覆盖），便于换设备
- 🏆 **排行榜**：评分/人气切换，Top 卡片强化
- 📰 **资讯模块**：资讯列表 + 详情页（可替换真实 API）
- 🧭 **路由完备**：分类页/标签页/静态页/404 深链兜底

---

## 🚀 快速开始

> 建议 Node.js v18+（与 GitHub Actions 构建环境一致）

### 1) 安装依赖

```bash
npm ci
```

### 2) 提交前建议（有限热同步）

```bash
npm run lint
npm run test
```

### 3) 本地开发（需要你手动执行）

```bash
npm run dev
```

### 4) 构建与预览

```bash
npm run build
npm run preview
```

---

## 🎨 设计与可访问性

- **主题原子性**：背景/文字/边框/卡片同步切换（避免“浅底浅字”）
- **可读性**：关键文案对比度满足 WCAG AA
- **动效护栏**：尊重 `prefers-reduced-motion`
- **对象恒常性**：主题/收藏/进度等核心状态写入 `localStorage`
- **语义补齐**：主内容/列表/提示区具备语义与 `aria-live`

---

## 🧩 技术栈

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

## 🗂️ 项目结构

```txt
.
├── docs/                  # 文档与展示素材
├── public/                # 静态资源
├── src/
│   ├── assets/            # 图片/样式
│   ├── components/        # 组件与 Providers
│   ├── data/              # 模拟数据
│   ├── pages/             # 页面级路由
│   ├── utils/             # 工具函数（theme / meta / storage / watchProgress）
│   ├── App.jsx            # 根路由与布局
│   └── index.jsx          # 应用入口
├── 404.html               # GitHub Pages 深链兜底
├── index.html             # 主题首屏初始化 + 字体引入
└── vite.config.js         # build base 为 /Guoman/
```

---

## 🚢 部署到 GitHub Pages

- 默认通过 GitHub Actions 构建并部署（见 `.github/workflows/static.yml`）。
- `vite.config.js` 在 build 时使用 `base: /Guoman/`，保证资源路径正确。
- `404.html` 会把路径转换为 Hash 路由，保留深链访问。

详细说明见：`docs/DEPLOYMENT.md`

---

## 📚 文档

- `docs/ARCHITECTURE.md`：架构说明与关键决策
- `docs/DESIGN_TOKENS.md`：设计变量与组件规范
- `docs/QUARK_AUDIT.md`：夸克级审计与改进清单
- `docs/QUARK_BACKLOG_1000.md`：1000 微任务全量清单
- `docs/QUARK_BATCH_R7_250.md`：R7 批次 250 清单
- `docs/ITERATIONS.md`：迭代记录（原子级提交）

---

## 🧭 Roadmap

- [ ] 接入真实后端（账号/收藏云同步/评论）
- [ ] 内容扩展（更丰富作品与标签体系）
- [ ] 性能升级（更细粒度拆包、预取策略）

---

## 🤝 贡献与安全

- 贡献指南：`CONTRIBUTING.md`
- 行为准则：`CODE_OF_CONDUCT.md`
- 安全问题：`SECURITY.md`

---

## 📄 许可证

MIT
