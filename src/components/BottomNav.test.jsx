import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BottomNav from './BottomNav';

describe('BottomNav', () => {
  it('marks active route via aria-current', () => {
    render(
      <MemoryRouter
        initialEntries={['/favorites']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BottomNav />
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: /收藏/u, hidden: true });
    expect(link).toHaveAttribute('aria-current', 'page');
  });
});
