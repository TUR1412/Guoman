/** @type { import('@storybook/react-vite').StorybookConfig } */
module.exports = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.@(js|jsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-interactions'],
  docs: {
    autodocs: true,
  },
};
