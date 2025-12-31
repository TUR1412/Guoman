import Button from './Button';
import IconButton from './IconButton';

import { FiMoon, FiSun } from '../components/icons/feather';

export default {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Button',
  },
};

export const Primary = {
  args: {
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
  },
};

export const Ghost = {
  args: {
    variant: 'ghost',
  },
};

export const Disabled = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Icon = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton label="Theme: Dark">
        <FiMoon />
      </IconButton>
      <IconButton label="Theme: Light">
        <FiSun />
      </IconButton>
    </div>
  ),
};
