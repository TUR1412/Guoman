import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { setProMembership } from './proMembership';
import { useIsProEnabled, useProMembership } from './useProMembership';
import { flushStorageQueue } from './storageQueue';

function Status() {
  const enabled = useIsProEnabled();
  const pro = useProMembership();
  return (
    <div>
      <div data-testid="enabled">{enabled ? 'on' : 'off'}</div>
      <div data-testid="plan">{pro.plan}</div>
    </div>
  );
}

describe('useProMembership', () => {
  it('reacts to store changes', async () => {
    window.localStorage.clear();
    flushStorageQueue();

    render(<Status />);
    expect(screen.getByTestId('enabled')).toHaveTextContent('off');
    expect(screen.getByTestId('plan')).toHaveTextContent('free');

    await act(async () => {
      setProMembership({ enabled: true, plan: 'supporter' });
    });

    expect(screen.getByTestId('enabled')).toHaveTextContent('on');
    expect(screen.getByTestId('plan')).toHaveTextContent('supporter');

    await act(async () => {
      setProMembership({ enabled: false, plan: 'free' });
    });

    expect(screen.getByTestId('enabled')).toHaveTextContent('off');
    expect(screen.getByTestId('plan')).toHaveTextContent('free');
  });
});
