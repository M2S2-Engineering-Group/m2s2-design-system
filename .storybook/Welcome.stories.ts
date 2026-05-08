import type { Meta } from '@storybook/html';

const meta: Meta = {
  title: 'Welcome',
  parameters: { layout: 'fullscreen' },
};

export default meta;

export const Introduction = {
  render: () => `
    <div style="
      padding: 4rem 2rem;
      text-align: center;
      font-family: system-ui, sans-serif;
      max-width: 640px;
      margin: 0 auto;
    ">
      <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">M²S² Design System</h1>
      <p style="font-size: 1.1rem; opacity: 0.75; margin-bottom: 2rem;">
        A multi-framework component library built on a shared token foundation.
        Use the sidebar to explore components by framework.
      </p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <div style="padding: 1rem 1.5rem; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;">
          <strong>Angular</strong><br/>
          <span style="font-size: 0.875rem; opacity: 0.6;">Production ready</span>
        </div>
        <div style="padding: 1rem 1.5rem; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;">
          <strong>React</strong><br/>
          <span style="font-size: 0.875rem; opacity: 0.6;">Coming soon</span>
        </div>
        <div style="padding: 1rem 1.5rem; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;">
          <strong>Web Components</strong><br/>
          <span style="font-size: 0.875rem; opacity: 0.6;">Coming soon</span>
        </div>
      </div>
    </div>
  `,
};
