import type { Meta, StoryObj } from '@storybook/html';

const meta: Meta = {
  title: 'Web Components / Coming Soon',
  parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default: StoryObj = {
  render: () => `
    <div style="padding: 4rem 2rem; text-align: center; font-family: system-ui, sans-serif;">
      <h1 style="font-size: 2rem; margin-bottom: 1rem;">Web Component Library</h1>
      <p style="font-size: 1.1rem; opacity: 0.7; margin-bottom: 0.5rem;">
        Coming soon — framework-agnostic components built on the M²S² design token system.
      </p>
      <p style="font-size: 0.9rem; opacity: 0.5;">
        Angular components are available now in the <strong>Angular</strong> section.
      </p>
    </div>
  `,
};
