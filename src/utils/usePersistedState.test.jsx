import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePersistedState } from './usePersistedState';
import { flushStorageQueue, hasPendingStorageWrite } from './storageQueue';

function Harness({ storageKey, options }) {
  const [value, setValue] = usePersistedState(storageKey, 'default', options);
  return (
    <button type="button" onClick={() => setValue('next')}>
      {value}
    </button>
  );
}

describe('usePersistedState', () => {
  it('does not schedule a write on mount when stored value matches', () => {
    window.localStorage.setItem('k', 'v');
    render(<Harness storageKey="k" />);
    expect(screen.getByRole('button')).toHaveTextContent('v');
    expect(hasPendingStorageWrite('k')).toBe(false);
  });

  it('schedules a write when value changes', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('k2', 'v2');

    render(<Harness storageKey="k2" />);
    expect(screen.getByRole('button')).toHaveTextContent('v2');

    await user.click(screen.getByRole('button'));
    expect(hasPendingStorageWrite('k2')).toBe(true);

    flushStorageQueue();
    expect(window.localStorage.getItem('k2')).toBe('next');
  });

  it('rehydrates when key changes', async () => {
    window.localStorage.setItem('a', 'A');
    window.localStorage.setItem('b', 'B');

    const { rerender } = render(<Harness storageKey="a" />);
    expect(screen.getByRole('button')).toHaveTextContent('A');

    rerender(<Harness storageKey="b" />);
    expect(screen.getByRole('button')).toHaveTextContent('B');
  });

  it('returns raw stored value when deserialize is falsy', () => {
    window.localStorage.setItem('k-raw', 'RAW');
    render(<Harness storageKey="k-raw" options={{ deserialize: null }} />);
    expect(screen.getByRole('button')).toHaveTextContent('RAW');
  });

  it('falls back when deserialize throws', () => {
    window.localStorage.setItem('k3', 'BAD');

    render(
      <Harness
        storageKey="k3"
        options={{
          deserialize: () => {
            throw new Error('boom');
          },
        }}
      />,
    );

    expect(screen.getByRole('button')).toHaveTextContent('default');
  });

  it('syncs state via guoman:persist event', async () => {
    render(<Harness storageKey="k4" />);
    expect(screen.getByRole('button')).toHaveTextContent('default');

    act(() => {
      window.dispatchEvent(
        new CustomEvent('guoman:persist', { detail: { key: 'k4', value: 'remote' } }),
      );
    });
    expect(screen.getByRole('button')).toHaveTextContent('remote');
  });

  it('does not write when key is empty', async () => {
    const user = userEvent.setup();
    render(<Harness storageKey="" />);
    expect(screen.getByRole('button')).toHaveTextContent('default');

    await user.click(screen.getByRole('button'));
    flushStorageQueue();
    expect(window.localStorage.getItem('')).toBeNull();
  });
});
