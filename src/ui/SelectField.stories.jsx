import SelectField from './SelectField';

export default {
  title: 'UI/SelectField',
  component: SelectField,
};

export const Default = {
  render: (args) => (
    <SelectField {...args}>
      <option value="5">5 星</option>
      <option value="4">4 星</option>
      <option value="3">3 星</option>
      <option value="2">2 星</option>
      <option value="1">1 星</option>
      <option value="0">暂无评分</option>
    </SelectField>
  ),
  args: {
    defaultValue: '5',
  },
};

export const WithLabel = {
  ...Default,
  args: {
    ...Default.args,
    label: '评分',
  },
};

export const Disabled = {
  ...Default,
  args: {
    ...Default.args,
    label: 'Disabled',
    disabled: true,
  },
};

export const Invalid = {
  ...Default,
  args: {
    ...Default.args,
    label: '评分',
    invalid: true,
    errorText: '请选择评分',
  },
};
