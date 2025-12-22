import React, { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { usePointerGlow } from './usePointerGlow';

function Harness({ disabled = false } = {}) {
  const ref = useRef(null);
  usePointerGlow(ref, { disabled });
  return <div ref={ref} data-testid="target" />;
}

describe('usePointerGlow', () => {
  it('updates CSS vars on pointer move and resets on leave', () => {
    vi.useFakeTimers();
    const { getByTestId } = render(<Harness />);
    const el = getByTestId('target');

    el.getBoundingClientRect = () => ({
      left: 10,
      top: 20,
      width: 200,
      height: 100,
      right: 210,
      bottom: 120,
      x: 10,
      y: 20,
      toJSON: () => ({}),
    });

    el.dispatchEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        clientX: 60,
        clientY: 70,
      }),
    );

    vi.advanceTimersByTime(20);

    expect(el.style.getPropertyValue('--pointer-active')).toBe('1');
    expect(el.style.getPropertyValue('--pointer-x')).toBe('50px');
    expect(el.style.getPropertyValue('--pointer-y')).toBe('50px');

    el.dispatchEvent(new MouseEvent('pointerleave', { bubbles: true }));
    expect(el.style.getPropertyValue('--pointer-active')).toBe('0');
    expect(el.style.getPropertyValue('--pointer-x')).toBe('0px');
    expect(el.style.getPropertyValue('--pointer-y')).toBe('0px');

    vi.useRealTimers();
  });

  it('does not attach listeners when disabled', () => {
    vi.useFakeTimers();
    const { getByTestId } = render(<Harness disabled />);
    const el = getByTestId('target');

    el.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    el.dispatchEvent(
      new MouseEvent('pointermove', {
        bubbles: true,
        clientX: 10,
        clientY: 10,
      }),
    );

    vi.advanceTimersByTime(20);

    expect(el.style.getPropertyValue('--pointer-active')).toBe('');
    expect(el.style.getPropertyValue('--pointer-x')).toBe('');
    expect(el.style.getPropertyValue('--pointer-y')).toBe('');

    vi.useRealTimers();
  });
});
