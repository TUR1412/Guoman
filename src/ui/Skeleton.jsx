import React from 'react';

const toCssSize = (value, fallback) => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'number') return `${value}px`;
  return String(value);
};

export function SkeletonBlock({ width = '100%', height = 16, style, ...props }) {
  return (
    <div
      data-skeleton
      style={{
        width: toCssSize(width, '100%'),
        height: toCssSize(height, '16px'),
        ...style,
      }}
      {...props}
    />
  );
}

export function SkeletonCircle({ size = 40, style, ...props }) {
  return (
    <div
      data-skeleton
      style={{
        width: toCssSize(size, '40px'),
        height: toCssSize(size, '40px'),
        borderRadius: '999px',
        ...style,
      }}
      {...props}
    />
  );
}

export default SkeletonBlock;
