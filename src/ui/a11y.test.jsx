import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';

import Button from './Button';
import Dialog from './Dialog';
import IconButton from './IconButton';
import RangeInput from './RangeInput';
import SelectField from './SelectField';
import TextAreaField from './TextAreaField';
import TextField from './TextField';

const runAxe = async (node) =>
  axe.run(node, {
    rules: {
      // jsdom 无法可靠计算真实颜色对比度；颜色对比度由 e2e axe 在真实浏览器环境中兜底。
      'color-contrast': { enabled: false },
    },
  });

describe('ui a11y', () => {
  it('core primitives have no obvious violations', async () => {
    const { container } = render(
      <div>
        <Button>提交</Button>
        <IconButton label="设置" aria-label="设置">
          <svg aria-hidden="true" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="4" />
          </svg>
        </IconButton>
        <TextField label="昵称" placeholder="输入昵称" />
        <SelectField label="分类" defaultValue="">
          <option value="">请选择</option>
          <option value="a">A</option>
        </SelectField>
        <TextAreaField label="签名" placeholder="写点什么…" />
        <RangeInput aria-label="音量" min={0} max={100} defaultValue={50} />
        <Dialog open ariaLabel="测试对话框" onClose={() => {}}>
          <div>内容</div>
        </Dialog>
      </div>,
    );

    const results = await runAxe(container);
    expect(results.violations).toEqual([]);
  });
});
