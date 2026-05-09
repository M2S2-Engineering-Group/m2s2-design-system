import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs'],
  staticDirs: [
    { from: '../src/assets', to: '/assets' },
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  webpackFinal: async (config, { configType }) => {
    if (configType === 'PRODUCTION') {
      config.output = { ...config.output, publicPath: '/angular/' };
    }
    return config;
  },
};

export default config;
