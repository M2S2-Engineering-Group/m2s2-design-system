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
      // Set runtime publicPath so __webpack_require__.p = '/angular/' and dynamic
      // chunk imports resolve to /angular/chunk.js regardless of iframe context.
      config.output = { ...config.output, publicPath: '/angular/' };
      // Storybook's preview.ejs template prepends './' to each file: `import './<%= file %>'`.
      // With output.publicPath='/angular/', file='/angular/main.js' → './/angular/main.js' (broken).
      // Override HtmlWebpackPlugin's own publicPath to '' so file='main.js' → './main.js' (correct).
      const HtmlWebpackPlugin = (await import('html-webpack-plugin')).default;
      config.plugins = config.plugins?.map(plugin => {
        if (plugin instanceof HtmlWebpackPlugin) {
          return new HtmlWebpackPlugin({ ...(plugin as any).userOptions, publicPath: '' });
        }
        return plugin;
      });
    }
    return config;
  },
};

export default config;
