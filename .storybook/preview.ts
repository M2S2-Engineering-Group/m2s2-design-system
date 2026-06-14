import type { Preview } from '@storybook/html';
import { applyTheme, applyColorMode, sharedGlobalTypes } from '../packages/storybook-shared/src';

const preview: Preview = {
  globalTypes: sharedGlobalTypes,

  decorators: [
    (_story, context) => {
      applyTheme(context.globals['brandTheme'] ?? 'm2s2');
      applyColorMode(context.globals['colorMode'] ?? 'dark');
      return _story();
    },
  ],

  parameters: {
    backgrounds: { disable: true },
    layout: 'padded',
  },
};

export default preview;
