import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function Welcome(): React.JSX.Element {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="welcome">
        <div className="welcome-hero">
          <h1 className="welcome-title">@m2s2/react-lib</h1>
          <p className="welcome-subtitle">
            React component library by{' '}
            <a href="https://m2s2.io" target="_blank" rel="noopener">M²S² Engineering Group</a>
            {' '}— production-ready UI components built with React 18, hooks-first architecture,
            and CSS custom property theming.
          </p>
        </div>

        <div className="welcome-section">
          <h2>What you're looking at</h2>
          <p>
            Every component in this library is designed around a token-based design system.
            Colors, gradients, spacing, and typography are all driven by CSS custom properties —
            making the entire library fully brandable without touching a line of component code.
          </p>
        </div>

        <div className="welcome-section">
          <h2>How to explore</h2>
          <p>Use the <strong>sidebar</strong> to navigate between components. Each component has:</p>
          <ul>
            <li><strong>Stories</strong> — live interactive examples of every meaningful state and variant</li>
            <li><strong>Controls</strong> — knobs to change props and see the component respond in real time</li>
            <li><strong>Docs</strong> — auto-generated API documentation from the component's props</li>
          </ul>
        </div>

        <div className="welcome-section">
          <h2>Brand theming</h2>
          <p>Use the <strong>paintbrush icon</strong> in the toolbar to switch brand themes:</p>
          <div className="welcome-themes">
            {[
              { label: 'M²S² Default', bg: 'linear-gradient(135deg, #3b0764, #22d3ee)' },
              { label: 'Ocean Blue',   bg: 'linear-gradient(135deg, #0369a1, #f472b6)' },
              { label: 'Emerald',      bg: 'linear-gradient(135deg, #065f46, #818cf8)' },
              { label: 'Sunset',       bg: 'linear-gradient(135deg, #c2410c, #f43f5e)' },
              { label: 'Midnight',     bg: 'linear-gradient(135deg, #3730a3, #fbbf24)' },
            ].map(({ label, bg }) => (
              <div key={label} className="theme-chip" style={{ background: bg }}>{label}</div>
            ))}
          </div>
          <p style={{ marginTop: 16 }}>
            Use the <strong>moon/sun icon</strong> to toggle between dark and light mode.
            Or visit <strong>Brand Configurator</strong> in the sidebar to set your own colors.
          </p>
        </div>

        <div className="welcome-section">
          <h2>Installation</h2>
          <pre className="welcome-code">npm install @m2s2/react-lib</pre>
          <pre className="welcome-code">{'import { /* components */ } from \'@m2s2/react-lib\';'}</pre>
          <pre className="welcome-code">{`:root {
  --color-primary:      #your-primary;
  --color-secondary:    #your-secondary;
  --gradient-brand:     linear-gradient(90deg, #start, #end);
  --gradient-brand-135: linear-gradient(135deg, #start, #end);
}`}</pre>
        </div>

        <div className="welcome-section">
          <h2>Components</h2>
          <table className="welcome-table">
            <thead>
              <tr><th>Component</th><th>Import</th><th>Description</th></tr>
            </thead>
            <tbody>
              <tr><td>Navbar</td><td><code>Navbar</code></td><td>Responsive top navigation with brand, links, dropdowns, and auth state</td></tr>
              <tr><td>Footer</td><td><code>Footer</code></td><td>Social links footer with brand name and copyright</td></tr>
              <tr><td>FeatureCard</td><td><code>FeatureCard</code></td><td>Icon + title + body card for feature grids</td></tr>
              <tr><td>BaseCard</td><td><code>BaseCard</code></td><td>Generic content card with gradient border</td></tr>
              <tr><td>BlogCard</td><td><code>BlogCard</code></td><td>Post card with cover image, tags, date, and summary</td></tr>
              <tr><td>CtaSection</td><td><code>CtaSection</code></td><td>Full-width call-to-action band</td></tr>
              <tr><td>PageHeader</td><td><code>PageHeader</code></td><td>Page title + subtitle header block</td></tr>
              <tr><td>SectionHeader</td><td><code>SectionHeader</code></td><td>Section label for content sections</td></tr>
              <tr><td>ProcessSteps</td><td><code>ProcessSteps</code></td><td>Numbered step sequence</td></tr>
              <tr><td>StatRow</td><td><code>StatRow</code></td><td>Horizontal row of key metrics</td></tr>
              <tr><td>StatusBadge</td><td><code>StatusBadge</code></td><td>Colored status indicator in badge or pill variant</td></tr>
              <tr><td>PanelProvider</td><td><code>PanelProvider / usePanelContext</code></td><td>Slide-in side panel (left or right) with optional content and footer actions</td></tr>
              <tr><td>DataTable</td><td><code>DataTable</code></td><td>Filterable, searchable, column-toggleable data table toolbar</td></tr>
              <tr><td>SubscribeForm</td><td><code>SubscribeForm</code></td><td>Email subscription form in anonymous or authenticated mode</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .welcome { max-width: 860px; margin: 0 auto; padding: 48px 32px; color: var(--color-on-bg); font-family: var(--font-family-base); }
        .welcome-hero { margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid var(--color-border); }
        .welcome-title { font-size: 2.5rem; font-weight: 700; background: var(--gradient-brand); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 16px; }
        .welcome-subtitle { font-size: 1.1rem; color: var(--color-on-surface-muted); line-height: 1.7; margin: 0; }
        .welcome-subtitle a { color: var(--color-primary); }
        .welcome-section { margin-bottom: 40px; }
        .welcome-section h2 { font-size: 1.25rem; font-weight: 600; color: var(--color-on-bg); margin: 0 0 12px; }
        .welcome-section p, .welcome-section li { color: var(--color-on-surface-muted); line-height: 1.7; }
        .welcome-section ul { padding-left: 20px; }
        .welcome-section li { margin-bottom: 6px; }
        .welcome-themes { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .theme-chip { padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; color: #fff; }
        .welcome-code { background: var(--color-surface-raised); border: 1px solid var(--color-border); border-radius: 8px; padding: 14px 18px; font-size: 0.85rem; color: var(--color-secondary); overflow-x: auto; margin: 8px 0; white-space: pre; }
        .welcome-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .welcome-table th { text-align: left; padding: 10px 12px; border-bottom: 2px solid var(--color-border); color: var(--color-on-bg); font-weight: 600; }
        .welcome-table td { padding: 10px 12px; border-bottom: 1px solid var(--color-border); color: var(--color-on-surface-muted); }
        .welcome-table code { background: var(--color-surface-raised); padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; color: var(--color-primary); }
      `}</style>
    </div>
  );
}

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
