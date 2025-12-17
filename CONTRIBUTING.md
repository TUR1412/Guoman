# 贡献指南（Contributing）

感谢你愿意改进 **国漫世界**。本项目希望在保持“酷炫视觉”的同时，做到工程稳健、体验自然。

---

## 1. 开发约定

- **不启动后台常驻服务**（除非明确需要）：提交 PR 时请避免把 `dev server` 作为验证手段写进自动化流程
- **不提交依赖目录**：禁止提交 `node_modules/`
- **不提交敏感信息**：禁止提交 `.env`、token、个人密钥
- **状态恒常性**：用户可感知的状态（主题/收藏/筛选）要可恢复（localStorage/URL）
- **不裸露错误/JSON**：主 UI 禁止直接渲染 error stack 或后端原始 JSON

---

## 2. 本地开发

```bash
npm ci
npm run dev
```

构建校验（提交前建议跑一下）：

```bash
npm run build
```

---

## 3. 提交规范（建议）

推荐使用：

- `feat:` 新功能
- `fix:` 修复问题
- `chore:` 工程性调整
- `docs:` 文档更新

例：

```txt
feat: 新增收藏页
fix: 修复 favicon 路径在 GitHub Pages 下失效
docs: 重写 README
```

---

## 4. PR Checklist

- [ ] `npm run build` 通过
- [ ] 未提交 `node_modules/`、`dist/` 等产物（除非仓库明确要求）
- [ ] 新增交互有 Toast/EmptyState 等用户反馈
- [ ] 新增页面在 Header/Footer 导航中可达，且不出现 404 死链

