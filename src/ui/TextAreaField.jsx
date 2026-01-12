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
  align-items: flex-start;
  gap: 10px;

  min-height: 120px;
  padding: 10px 12px;
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
    --tf-border: var(--danger-border-strong);
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
  margin-top: 2px;

  & > svg {
    width: 18px;
    height: 18px;
    display: block;
  }
`;

const Textarea = styled.textarea`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  padding: 0;
  background: transparent;
  color: var(--text-primary);
  font: inherit;
  resize: vertical;
  line-height: var(--leading-relaxed);

  &::placeholder {
    color: var(--text-tertiary);
  }

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
  color: var(--danger-color);
  font-weight: 600;
`;

export function TextAreaField({
  id,
  label,
  labelSrOnly = false,
  helperText,
  errorText,
  startIcon,
  textareaRef,
  invalid,
  disabled,
  className,
  style,
  ...textareaProps
}) {
  const fallbackId = useId();
  const textareaId = id ?? fallbackId;
  const hintId = useMemo(() => `${textareaId}-hint`, [textareaId]);
  const errorId = useMemo(() => `${textareaId}-error`, [textareaId]);

  const describedBy = [
    textareaProps['aria-describedby'],
    helperText ? hintId : null,
    errorText ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldRoot className={className} style={style}>
      {label ? (
        <LabelRow htmlFor={textareaId} className={labelSrOnly ? 'sr-only' : undefined}>
          {label}
        </LabelRow>
      ) : null}
      <Control
        data-invalid={invalid ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
      >
        {startIcon ? <IconSlot aria-hidden="true">{startIcon}</IconSlot> : null}
        <Textarea
          id={textareaId}
          ref={textareaRef}
          disabled={disabled}
          aria-invalid={invalid ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          {...textareaProps}
        />
      </Control>
      {errorText ? <ErrorText id={errorId}>{errorText}</ErrorText> : null}
      {!errorText && helperText ? <Helper id={hintId}>{helperText}</Helper> : null}
    </FieldRoot>
  );
}

export default TextAreaField;
