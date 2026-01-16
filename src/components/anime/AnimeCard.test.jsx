import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AnimeCard from './AnimeCard';
import { FavoritesProvider } from '../FavoritesProvider';
import { ToastProvider } from '../ToastProvider';

describe('AnimeCard', () => {
  const anime = {
    id: 101,
    title: '测试国漫',
    rating: 4.8,
    type: '热血、冒险',
    cover: 'https://example.com/cover.jpg',
  };

  it('toggles favorites and shows toast feedback', async () => {
    const user = userEvent.setup();

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

  it('toggles following and shows toast feedback', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastProvider>
          <FavoritesProvider>
            <AnimeCard anime={anime} />
          </FavoritesProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: '追更' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '追更' }));
    expect(await screen.findByText('已加入追更')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取消追更' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '取消追更' }));
    expect(await screen.findByText('已取消追更')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追更' })).toBeInTheDocument();
  });

  it('toggles compare and shows toast feedback', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastProvider>
          <FavoritesProvider>
            <AnimeCard anime={anime} />
          </FavoritesProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: '加入对比' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '加入对比' }));
    expect(await screen.findByText('已加入对比')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '从对比中移除' })).toBeInTheDocument();
  });

  it('shows progress panel when watch progress exists', () => {
    window.localStorage.clear();
    window.localStorage.setItem(
      'guoman.watchProgress.v1',
      JSON.stringify({ version: 1, items: { 101: { episode: 2, progress: 25, updatedAt: 1 } } }),
    );

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastProvider>
          <FavoritesProvider>
            <AnimeCard anime={anime} />
          </FavoritesProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText('继续观看')).toBeInTheDocument();
    expect(screen.getByText(/第 2 集/)).toBeInTheDocument();
  });

  it('returns null when anime is missing', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastProvider>
          <FavoritesProvider>
            <AnimeCard anime={null} />
          </FavoritesProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
