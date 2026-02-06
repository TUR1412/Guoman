import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AnimeList from './AnimeList';
import { FavoritesProvider } from './FavoritesProvider';
import { ToastProvider } from './ToastProvider';
import animeData, { categories } from '../data/animeData';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { flushStorageQueue } from '../utils/storageQueue';

describe('AnimeList', () => {
  it('moves tab indicator when switching tabs', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ToastProvider>
          <FavoritesProvider>
            <AnimeList storageKey="test.animeList.tab" defaultTab="all" initialDisplayCount={4} />
          </FavoritesProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    const indicator = screen.getByTestId('anime-list-tab-indicator');
    expect(indicator.closest('button')).toHaveTextContent('全部');

    await user.click(screen.getByRole('tab', { name: '精选' }));

    const moved = screen.getByTestId('anime-list-tab-indicator');
    expect(moved.closest('button')).toHaveTextContent('精选');
  });

  it('shows more items and supports category tabs', async () => {
    window.localStorage.clear();
    flushStorageQueue();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ToastProvider>
          <FavoritesProvider>
            <AnimeList
              storageKey={STORAGE_KEYS.recommendationsTab}
              defaultTab="popular"
              initialDisplayCount={2}
            />
          </FavoritesProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('listitem').length).toBe(2);

    await user.click(screen.getByRole('button', { name: '查看更多' }));
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(2);

    await user.click(screen.getByRole('tab', { name: '最新' }));
    expect(screen.getByTestId('anime-list-tab-indicator').closest('button')).toHaveTextContent(
      '最新',
    );

    const categoryName = categories[0]?.name;
    if (categoryName) {
      await user.click(screen.getByRole('tab', { name: categoryName }));
      expect(screen.getByTestId('anime-list-tab-indicator').closest('button')).toHaveTextContent(
        categoryName,
      );
    }
  });

  it('supports sorting and compact layout toggle', async () => {
    window.localStorage.clear();
    flushStorageQueue();
    const user = userEvent.setup();
    const topRatedTitle = [...animeData].sort((left, right) => right.rating - left.rating)[0].title;

    render(
      <MemoryRouter>
        <ToastProvider>
          <FavoritesProvider>
            <AnimeList storageKey="test.animeList.sort" defaultTab="all" initialDisplayCount={4} />
          </FavoritesProvider>
        </ToastProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: '评分优先' }));
    const firstCard = screen.getAllByRole('listitem')[0];
    expect(within(firstCard).getByRole('heading', { level: 3 })).toHaveTextContent(topRatedTitle);

    await user.click(screen.getByRole('button', { name: '切换为紧凑卡片布局' }));
    expect(screen.getByRole('button', { name: '切换为舒展卡片布局' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: '重置筛选与布局' }));
    expect(screen.getByRole('button', { name: '综合' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '切换为紧凑卡片布局' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.queryByRole('button', { name: '重置筛选与布局' })).not.toBeInTheDocument();
  });
});
