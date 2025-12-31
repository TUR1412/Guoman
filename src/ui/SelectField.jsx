import React, { useId, useMemo } from 'react';
import styled from 'styled-components';

const FieldRoot = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const LabelRow = styled.label`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: 600;
  line-height: var(--leading-snug);
`;

const Control = styled.div`
  --tf-border: var(--control-border);
  --tf-bg: var(--field-bg, var(--control-bg));
  --tf-icon: var(--text-tertiary);

  display: flex;
  align-items: center;
  gap: 10px;

  min-height: 40px;
  padding: 0 12px;
  border-radius: var(--border-radius-md);
  border: 1px solid var(--tf-border);
  background: var(--tf-bg);
  transition: var(--transition);

  &:focus-within {
    --tf-border: rgba(var(--primary-rgb), 0.62);
    --tf-bg: var(--field-bg-focus, var(--control-bg-hover));
    --tf-icon: var(--text-secondary);
    box-shadow: var(--shadow-ring);
  }

  &[data-invalid='true'] {
    --tf-border: rgba(255, 90, 90, 0.75);
  }

  &[data-disabled='true'] {
    opacity: 0.72;
  }
`;

const IconSlot = styled.span`
  width: 18px;
  height: 18px;
  display: inline-grid;
  place-items: center;
  color: var(--tf-icon);

  & > svg {
    width: 18px;
    height: 18px;
    display: block;
  }
`;

const Select = styled.select`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  padding: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image:
    linear-gradient(45deg, transparent 50%, var(--tf-icon) 50%),
    linear-gradient(135deg, var(--tf-icon) 50%, transparent 50%);
  background-position:
    calc(100% - 14px) calc(50% - 2px),
    calc(100% - 9px) calc(50% - 2px);
  background-size:
    5px 5px,
    5px 5px;
  background-repeat: no-repeat;

  &:disabled {
    cursor: not-allowed;
  }
`;

const Helper = styled.div`
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  line-height: var(--leading-snug-plus);
`;

const ErrorText = styled(Helper)`
  color: rgba(255, 90, 90, 0.95);
  font-weight: 600;
`;

export function SelectField({
  id,
  label,
  labelSrOnly = false,
  helperText,
  errorText,
  startIcon,
  selectRef,
  invalid,
  disabled,
  className,
  style,
  children,
  ...selectProps
}) {
  const fallbackId = useId();
  const selectId = id ?? fallbackId;
  const hintId = useMemo(() => `${selectId}-hint`, [selectId]);
  const errorId = useMemo(() => `${selectId}-error`, [selectId]);

  const describedBy = [
    selectProps['aria-describedby'],
    helperText ? hintId : null,
    errorText ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldRoot className={className} style={style}>
      {label ? (
        <LabelRow htmlFor={selectId} className={labelSrOnly ? 'sr-only' : undefined}>
          {label}
        </LabelRow>
      ) : null}
      <Control
        data-invalid={invalid ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
      >
        {startIcon ? <IconSlot aria-hidden="true">{startIcon}</IconSlot> : null}
        <Select
          id={selectId}
          ref={selectRef}
          disabled={disabled}
          aria-invalid={invalid ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          {...selectProps}
        >
          {children}
        </Select>
      </Control>
      {errorText ? <ErrorText id={errorId}>{errorText}</ErrorText> : null}
      {!errorText && helperText ? <Helper id={hintId}>{helperText}</Helper> : null}
    </FieldRoot>
  );
}

export default SelectField;
