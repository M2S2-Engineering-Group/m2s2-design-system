import type { Meta, StoryObj } from '@storybook/vue3';
import Welcome from './Welcome.vue';

const meta: Meta = {
  title: 'Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions:  { disable: true },
  },
};

export default meta;

export const Introduction: StoryObj = {
  name: 'Introduction',
};
