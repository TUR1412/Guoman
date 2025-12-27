import { MOTION_DURATIONS, MOTION_EASINGS, MOTION_SPRINGS } from './tokens';

export const getPageMotion = (reducedMotion, { y = 10, duration = MOTION_DURATIONS.base } = {}) => {
  if (reducedMotion) {
    return { initial: false, animate: { opacity: 1, y: 0 }, exit: { opacity: 1, y: 0 } };
  }

  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -y },
    transition: { duration, ease: MOTION_EASINGS.out },
  };
};

export const getRouteMotion = (reducedMotion) => {
  const stable = { opacity: 1, y: 0, scale: 1 };
  if (reducedMotion) {
    return {
      initial: stable,
      animate: stable,
      exit: stable,
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 14, scale: 0.985 },
    animate: stable,
    exit: { opacity: 0, y: -12, scale: 0.985 },
    transition: MOTION_SPRINGS.route,
  };
};

export const getModalBackdropMotion = (reducedMotion) => {
  if (reducedMotion) {
    return {
      initial: false,
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.22, ease: MOTION_EASINGS.out },
  };
};

export const getModalPanelMotion = (reducedMotion) => {
  if (reducedMotion) {
    return {
      initial: false,
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 8, scale: 0.98 },
    transition: { duration: 0.24, ease: MOTION_EASINGS.out },
  };
};

export const getToastMotion = (reducedMotion) => {
  if (reducedMotion) {
    return {
      initial: false,
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0 },
    };
  }

  return {
    initial: { opacity: 0, y: 12, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.98 },
    transition: { duration: 0.22, ease: MOTION_EASINGS.out },
  };
};

export const getRouteCurtainMotion = (reducedMotion) => {
  if (reducedMotion) return null;

  return {
    initial: { opacity: 0, y: -18, scale: 1.02 },
    animate: { opacity: [0, 0.9, 0], y: [-18, 0, 18], scale: [1.02, 1, 0.99] },
    transition: { duration: 0.62, ease: MOTION_EASINGS.soft, times: [0, 0.45, 1] },
  };
};
