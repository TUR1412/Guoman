import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AnimeList from './AnimeList';
import { FavoritesProvider } from './FavoritesProvider';
import { ToastProvider } from './ToastProvider';

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
});
