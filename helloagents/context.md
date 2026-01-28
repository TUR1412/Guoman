# 项目上下文（Context）

## 项目定位

- 项目名称：国漫世界（Guoman World）
- 形态：纯前端 SPA（GitHub Pages 部署）
- 关键原则：Local-first（用户状态主要持久化在浏览器侧）

## 现状基线（从代码与配置提取）

- 运行时：Node.js（CI 与本地统一为 Node 22；`package.json` 声明 `>=22`）
- 前端：React 19 + React Router 7（Hash Router）
- 构建：Vite 7（`vite.config.js` 含 base 自动推导、手工分包策略与 build 元信息注入）
- 样式：styled-components + CSS Variables tokens + data-\* 设计系统
- 动效：Framer Motion（尊重 reduced motion）
- 测试：Vitest + Testing Library（覆盖率阈值启用）
- 质量闸门：`npm run check`（format:check → lint → test → build → bundle budget）
- 部署：GitHub Actions → GitHub Pages（HashRouter + `404.html` 深链兜底）

## 关键约束

- 不依赖后端服务即可运行（静态站可独立交付）
- 弱网/断网场景需要可用（PWA/离线兜底）
- 需要维持高质量门禁（lint/test/build/budget + Lighthouse 基线）

## 资料入口

- 项目概览：`README.md`
- 技术约定：`helloagents/project.md`
- 审计与迭代：`docs/QUARK_AUDIT.md` / `docs/ITERATIONS.md`
