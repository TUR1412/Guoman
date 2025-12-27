# How - Motion Orchestration Hub（动效编排中枢）

## 方案概述

在不引入新状态管理库、不大规模改动组件结构的前提下，建立一个轻量“动效中枢”层：

1. `src/motion/useAppReducedMotion.js`
   - 将 Framer Motion 的 `useReducedMotion()`（系统偏好）与站内视觉设置的 `forceReducedMotion` 合并。
   - 通过监听 `VISUAL_SETTINGS_EVENT`，在用户切换设置时实时刷新结果。
2. `src/motion/tokens.js`
   - 提供统一的动效时长（fast/base/slow）、常用 easing、路由弹簧参数等基础 tokens。
3. `src/motion/presets.js`
   - 基于 tokens 提供可复用预设：`getRouteMotion` / `getPageMotion` / `getModalBackdropMotion` / `getModalPanelMotion` / `getToastMotion` / `getRouteCurtainMotion`。
4. 应用层接入
   - `App.jsx` 路由转场与幕布（curtain）使用 `presets`，并将 reducedMotion 判定改为 `useAppReducedMotion`。
   - `HomePage.jsx` / `PageShell.jsx` 页面入场统一使用 `getPageMotion`。
   - `CommandPalette.jsx` / `ToastProvider.jsx` 的 Modal/Toast 动效统一使用 `presets`。
   - 其他包含分支逻辑的交互组件统一改用 `useAppReducedMotion`，确保视觉设置可控。

## 风险与规避

- **风险：**全局替换 reduced motion 判定可能影响既有动效节奏。
  - **规避：**仅替换判定来源（系统 → 系统 OR 站内强制），不改变组件自身的动画目标值；并通过 `npm run check` 做回归。
- **风险：**新增文件引入路径别名导致 Vitest 解析问题。
  - **规避：**所有新增 import 均使用相对路径（不使用 `@/`）。
