import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePageMeta } from './pageMeta';

function MetaTester({ title, description }) {
  usePageMeta({ title, description });
  return null;
}

describe('pageMeta', () => {
  it('updates document title and description', () => {
    document.title = '国漫世界';

    const meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    meta.setAttribute('content', '默认描述');
    document.head.appendChild(meta);

    render(React.createElement(MetaTester, { title: '搜索', description: '搜索页描述' }));

    expect(document.title).toBe('搜索 · 国漫世界');
    expect(meta.getAttribute('content')).toBe('搜索页描述');

    meta.remove();
  });
});
