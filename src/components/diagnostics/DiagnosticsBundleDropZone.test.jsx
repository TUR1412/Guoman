import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import DiagnosticsBundleDropZone from './DiagnosticsBundleDropZone';

describe('DiagnosticsBundleDropZone', () => {
  it('calls onPick on click and onFile on drop', () => {
    const onPick = vi.fn();
    const onFile = vi.fn();

    render(<DiagnosticsBundleDropZone onPick={onPick} onFile={onFile} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onPick).toHaveBeenCalledTimes(1);

    const file = new File(['{}'], 'bundle.json', { type: 'application/json' });
    fireEvent.drop(screen.getByRole('button'), { dataTransfer: { files: [file] } });
    expect(onFile).toHaveBeenCalledTimes(1);
    expect(onFile).toHaveBeenCalledWith(file);
  });
});
