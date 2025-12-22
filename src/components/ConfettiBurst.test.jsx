import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('ConfettiBurst', () => {
  it('renders particles and sets origin CSS vars', async () => {
    const { default: ConfettiBurst } = await import('./ConfettiBurst');
    render(<ConfettiBurst seed={123} count={10} originX="12%" originY="34%" />);

    const el = screen.getByTestId('confetti-burst');
    expect(el.style.getPropertyValue('--confetti-x')).toBe('12%');
    expect(el.style.getPropertyValue('--confetti-y')).toBe('34%');
    expect(el.querySelectorAll('span').length).toBeGreaterThanOrEqual(6);
  });

  it('returns null when reduced motion is enabled', async () => {
    vi.resetModules();
    vi.doMock('framer-motion', async () => {
      const actual = await vi.importActual('framer-motion');
      return {
        ...actual,
        useReducedMotion: () => true,
      };
    });

    const { default: ConfettiBurst } = await import('./ConfettiBurst');
    render(<ConfettiBurst seed={1} count={10} />);
    expect(screen.queryByTestId('confetti-burst')).not.toBeInTheDocument();

    vi.doUnmock('framer-motion');
  });
});
