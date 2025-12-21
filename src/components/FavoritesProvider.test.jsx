import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from './FavoritesProvider';
import { flushStorageQueue } from '../utils/storageQueue';

function Panel() {
  const favorites = useFavorites();
  return (
    <div>
      <div data-testid="count">{favorites.favoriteIds.size}</div>
      <div data-testid="updatedAt">{String(favorites.updatedAt ?? '')}</div>
      <button type="button" onClick={() => favorites.toggleFavorite(101)}>
        toggle
      </button>
      <button type="button" onClick={() => favorites.clearFavorites()}>
        clear
      </button>
      <button
        type="button"
        onClick={() => {
          const json = favorites.exportFavoritesBackup();
          favorites.clearFavorites();
          favorites.importFavoritesBackup(json, { mode: 'replace' });
        }}
      >
        export-import
      </button>
    </div>
  );
}

describe('FavoritesProvider', () => {
  it('renders children and exposes reactive favorites state/actions', async () => {
    window.localStorage.clear();
    flushStorageQueue();

    render(
      <FavoritesProvider>
        <Panel />
      </FavoritesProvider>,
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');

    await act(async () => {
      screen.getByRole('button', { name: 'toggle' }).click();
    });

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('updatedAt').textContent).not.toBe('');

    await act(async () => {
      screen.getByRole('button', { name: 'export-import' }).click();
    });
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    await act(async () => {
      screen.getByRole('button', { name: 'clear' }).click();
    });
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});
