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
    <img alt="Vite" src="https://img.shields.io/badge/Vite-4-646CFF?logo=vite&logoColor=fff&style=flat-square" />
  </p>
</div>

---

## ✨ 功能一览

- 🎨 **视觉体系**：Aurora Mesh 渐变 + Noise 纹理 + Glass 卡片层级（拒绝死白/死黑）
- 🌓 **主题切换**：深/浅主题一键切换，并持久化记忆（刷新不丢）
- 🔎 **站内搜索**：多关键词搜索（空格分隔），支持标题/原名/类型/标签/制作方
- ❤️ **收藏系统**：一键收藏、收藏页汇总、卡片角标、清空收藏（本地持久化）
- 🏆 **排行榜**：按“评分 / 人气”切换排序，Top 3 Bento Highlight
- 📰 **资讯模块**：资讯列表 + 文章详情（模拟数据，可替换为真实 API）
- 🧩 **路由骨架完整**：分类页、标签页、静态页、404 兜底（支持 GitHub Pages 深链）
- 🧯 **稳健兜底**：Error Boundary 友好错误页（不在主 UI 裸露错误堆栈）

## 🚀 快速开始

> 建议 Node.js v18+（与 GitHub Actions 构建环境一致）。

### 1) 安装依赖

```bash
npm ci
```

### 2) 本地开发（需要你手动执行）

> 本仓库默认使用 Hash Router，适配 GitHub Pages。

```bash
npm run dev
```

### 3) 构建与预览

```bash
npm run build
npm run preview
```

## 🧠 设计与体验准则（项目内置）

- **主题原子性**：切换主题同时更新背景/文字/边框/卡片底色（不出现“浅底浅字”）
- **滚动条治理**：页面以单主滚动为准，移动菜单打开时锁定 body 滚动，避免穿透
- **动效护栏**：尊重 `prefers-reduced-motion`，关键交互不会依赖“先隐藏再显示”
- **状态恒常性**：主题、收藏、筛选等关键状态写入 `localStorage`

## 🗂️ 项目结构

```txt
.
├── docs/                  # 文档与展示素材（README Hero 等）
├── public/                # 静态资源（favicon 等）
├── src/
│   ├── assets/            # 图片/样式等
│   ├── components/        # 组件（含 Providers）
│   ├── data/              # 模拟数据（可替换为真实 API）
│   ├── pages/             # 页面级路由
│   ├── utils/             # 工具函数（theme 等）
│   ├── App.jsx            # 根路由与布局
│   └── index.jsx          # 应用入口
├── 404.html               # GitHub Pages 深链兜底（路径 -> Hash）
├── index.html             # 主题首屏初始化 + 字体直链
└── vite.config.js         # build base 为 /Guoman/，dev 为 /
```

## 📦 部署到 GitHub Pages

- 本项目默认通过 GitHub Actions 构建并部署（见 `.github/workflows/static.yml`）。
- `vite.config.js` 在 `build` 时自动使用 `base: /Guoman/`，保证资源路径正确。
- `404.html` 会把路径路由转换为 Hash 路由，尽量保留用户访问路径。

更详细说明见：`docs/DEPLOYMENT.md`

## 📚 文档

- `docs/DEPLOYMENT.md`：部署与常见坑位说明
- `docs/ARCHITECTURE.md`：项目结构与关键设计决策
- `Task_Status.md`：任务看板（工程记录）

## 🧩 Roadmap

- [ ] 接入真实后端：账号、收藏云同步、评论
- [ ] 内容扩展：更多作品数据、更多标签/分类体系
- [ ] 性能升级：更细粒度拆包、预取策略、图片策略

## 🤝 贡献

欢迎 PR / Issue。建议先阅读：`CONTRIBUTING.md`

## 📄 许可证

MIT

