import type { Preview } from '@storybook/html';
import { applyTheme, applyColorMode, broadcastTheme, sharedGlobalTypes } from '../packages/storybook-shared/src';

const preview: Preview = {
  globalTypes: sharedGlobalTypes,

  decorators: [
    (_story, context) => {
      const brandTheme = context.globals['brandTheme'] ?? 'm2s2';
      const colorMode = context.globals['colorMode'] ?? 'dark';
      applyTheme(brandTheme);
      applyColorMode(colorMode);
      broadcastTheme(brandTheme, colorMode);
      return _story();
    },
  ],

  parameters: {
    backgrounds: { disable: true },
    layout: 'padded',
  },
};

export default preview;
