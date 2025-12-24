import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { useStorageSignal } from './useStorageSignal';

const Probe = ({ keys }) => {
  const { signal, bump } = useStorageSignal(keys);

  return (
    <div>
      <div data-testid="signal">{signal}</div>
      <button type="button" onClick={bump}>
        bump
      </button>
    </div>
  );
};

describe('useStorageSignal', () => {
  it('bumps signal on demand', () => {
    render(<Probe keys={['foo']} />);

    expect(screen.getByTestId('signal')).toHaveTextContent('0');

    act(() => {
      screen.getByRole('button', { name: 'bump' }).click();
    });

    expect(screen.getByTestId('signal')).toHaveTextContent('1');
  });

  it('reacts to guoman:storage and storage events with key filtering', () => {
    render(<Probe keys={[' foo ', 'bar', '', null]} />);

    expect(screen.getByTestId('signal')).toHaveTextContent('0');

    act(() => {
      window.dispatchEvent(new CustomEvent('guoman:storage', { detail: { key: 'other.key' } }));
    });
    expect(screen.getByTestId('signal')).toHaveTextContent('0');

    act(() => {
      window.dispatchEvent(new CustomEvent('guoman:storage', { detail: { key: 'foo' } }));
    });
    expect(screen.getByTestId('signal')).toHaveTextContent('1');

    const storageEvent = new Event('storage');
    Object.defineProperty(storageEvent, 'key', { value: 'bar' });
    act(() => {
      window.dispatchEvent(storageEvent);
    });
    expect(screen.getByTestId('signal')).toHaveTextContent('2');
  });

  it('treats non-array keys as no filter and ignores events without key', () => {
    render(<Probe keys={null} />);

    expect(screen.getByTestId('signal')).toHaveTextContent('0');

    act(() => {
      window.dispatchEvent(new CustomEvent('guoman:storage', { detail: {} }));
    });
    expect(screen.getByTestId('signal')).toHaveTextContent('0');

    const storageEventWithoutKey = new Event('storage');
    Object.defineProperty(storageEventWithoutKey, 'key', { value: null });
    act(() => {
      window.dispatchEvent(storageEventWithoutKey);
    });
    expect(screen.getByTestId('signal')).toHaveTextContent('0');

    act(() => {
      window.dispatchEvent(new CustomEvent('guoman:storage', { detail: { key: 'any.key' } }));
    });
    expect(screen.getByTestId('signal')).toHaveTextContent('1');
  });

  it('cleans up listeners on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<Probe keys={['foo']} />);

    const guomanCall = addSpy.mock.calls.find((call) => call?.[0] === 'guoman:storage');
    const storageCall = addSpy.mock.calls.find((call) => call?.[0] === 'storage');

    expect(guomanCall).toBeTruthy();
    expect(storageCall).toBeTruthy();

    unmount();

    if (guomanCall) {
      expect(removeSpy).toHaveBeenCalledWith('guoman:storage', guomanCall[1]);
    }
    if (storageCall) {
      expect(removeSpy).toHaveBeenCalledWith('storage', storageCall[1]);
    }

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
