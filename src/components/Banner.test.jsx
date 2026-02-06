import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Banner from './Banner';

const getActiveDotIndex = () =>
  screen
    .getAllByRole('button', { name: /切换到第/ })
    .findIndex((dot) => dot.getAttribute('aria-pressed') === 'true');

describe('Banner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('auto-rotates and respects manual pause', () => {
    render(
      <MemoryRouter>
        <Banner />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: '暂停自动轮播' })).toBeInTheDocument();
    const initialIndex = getActiveDotIndex();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    const movedIndex = getActiveDotIndex();
    expect(movedIndex).not.toBe(initialIndex);

    fireEvent.click(screen.getByRole('button', { name: '暂停自动轮播' }));
    expect(screen.getByRole('button', { name: '恢复自动轮播' })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(getActiveDotIndex()).toBe(movedIndex);
  });

  it('changes slide when pagination dot is clicked', () => {
    render(
      <MemoryRouter>
        <Banner />
      </MemoryRouter>,
    );

    const targetDot = screen.getAllByRole('button', { name: /切换到第/ })[2];
    fireEvent.click(targetDot);
    expect(targetDot).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports touch swipe to navigate slides', () => {
    render(
      <MemoryRouter>
        <Banner />
      </MemoryRouter>,
    );

    const region = screen.getByLabelText('首页精选轮播');
    const initialIndex = getActiveDotIndex();

    fireEvent.touchStart(region, {
      touches: [{ clientX: 280, clientY: 120 }],
    });
    fireEvent.touchEnd(region, {
      changedTouches: [{ clientX: 120, clientY: 124 }],
    });

    const movedIndex = getActiveDotIndex();
    expect(movedIndex).not.toBe(initialIndex);
  });
});
