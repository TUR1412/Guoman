# 部署指南（GitHub Pages）

本项目默认以 **GitHub Pages** 为部署目标，且路由使用 **Hash Router**（`#/path`），以最大化兼容性与“复制链接可打开”体验。

---

## 1. 部署方式概览

当前仓库已内置 GitHub Actions 工作流：

- `.github/workflows/static.yml`：push 到 `master` 后自动执行 `npm ci` → `npm run build` → 部署到 GitHub Pages

你只需要：

1. 在仓库 Settings → Pages 中启用 Pages（通常由 Actions 自动接管）
2. 保证默认分支为 `master`

---

## 2. 为什么用 Hash Router？

GitHub Pages 是静态托管。若使用 Browser Router（history 模式），访问：

- `/Guoman/anime/1`

服务器会尝试寻找 `/Guoman/anime/1` 对应文件并返回 404。

Hash Router 则把路由放在 `#` 后面：

- `/Guoman/#/anime/1`

`#` 后的内容不会被服务器解析，因此天然适配静态托管。

---

## 3. 深链兜底：404.html 做了什么？

本仓库的 `404.html` 会把路径路由尽量转换为 Hash 路由：

- `/Guoman/xxx?y=1` → `/Guoman/#/xxx?y=1`

这样即使用户复制了“路径形式”的链接，在 GitHub Pages 下也能被兜底跳回可用的 Hash 路由。

---

## 4. Vite 的 base 配置

Vite 在 GitHub Pages 子路径下部署时，资源路径必须带 base：

- 站点：`https://tur1412.github.io/Guoman/`
- base：`/Guoman/`

仓库已在 `vite.config.js` 做了自动切换：

- `npm run dev`：`base = /`（本地体验更自然）
- `npm run build`：`base = /Guoman/`（部署路径正确）

---

## 5. 常见问题

### Q1：为什么 favicon 不显示？

请确认 `index.html` 中的 favicon 是相对路径（例如 `./favicon.svg`），避免写成 `/favicon.svg`（会指向域名根路径，导致 GitHub Pages 子路径下 404）。

### Q2：为什么刷新某个页面会 404？

如果你看到的是 `/Guoman/some-path` 形式的链接，请改用 `/Guoman/#/some-path`。

若仍不行，检查：

- Pages 是否指向 GitHub Actions 部署产物
- `404.html` 是否被正常部署到站点根目录
