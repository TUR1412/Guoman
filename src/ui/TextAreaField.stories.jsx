import TextAreaField from './TextAreaField';

export default {
  title: 'UI/TextAreaField',
  component: TextAreaField,
  args: {
    placeholder: 'Write something…',
  },
};

export const Default = {};

export const WithLabel = {
  args: {
    label: '反馈内容',
    placeholder: '写下你的想法…',
  },
};

export const Disabled = {
  args: {
    label: 'Disabled',
    disabled: true,
    value: 'Read only',
  },
};

export const Invalid = {
  args: {
    label: '反馈内容',
    value: '...',
    invalid: true,
    errorText: '内容不能为空',
  },
};
