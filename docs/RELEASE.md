# 发布流程（Release）

> 目标：让静态站也具备“可发布、可追溯、可回滚、可对比”的工程纪律。

---

## 1) 发布前准备（必须全绿）

```bash
npm run check
npm run e2e:ci
npm run storybook:build
```

---

## 2) 更新变更记录（Changelog）

发布前，将 `CHANGELOG.md` 的 `Unreleased` 变更归档到一个明确版本段，例如：

```md
## [1.2.0] - 2026-01-27
```

> 规则：版本号必须与 `package.json#version` 一致。

---

## 3) 版本号（本地）

推荐使用（只改版本号，不自动 tag）：

```bash
npm version 1.2.0 --no-git-tag-version
```

> 注意：Windows 场景下 `npm ci` 可能遇到 `EPERM`（二进制文件被占用），先关闭正在运行的 `node` 进程/编辑器后重试。

---

## 4) Git 提交与打 tag

```bash
git add -A
git commit -m "release: v1.2.0"
git tag v1.2.0
```

---

## 5) 推送（触发自动化）

```bash
git push origin master
git push origin v1.2.0
```

触发后会发生：

- `Deploy static content to Pages`：push 到 `master` 后构建并发布到 GitHub Pages
- `release`：push tag `v*.*.*` 后创建 GitHub Release，并上传 `dist.zip`

---

## 6) 版本一致性校验（重要）

`release` 工作流会校验：

- tag 名称必须严格等于 `v${package.json#version}`

如果不一致，工作流会直接失败（阻止“tag 与版本号不一致”导致的追溯混乱）。
