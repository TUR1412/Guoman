export const MOTION_DURATIONS = Object.freeze({
  fast: 0.18,
  base: 0.26,
  slow: 0.42,
} as const);

export const MOTION_EASINGS = Object.freeze({
  // 对齐 global.css 中的 --ease-out / --ease-soft 手感（略有简化，便于复用）
  out: [0.16, 1, 0.3, 1],
  soft: [0.22, 1, 0.36, 1],
} as const);

export const MOTION_SPRINGS = Object.freeze({
  // App 路由转场默认弹簧（稳定、克制、接近现有手感）
  route: { type: 'spring', stiffness: 420, damping: 42, mass: 0.8 },
  // UI 微交互：hover/press 的“物理感”基础弹簧
  pressable: { type: 'spring', stiffness: 560, damping: 40, mass: 0.8 },
  // Dialog/Drawer：略重一些，避免“漂浮感过强”
  dialog: { type: 'spring', stiffness: 520, damping: 42, mass: 0.9 },
  // Toast：更干脆，出现/消失更利落
  toast: { type: 'spring', stiffness: 640, damping: 46, mass: 0.85 },
} as const);
