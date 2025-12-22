import React, { useEffect } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ToastProvider, useToast } from './ToastProvider';

function CelebrateHarness({ celebrate }) {
  const toast = useToast();

  useEffect(() => {
    toast.success('完成', '这是一条用于测试的提示。', celebrate ? { celebrate: true } : undefined);
  }, [celebrate, toast]);

  return null;
}

describe('ToastProvider', () => {
  it('renders confetti burst for celebrated success toasts', async () => {
    render(
      <ToastProvider>
        <CelebrateHarness celebrate />
      </ToastProvider>,
    );

    expect(await screen.findByText('完成')).toBeInTheDocument();
    expect(await screen.findByTestId('confetti-burst')).toBeInTheDocument();
  });

  it('does not render confetti when celebrate is false', async () => {
    render(
      <ToastProvider>
        <CelebrateHarness celebrate={false} />
      </ToastProvider>,
    );

    expect(await screen.findByText('完成')).toBeInTheDocument();
    expect(screen.queryByTestId('confetti-burst')).not.toBeInTheDocument();
  });
});
