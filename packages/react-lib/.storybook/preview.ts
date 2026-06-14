import type { Preview } from '@storybook/react';
import '../src/styles/tokens.scss';
import { applyTheme, applyColorMode, listenForThemeChanges, sharedGlobalTypes } from '../../storybook-shared/src';

listenForThemeChanges((brandTheme, colorMode) => {
  applyTheme(brandTheme);
  applyColorMode(colorMode);
});

const preview: Preview = {
  globalTypes: sharedGlobalTypes,

  decorators: [
    (story, context) => {
      applyTheme(context.globals['brandTheme'] ?? 'm2s2');
      applyColorMode(context.globals['colorMode'] ?? 'dark');
      return story();
    },
  ],

  parameters: {
    backgrounds: { disable: true },
    layout: 'padded',
    options: {
      storySort: {
        order: ['Welcome', 'Brand Configurator', 'Components'],
      },
    },
  },
};

export default preview;
