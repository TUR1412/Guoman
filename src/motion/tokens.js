export const MOTION_DURATIONS = Object.freeze({
  fast: 0.18,
  base: 0.26,
  slow: 0.42,
});

export const MOTION_EASINGS = Object.freeze({
  // 对齐 global.css 中的 --ease-out / --ease-soft 手感（略有简化，便于复用）
  out: [0.16, 1, 0.3, 1],
  soft: [0.22, 1, 0.36, 1],
});

export const MOTION_SPRINGS = Object.freeze({
  // App 路由转场默认弹簧（稳定、克制、接近现有手感）
  route: { type: 'spring', stiffness: 420, damping: 42, mass: 0.8 },
});
