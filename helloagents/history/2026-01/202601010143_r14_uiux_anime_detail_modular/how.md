# 技术设计: R14 UI/UX - AnimeDetail 模块化与表单输入一致性

## 技术方案

### 核心技术

- React 18 + React Router
- styled-components（现有样式体系）
- framer-motion（封面/容器动效与布局共享）
- 站内状态：localStorage stores（favorites/following/comments/watchProgress）
- UI primitives：`src/ui/*`（含 `TextField`）

### 实现要点

- **模块化目录结构（渐进拆分）**
  - 新增 `src/components/anime/detail/`：
    - `AnimeDetailShell.jsx`：渲染骨架与分区组装（不直接持有业务状态）
    - `AnimeDetailActions.jsx`：操作按钮区（播放/下载/收藏/追更/分享/海报）
    - `AnimeProgressCard.jsx`：观看进度区（集数输入/进度条/快捷按钮）
    - `AnimeReviews.jsx`：评论展示 + 表单（昵称/评分/评论内容/清理）
    - `styles.js`（可选）：抽取可复用的 styled 基础块，避免跨文件重复定义
  - `src/components/AnimeDetail.jsx` 保持为“薄入口”：负责数据读取、effects、handlers，向子组件下发最小必要 props。
- **输入迁移策略**
  - 仅先迁移单行输入：`ProgressInput`（集数）与 `CommentInput`（昵称）到 `TextField`
  - `textarea` 与 `range` 暂保持原实现，避免一次性扩大设计系统范围导致风险外溢（后续 R15 再扩展 `TextAreaField/Range` primitives）
- **一致性与安全**
  - 保持所有对外链接、URL 参数、encode 行为与原逻辑一致
  - 不引入新依赖，不触及敏感信息处理

## 架构决策 ADR

### ADR-014: AnimeDetail 采用“薄入口 + 领域子组件”拆分

**上下文:** AnimeDetail 同时承担样式与业务逻辑，导致体积膨胀与维护困难。  
**决策:** 入口组件负责状态/副作用/事件；领域子组件负责渲染与局部交互，按职责组织在 `src/components/anime/detail/`。  
**替代方案:** 仅抽取样式到单一文件（拒绝原因: 仍然聚合过多 UI/渲染逻辑，难以进一步演进）。  
**影响:** 降低单文件复杂度，提升可读性与可测试性，为后续拆分 SearchPage/Diagnostics 等提供范式。

## 安全与性能

- **安全:** 输入内容仍按既有逻辑写入本地 store；避免新增 HTML 注入点；分享链接使用现有 `shareOrCopyLink`。
- **性能:** 将大型 JSX 分区拆分，避免在单文件内生成过多闭包；必要时使用 `useMemo` 保持派生数据稳定（如评论合并）。

## 测试与部署

- **测试:** 运行 `npm run check`（format/lint/test/build/budget）与 `npm audit --registry="https://registry.npmjs.org/"`。
- **部署:** 无额外部署变更；保持静态站构建流程。
