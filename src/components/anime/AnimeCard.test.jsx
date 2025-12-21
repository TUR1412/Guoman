import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AnimeCard from './AnimeCard';
import { FavoritesProvider } from '../FavoritesProvider';
import { ToastProvider } from '../ToastProvider';

describe('AnimeCard', () => {
  it('toggles favorites and shows toast feedback', async () => {
    const user = userEvent.setup();

    const anime = {
      id: 101,
      title: '测试国漫',
      rating: 4.8,
      type: '热血、冒险',
      cover: 'https://example.com/cover.jpg',
    };

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastProvider>
          <FavoritesProvider>
            <AnimeCard anime={anime} />
          </FavoritesProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: '加入收藏' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '加入收藏' }));

    expect(await screen.findByText('已加入收藏')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消收藏' })).toBeInTheDocument();
  });
});
