import React from 'react';
import styled from 'styled-components';
import { FiSearch } from '../icons/feather';
import { TextField } from '../../ui';

const Form = styled.form`
  width: 100%;
`;

export function HeaderSearch({
  id,
  hintId,
  value,
  onChange,
  onSubmit,
  inputRef,
  placeholder,
  style,
}) {
  return (
    <Form role="search" aria-label="站内搜索" onSubmit={onSubmit} style={style}>
      <span id={hintId} className="sr-only">
        快捷键 Ctrl/⌘ + K 打开命令面板，可快速搜索与跳转页面
      </span>
      <TextField
        id={id}
        type="search"
        name="q"
        label="搜索国漫"
        labelSrOnly
        placeholder={placeholder}
        aria-label="搜索国漫"
        aria-keyshortcuts="Control+K Meta+K"
        aria-describedby={hintId}
        autoComplete="off"
        value={value}
        onChange={onChange}
        inputRef={inputRef}
        startIcon={<FiSearch />}
      />
    </Form>
  );
}

export default HeaderSearch;
