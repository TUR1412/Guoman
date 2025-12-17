# [GUOMAN-NUKE-20251217] 任务看板
> **环境**: Windows (pwsh -NoLogo -NoProfile wrapper) | **框架**: React + Vite | **档位**: 4档 (架构重构)
> **已激活矩阵**: [模块 A: 视觉矫正] + [模块 E: 幽灵防御]

## 1. 需求镜像 (Requirement Mirroring)
> **我的理解**: 对 `TUR1412/Guoman` 进行“优化 + 美化 + 工程核弹级升级”，完成后推送到远程仓库，然后删除本地克隆目录。
> **不做什么**: 不后台启动长期驻留服务；不抢占端口；不在 UI 区域裸露 JSON/错误堆栈；不提交敏感信息。

## 2. 执行清单 (Execution)
- [x] 清理入库 `node_modules/`（改为依赖 `package-lock.json` + `npm ci`）
- [x] 移除 `error-blocker.js` / `mockServer` / 控制台屏蔽等“静默吞错”逻辑
- [x] 修复 `vite.config.js` 在 ESM 下的 `__dirname` 问题
- [x] 引入 Aurora + Noise + Glass 的全局主题基建（深/浅色主题，持久化）
- [x] 补齐核心路由：推荐 / 搜索 / 排行榜 / 资讯（含详情）/ 分类 / 标签 / 静态页 / 404
- [x] 运行 `npm install` 与 `npm run build`（有限热同步，不启动 dev server）
- [ ] `git commit` 并 `git push` 至远程 `origin/master`
- [ ] 推送成功后安全删除 `C:\wooK\Guoman`
