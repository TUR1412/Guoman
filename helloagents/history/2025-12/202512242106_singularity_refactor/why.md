# 变更提案: 奇点重构（离线缓存 + Icons 内联化 + 熵减重构）

## 需求背景

用户目标是对前端项目进行“性能与冗余极限优化”，并强化离线体验与可维护性。在不引入新外部依赖的前提下，优先剔除可替代的第三方依赖、抽取重复逻辑、补齐离线/更新链路。

## 变更内容

1. **Icons 熵减**：移除 `react-icons`，改为内置 Feather Icons 组件集合，减少依赖面与打包分包复杂度。
2. **PWA 离线缓存**：新增 `public/sw.js`（离线缓存 + 更新策略），并在检测到更新时提示用户刷新。
3. **重复逻辑收敛**：抽取日期时间格式化工具并缓存 `Intl.DateTimeFormat`，减少重复创建与重复实现。

## 影响范围

- **模块:** UI（Header/页面 Icon）、网络状态提示、构建配置、PWA 静态资源
- **文件:** 以 `src/components/icons/feather.jsx`、`public/sw.js`、`src/utils/serviceWorker.js`、`src/utils/datetime.js` 为核心

## 风险评估

- **风险:** 离线缓存可能导致用户短时间看到旧资源（缓存一致性问题）。
- **缓解:** 使用更新提示 + `SKIP_WAITING` 激活策略，并在浏览器 `controllerchange` 时自动刷新应用。
