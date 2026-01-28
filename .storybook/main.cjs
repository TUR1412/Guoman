/** @type { import('@storybook/react-vite').StorybookConfig } */
module.exports = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-onboarding',
  ],
  docs: {
    autodocs: true,
  },
};
