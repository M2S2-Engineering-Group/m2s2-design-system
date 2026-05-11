import type { Preview } from '@storybook/react';
import '../src/styles/tokens.scss';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
  },
};

export default preview;
