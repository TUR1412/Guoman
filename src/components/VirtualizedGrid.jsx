import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const Host = styled.div`
  position: relative;
  width: 100%;
`;

const Item = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
  contain: layout style paint;
`;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toPx = (raw, fallback) => {
  if (!raw) return fallback;
  const value = String(raw).trim();
  const num = Number.parseFloat(value);
  if (!Number.isFinite(num)) return fallback;

  if (value.endsWith('px')) return num;
  if (value.endsWith('rem')) {
    const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return num * rootSize;
  }

  return num;
};

const readGapPx = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 24;
  const isMobile = window.matchMedia?.('(max-width: 576px)')?.matches;
  const name = isMobile ? '--spacing-md' : '--spacing-lg';
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  return toPx(raw, isMobile ? 16 : 24);
};

const getColumnConfig = (width) => {
  const isMobile =
    typeof window !== 'undefined' && window.matchMedia?.('(max-width: 576px)')?.matches;
  const minWidth = isMobile ? 160 : 240;
  const gap = readGapPx();
  const safeWidth = Math.max(1, Number(width) || 1);
  const columns = Math.max(1, Math.floor((safeWidth + gap) / (minWidth + gap)));
  const columnWidth = (safeWidth - gap * (columns - 1)) / columns;
  return { columns, columnWidth, gap };
};

function VirtualizedGrid({ items, renderItem, overscanRows = 2, getItemKey, estimateItemHeight }) {
  const hostRef = useRef(null);
  const measureRef = useRef(null);

  const [hostWidth, setHostWidth] = useState(0);
  const [measuredHeight, setMeasuredHeight] = useState(null);
  const [range, setRange] = useState({ start: 0, end: 0 });
  const rangeRef = useRef(range);

  useEffect(() => {
    rangeRef.current = range;
  }, [range]);

  useEffect(() => {
    const node = hostRef.current;
    if (!node || typeof window === 'undefined') return undefined;

    const update = () => {
      setHostWidth(node.clientWidth || 0);
    };

    update();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }

    const observer = new ResizeObserver(() => update());
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { columns, columnWidth, gap } = useMemo(() => getColumnConfig(hostWidth), [hostWidth]);

  useEffect(() => {
    setMeasuredHeight(null);
  }, [columns, columnWidth]);

  const defaultEstimate = useMemo(() => {
    // AnimeCard：封面为 140% 宽度 + 信息栏（更保守，避免低估导致重叠）
    const base = Math.round(columnWidth * 1.4);
    return base + 160;
  }, [columnWidth]);

  const itemHeight = useMemo(() => {
    if (Number.isFinite(measuredHeight) && measuredHeight > 0) return measuredHeight;
    if (typeof estimateItemHeight === 'function') {
      try {
        const estimated = estimateItemHeight({ columnWidth, columns });
        if (Number.isFinite(estimated) && estimated > 0) return estimated;
      } catch {}
    }
    return defaultEstimate;
  }, [columns, columnWidth, defaultEstimate, estimateItemHeight, measuredHeight]);

  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil((Array.isArray(items) ? items.length : 0) / columns);
  const totalHeight = Math.max(0, totalRows * rowHeight - gap);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let rafId = null;

    const updateRange = () => {
      rafId = null;
      const node = hostRef.current;
      if (!node) return;

      const count = Array.isArray(items) ? items.length : 0;
      if (count <= 0 || totalRows <= 0) {
        const prev = rangeRef.current;
        if (prev.start !== 0 || prev.end !== 0) setRange({ start: 0, end: 0 });
        return;
      }

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 0;
      const scrollTop = Math.max(0, -rect.top);
      const viewBottom = scrollTop + viewportHeight;

      const startRow = clamp(Math.floor(scrollTop / rowHeight) - overscanRows, 0, totalRows - 1);
      const endRow = clamp(Math.floor(viewBottom / rowHeight) + overscanRows, 0, totalRows - 1);

      const start = startRow * columns;
      const end = Math.min(count, (endRow + 1) * columns);

      const prev = rangeRef.current;
      if (prev.start === start && prev.end === end) return;

      setRange({ start, end });
    };

    const onScroll = () => {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(updateRange);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, [columns, items, overscanRows, rowHeight, totalRows]);

  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect?.();
    const height = rect?.height;
    if (!height || !Number.isFinite(height) || height <= 0) return;

    setMeasuredHeight((prev) => {
      if (!prev || height > prev) return height;
      return prev;
    });
  }, [columnWidth, range.start]);

  const visibleItems = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return [];
    if (range.end <= range.start) return [];

    const output = [];
    for (let index = range.start; index < range.end; index += 1) {
      const item = items[index];
      const row = Math.floor(index / columns);
      const col = index % columns;
      const x = col * (columnWidth + gap);
      const y = row * rowHeight;

      const key = typeof getItemKey === 'function' ? getItemKey(item, index) : (item?.id ?? index);

      output.push(
        <Item
          key={key}
          ref={index === range.start ? measureRef : null}
          style={{
            width: `${columnWidth}px`,
            transform: `translate3d(${x}px, ${y}px, 0)`,
          }}
        >
          {renderItem(item, index)}
        </Item>,
      );
    }
    return output;
  }, [columns, columnWidth, gap, getItemKey, items, range.end, range.start, renderItem, rowHeight]);

  return (
    <Host
      ref={hostRef}
      style={{
        height: `${totalHeight}px`,
      }}
    >
      {visibleItems}
    </Host>
  );
}

export default VirtualizedGrid;
