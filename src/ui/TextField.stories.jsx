import TextField from './TextField';
import { FiSearch } from '../components/icons/feather';

export default {
  title: 'UI/TextField',
  component: TextField,
  args: {
    placeholder: 'Type…',
  },
};

export const Default = {};

export const WithLabel = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
  },
};

export const WithIcon = {
  args: {
    label: 'Search',
    labelSrOnly: true,
    startIcon: <FiSearch />,
    placeholder: 'Search…',
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
    label: 'Username',
    value: 'admin',
    invalid: true,
    errorText: '该用户名不可用',
  },
};
