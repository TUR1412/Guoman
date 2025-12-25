import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useReducedMotion } from 'framer-motion';

const draw = keyframes`
  0% {
    stroke-dashoffset: var(--path-len);
    opacity: 0.25;
    filter: drop-shadow(0 0 0 rgba(var(--primary-rgb), 0));
  }
  35% {
    opacity: 1;
    filter: drop-shadow(0 10px 22px rgba(var(--primary-rgb), 0.25));
  }
  70% {
    stroke-dashoffset: 0;
    opacity: 0.95;
    filter: drop-shadow(0 10px 22px rgba(var(--primary-rgb), 0.18));
  }
  100% {
    stroke-dashoffset: calc(var(--path-len) * -0.08);
    opacity: 0.35;
    filter: drop-shadow(0 0 0 rgba(var(--primary-rgb), 0));
  }
`;

const floaty = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
`;

const Wrap = styled.div.attrs({ role: 'img' })`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--text-secondary);
`;

const Svg = styled.svg`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  overflow: visible;
  animation: ${floaty} 1.8s var(--ease-soft) infinite;
`;

const PathBase = styled.path`
  fill: none;
  stroke: rgba(var(--primary-rgb), 0.18);
  stroke-width: 7;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const PathInk = styled.path`
  fill: none;
  stroke: rgba(var(--primary-rgb), 0.92);
  stroke-width: 7;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: var(--path-len);
  stroke-dashoffset: var(--path-len);
  animation: ${draw} 1.35s var(--ease-out) infinite;

  ${(p) =>
    p.$tone === 'accent' &&
    css`
      stroke: rgba(var(--accent-rgb), 0.9);
      animation-name: ${draw};
    `}
`;

const Label = styled.span`
  font-size: var(--text-sm);
`;

/**
 * SVG 路径加载动画（国漫墨迹风）
 * - 默认适用于 Suspense fallback / 全屏开屏 / 骨架屏占位
 */
function PathLoader({ size = 64, label = '加载中…', tone = 'primary', showLabel = true }) {
  const reducedMotion = useReducedMotion();
  const pathLen = 280;

  return (
    <Wrap aria-label={label}>
      <Svg
        $size={size}
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <g style={{ ['--path-len']: String(pathLen) }}>
          <PathBase d="M 24 64 C 24 36 42 26 60 26 C 86 26 98 46 96 62 C 94 84 78 96 58 94 C 38 92 28 82 26 72" />
          {!reducedMotion ? (
            <PathInk
              $tone={tone}
              d="M 24 64 C 24 36 42 26 60 26 C 86 26 98 46 96 62 C 94 84 78 96 58 94 C 38 92 28 82 26 72"
            />
          ) : (
            <PathInk
              $tone={tone}
              d="M 24 64 C 24 36 42 26 60 26 C 86 26 98 46 96 62 C 94 84 78 96 58 94 C 38 92 28 82 26 72"
              style={{ strokeDashoffset: 0, animation: 'none' }}
            />
          )}
        </g>
      </Svg>
      {showLabel ? <Label aria-hidden="true">{label}</Label> : null}
    </Wrap>
  );
}

export default PathLoader;
