import React from 'react';
import Card from './Card';
import Stack from './Stack';

export default {
  title: 'UI/Card',
  component: Card,
};

export function Elevations() {
  return (
    <Stack $gap="var(--spacing-lg)">
      {[0, 1, 2, 3, 4, 6, 8, 10, 12].map((lvl) => (
        <Card key={lvl} $elev={lvl} style={{ padding: 'var(--spacing-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 900 }}>data-card</span>
            <span style={{ color: 'var(--text-tertiary)' }}>elev {lvl}</span>
          </div>
          <div style={{ marginTop: 6, color: 'var(--text-secondary)' }}>
            毛玻璃基座 + 动态渐变边框由 global.css 驱动
          </div>
        </Card>
      ))}
    </Stack>
  );
}
