import React, { useMemo } from 'react';
import styled from 'styled-components';

const Svg = styled.svg`
  width: 100%;
  height: var(--sparkbar-height, 44px);
  display: block;
  overflow: visible;
`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const label = String(item.label || '').trim();
      const value = Number(item.value);
      if (!label) return null;
      if (!Number.isFinite(value) || value < 0) return null;
      return { label, value };
    })
    .filter(Boolean);
};

export default function SparkBar({ items, ariaLabel = '分布图', maxBars = 18 }) {
  const normalized = useMemo(() => normalizeItems(items), [items]);

  const data = useMemo(() => {
    const sliced = normalized.slice(0, clamp(Number(maxBars) || 18, 4, 36));
    const maxValue = sliced.reduce((max, item) => Math.max(max, item.value), 0) || 1;
    return { sliced, maxValue };
  }, [maxBars, normalized]);

  const viewWidth = 120;
  const viewHeight = 32;
  const gap = 2;
  const count = data.sliced.length || 1;
  const barWidth = (viewWidth - gap * (count - 1)) / count;

  return (
    <Svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      preserveAspectRatio="none"
    >
      {data.sliced.map((item, idx) => {
        const ratio = item.value / data.maxValue;
        const height = clamp(ratio, 0, 1) * (viewHeight - 2);
        const x = idx * (barWidth + gap);
        const y = viewHeight - height;
        const radius = Math.min(2.5, barWidth / 2);

        return (
          <g key={`${item.label}-${idx}`}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={height}
              rx={radius}
              ry={radius}
              fill="rgba(var(--primary-rgb), 0.42)"
            />
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={Math.min(height, 6)}
              rx={radius}
              ry={radius}
              fill="rgba(var(--secondary-rgb), 0.26)"
              opacity={0.9}
            />
          </g>
        );
      })}
    </Svg>
  );
}
