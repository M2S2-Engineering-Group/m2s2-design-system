import type { Meta, StoryObj } from '@storybook/react';

const ComingSoon = () => (
  <div
    style={{
      padding: '4rem 2rem',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}
  >
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
      React Component Library
    </h1>
    <p style={{ fontSize: '1.1rem', opacity: 0.7, marginBottom: '0.5rem' }}>
      Coming soon — React components built on the M²S² design token system.
    </p>
    <p style={{ fontSize: '0.9rem', opacity: 0.5 }}>
      Angular components are available now in the <strong>Angular</strong> section.
    </p>
  </div>
);

const meta: Meta<typeof ComingSoon> = {
  title: 'React / Coming Soon',
  component: ComingSoon,
  parameters: { layout: 'fullscreen' },
};

export default meta;

export const Default: StoryObj<typeof ComingSoon> = {};
