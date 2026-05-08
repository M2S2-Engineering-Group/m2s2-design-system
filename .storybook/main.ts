import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['./*.stories.ts'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  refs: {
    angular: {
      title: 'Angular',
      url: process.env['STORYBOOK_ANGULAR_URL'] ?? 'http://localhost:6006',
      expanded: true,
    },
    react: {
      title: 'React',
      url: process.env['STORYBOOK_REACT_URL'] ?? 'http://localhost:6007',
    },
    'web-components': {
      title: 'Web Components',
      url: process.env['STORYBOOK_WC_URL'] ?? 'http://localhost:6008',
    },
  },
};

export default config;
