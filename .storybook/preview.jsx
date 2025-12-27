import '../src/assets/styles/global.css';

export const parameters = {
  layout: 'fullscreen',
  backgrounds: {
    default: 'dark',
    values: [
      { name: 'dark', value: '#070A10' },
      { name: 'ink', value: '#0B1020' },
      { name: 'light', value: '#F6F7FB' },
    ],
  },
};

export const decorators = [
  (Story) => (
    <div style={{ padding: 'var(--spacing-2xl)' }}>
      <Story />
    </div>
  ),
];
