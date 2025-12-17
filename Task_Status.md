# [GUOMAN-NUKE-20251217-R2] 任务看板
> **环境**: Windows (pwsh -NoLogo -NoProfile wrapper) | **框架**: React + Vite | **档位**: 4档 (架构重构)
> **已激活矩阵**: [模块 A: 视觉矫正] + [模块 E: 幽灵防御]

## 1. 需求镜像 (Requirement Mirroring)
> **我的理解**: 对 `TUR1412/Guoman` 进行“原子弹级再次升级 + 原子级审查”，完成后推送到远程仓库，然后删除本地克隆目录。
> **不做什么**: 不后台启动长期驻留服务；不抢占端口；不在 UI 区域裸露 JSON/错误堆栈；不提交敏感信息。

## 2. 执行清单 (Execution)
- [x] 字体加载优化：移除 CSS `@import`，改为 `index.html` 直链（减少阻塞链路）
- [x] 主题首帧无闪烁：Head 内联脚本（< 30 行）提前写入 `data-theme`
- [x] 404 深链兜底：将 `/Guoman/xxx` 转为 `/Guoman/#/xxx`，尽量保留路径
- [x] 收藏系统：LocalStorage 持久化 + 收藏页 + 卡片收藏角标
- [x] 多巴胺反馈：全局 Toast（收藏/清空/演示登录）
- [x] 导航稳健：子路由高亮、移动菜单打开时锁定页面滚动
- [x] 构建验证：`npm ci` + `npm run build`（有限热同步，不启动 dev server）
- [ ] `git commit` 并 `git push` 至远程 `origin/master`
- [ ] 推送成功后安全删除 `C:\wooK\Guoman`
