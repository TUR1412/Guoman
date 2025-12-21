import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { toggleFavorite } from './favoritesStore';
import { useFavoriteIds, useFavoritesUpdatedAt, useIsFavorite } from './useIsFavorite';
import { flushStorageQueue } from './storageQueue';

function Status({ animeId }) {
  const favorited = useIsFavorite(animeId);
  return <div data-testid="status">{favorited ? 'on' : 'off'}</div>;
}

function Count() {
  const ids = useFavoriteIds();
  return <div data-testid="count">{ids.size}</div>;
}

function UpdatedAt() {
  const updatedAt = useFavoritesUpdatedAt();
  return <div data-testid="updatedAt">{String(updatedAt ?? '')}</div>;
}

describe('useIsFavorite', () => {
  it('reacts to store updates via useSyncExternalStore', async () => {
    window.localStorage.clear();
    flushStorageQueue();

    render(
      <>
        <Status animeId={123} />
        <Count />
        <UpdatedAt />
      </>,
    );

    expect(screen.getByTestId('status')).toHaveTextContent('off');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('updatedAt')).toHaveTextContent('');

    await act(async () => {
      toggleFavorite(123);
    });

    expect(screen.getByTestId('status')).toHaveTextContent('on');
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('updatedAt').textContent).not.toBe('');

    await act(async () => {
      toggleFavorite(123);
    });

    expect(screen.getByTestId('status')).toHaveTextContent('off');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});
