import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { toggleFollowing } from './followingStore';
import { useFollowingEntries, useIsFollowing } from './useIsFollowing';
import { flushStorageQueue } from './storageQueue';

function Status({ animeId }) {
  const following = useIsFollowing(animeId);
  return <div data-testid="status">{following ? 'on' : 'off'}</div>;
}

function Count() {
  const entries = useFollowingEntries();
  return <div data-testid="count">{entries.length}</div>;
}

describe('useIsFollowing', () => {
  it('reacts to store updates via useSyncExternalStore', async () => {
    window.localStorage.clear();
    flushStorageQueue();

    render(
      <>
        <Status animeId={123} />
        <Count />
      </>,
    );

    expect(screen.getByTestId('status')).toHaveTextContent('off');
    expect(screen.getByTestId('count')).toHaveTextContent('0');

    await act(async () => {
      toggleFollowing({ animeId: 123, title: 'x' });
    });

    expect(screen.getByTestId('status')).toHaveTextContent('on');
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    await act(async () => {
      toggleFollowing({ animeId: 123, title: 'x' });
    });

    expect(screen.getByTestId('status')).toHaveTextContent('off');
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});
