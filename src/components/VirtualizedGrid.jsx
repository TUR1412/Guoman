import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { AnimeGrid } from './anime/AnimeGrid';

const Sentinel = styled.div`
  height: 1px;
  grid-column: 1 / -1;
`;

function VirtualizedGrid({ items, renderItem, pageSize = 24, ...gridProps }) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [items, pageSize]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setVisibleCount((prev) => Math.min(items.length, prev + pageSize));
        });
      },
      { rootMargin: '120px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [items.length, pageSize]);

  const visibleItems = useMemo(() => items.slice(0, visibleCount), [items, visibleCount]);

  return (
    <AnimeGrid {...gridProps}>
      {visibleItems.map(renderItem)}
      {visibleCount < items.length ? <Sentinel ref={sentinelRef} /> : null}
    </AnimeGrid>
  );
}

export default VirtualizedGrid;
