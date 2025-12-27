# Why - Motion Orchestration Hub（动效编排中枢）

## 目标

- 将路由转场 / 页面入场 / Modal / Toast 的动效参数收敛为可复用的“预设”，降低全站动效维护成本。
- 让「视觉设置 → 强制减少动效」真正影响到组件内的动效分支选择，避免 0-duration 仍走 initial/exit 导致的闪动与位移。

## 现状痛点

- 现有实现中，`MotionConfig` 可把动画“压到 0”，但大量组件仍使用 `useReducedMotion()` 作为条件分支。
- `useReducedMotion()` 只反映系统偏好（`prefers-reduced-motion`），**不会自动读取**用户视觉设置中的 `forceReducedMotion`。
- 结果：当用户在站内打开“强制减少动效”后，部分组件仍会走“非 reduced 分支”的 initial/exit（只是持续时间为 0），在特定机型/浏览器下仍可能出现 1 帧闪动或位移。

## 成功标准

- 当 `forceReducedMotion=true` 时，关键交互组件（Route/Modal/Toast/卡片等）不再出现闪动或位移。
- 引入 `src/motion/` 作为动效 SSOT（tokens + presets + reduced motion hook）。
- `npm run check` 通过（Prettier/Lint/Test/Build）。
