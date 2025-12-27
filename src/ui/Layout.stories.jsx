import React from 'react';
import Container from './Container';
import Stack from './Stack';
import Grid from './Grid';
import Col from './Col';
import Card from './Card';

export default {
  title: 'UI/Layout',
  parameters: { layout: 'fullscreen' },
};

export function ContainerAndStack() {
  return (
    <Container>
      <Stack $gap="var(--spacing-xl)">
        <Card $elev={3} style={{ padding: 'var(--spacing-lg)' }}>
          <div style={{ fontWeight: 800 }}>Container</div>
          <div style={{ color: 'var(--text-secondary)' }}>统一 max-width 与水平 padding</div>
        </Card>
        <Stack $direction="row" $gap="var(--spacing-md)" $wrap>
          <Card $elev={2} style={{ padding: 'var(--spacing-md)', minWidth: 160 }}>
            Stack 行布局
          </Card>
          <Card $elev={2} style={{ padding: 'var(--spacing-md)', minWidth: 160 }}>
            gap / wrap
          </Card>
          <Card $elev={2} style={{ padding: 'var(--spacing-md)', minWidth: 160 }}>
            对齐与分布
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}

export function Grid12Cols() {
  return (
    <Container>
      <Grid $gap="var(--spacing-lg)" $divider>
        <Col $span={12}>
          <Card $elev={3} style={{ padding: 'var(--spacing-lg)' }}>
            12 列栅格（Grid / Col）
          </Card>
        </Col>
        <Col $span={4}>
          <Card $elev={2} style={{ padding: 'var(--spacing-lg)' }}>
            span 4
          </Card>
        </Col>
        <Col $span={4}>
          <Card $elev={2} style={{ padding: 'var(--spacing-lg)' }}>
            span 4
          </Card>
        </Col>
        <Col $span={4}>
          <Card $elev={2} style={{ padding: 'var(--spacing-lg)' }}>
            span 4
          </Card>
        </Col>
        <Col $span={6}>
          <Card $elev={2} style={{ padding: 'var(--spacing-lg)' }}>
            span 6
          </Card>
        </Col>
        <Col $span={6}>
          <Card $elev={2} style={{ padding: 'var(--spacing-lg)' }}>
            span 6
          </Card>
        </Col>
      </Grid>
    </Container>
  );
}
