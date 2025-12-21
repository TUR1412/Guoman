import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

describe('Header', () => {
  it('opens and closes command palette', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter
        initialEntries={['/']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Header />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: '打开命令面板' }));

    expect(screen.getByRole('dialog', { name: '命令面板' })).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '命令面板' })).not.toBeInTheDocument();
    });
  });
});
