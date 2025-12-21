import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AnimeList from './AnimeList';
import { FavoritesProvider } from './FavoritesProvider';
import { ToastProvider } from './ToastProvider';
import { categories } from '../data/animeData';
import { STORAGE_KEYS } from '../utils/dataKeys';
import { flushStorageQueue } from '../utils/storageQueue';

describe('AnimeList', () => {
  it('moves tab indicator when switching tabs', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
});
