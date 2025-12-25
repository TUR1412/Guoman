# 国漫世界（Guoman World）

> 本文件包含项目级别的核心信息。更完整的项目文档与展示素材见仓库 `docs/` 与根目录 `README.md`。

---

## 1. 项目概述

### 目标与背景

“国漫世界”是一个面向国漫爱好者的纯前端静态站，主打墨韵国风与玻璃拟态的视觉体系，并采用本地优先（Local-first）策略保存用户数据（收藏、追更、观看进度等）。

### 范围

- **范围内:** 国漫内容浏览（模拟数据/可替换 API）、收藏与分组、追更提醒、搜索与推荐、海报生成、足迹与成就、PWA 离线体验。
- **范围外:** 服务端鉴权与真实支付、跨端同步、多用户协作、生产级后台管理。

---

## 2. 模块索引

| 模块名称           | 职责                                    | 状态   | 文档                                          |
| ------------------ | --------------------------------------- | ------ | --------------------------------------------- |
| App Shell / Router | 路由组织、页面加载、布局骨架            | ✅稳定 | `README.md` / `docs/ARCHITECTURE.md`          |
| UI Components      | 组件库、可访问性、交互一致性            | ✅稳定 | `src/components/`                             |
| Visual Settings    | 用户可调视觉参数（噪点/极光/blur/字号） | ✅稳定 | `src/utils/visualSettings.js`                 |
| Local-first Data   | localStorage 数据层、队列写入、导入导出 | ✅稳定 | `src/utils/`                                  |
| PWA                | Service Worker 离线缓存与更新提示       | ✅稳定 | `public/sw.js` + `src/utils/serviceWorker.js` |
| Diagnostics        | 控制台健康全景图与性能采样              | ✅稳定 | `src/utils/healthConsole.js`                  |
| Build & Deploy     | Vite 构建、GitHub Actions 部署          | ✅稳定 | `docs/DEPLOYMENT.md`                          |

---

## 3. 快速链接

- [技术约定](../project.md)
- [架构设计](arch.md)
- [项目 README](../../README.md)
