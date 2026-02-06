import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import animeData from '../data/animeData';
import newsData from '../data/newsData';
import HomeQuickHub from './HomeQuickHub';

describe('HomeQuickHub', () => {
  it('renders summary metrics and quick actions', () => {
    render(
      <MemoryRouter>
        <HomeQuickHub />
      </MemoryRouter>,
    );

    expect(screen.getByText(`${animeData.length} 部`)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /口味推荐/ })).toHaveAttribute(
      'href',
      '/recommendations',
    );
    expect(screen.getByText(new RegExp(`当前收录 ${newsData.length} 条动态`))).toBeInTheDocument();
  });
});
