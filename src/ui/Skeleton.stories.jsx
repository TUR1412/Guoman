import React from 'react';
import Stack from './Stack';
import { SkeletonBlock, SkeletonCircle } from './Skeleton';
import Card from './Card';

export default {
  title: 'UI/Skeleton',
};

export function Blocks() {
  return (
    <Card $elev={3} style={{ padding: 'var(--spacing-lg)' }}>
      <Stack $gap="var(--spacing-md)">
        <div style={{ fontWeight: 900 }}>Skeleton</div>
        <Stack $direction="row" $gap="var(--spacing-md)" $align="center">
          <SkeletonCircle size={42} />
          <Stack $gap={8} style={{ width: '100%' }}>
            <SkeletonBlock height={14} width="60%" />
            <SkeletonBlock height={12} width="40%" />
          </Stack>
        </Stack>
        <SkeletonBlock height={120} />
      </Stack>
    </Card>
  );
}
