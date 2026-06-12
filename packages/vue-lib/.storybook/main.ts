import type { StorybookConfig } from '@storybook/vue3-vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs'],
  staticDirs: [{ from: '../src/assets', to: '/assets' }],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  viteFinal: async (config, { configType }) => {
    config.css = {
      ...config.css,
      preprocessorOptions: {
        scss: {
          loadPaths: [resolve(__dirname, '../../..')],
        },
      },
    };
    if (configType === 'PRODUCTION') {
      config.base = '/vue/';
    }
    return config;
  },
};

export default config;
