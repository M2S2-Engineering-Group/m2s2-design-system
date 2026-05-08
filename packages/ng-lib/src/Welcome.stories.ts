import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';

@Component({
  selector: 'sb-welcome',
  standalone: true,
  template: `
    <div class="welcome">
      <div class="welcome-hero">
        <h1 class="welcome-title">@m2s2/ng-lib</h1>
        <p class="welcome-subtitle">
          Angular component library by
          <a href="https://m2s2.io" target="_blank" rel="noopener">M²S² Engineering Group</a>
          — production-ready UI components built with Angular 21, standalone architecture,
          and CSS custom property theming.
        </p>
      </div>

      <div class="welcome-section">
        <h2>What you're looking at</h2>
        <p>
          Every component in this library is designed around a token-based design system.
          Colors, gradients, spacing, and typography are all driven by CSS custom properties —
          making the entire library fully brandable without touching a line of component code.
        </p>
      </div>

      <div class="welcome-section">
        <h2>How to explore</h2>
        <p>Use the <strong>sidebar</strong> to navigate between components. Each component has:</p>
        <ul>
          <li><strong>Stories</strong> — live interactive examples of every meaningful state and variant</li>
          <li><strong>Controls</strong> — knobs to change inputs and see the component respond in real time</li>
          <li><strong>Docs</strong> — auto-generated API documentation from the component's inputs and outputs</li>
        </ul>
      </div>

      <div class="welcome-section">
        <h2>Brand theming</h2>
        <p>Use the <strong>paintbrush icon</strong> in the toolbar to switch brand themes:</p>
        <div class="welcome-themes">
          <div class="theme-chip theme-m2s2">M²S² Default</div>
          <div class="theme-chip theme-ocean">Ocean Blue</div>
          <div class="theme-chip theme-emerald">Emerald</div>
          <div class="theme-chip theme-sunset">Sunset</div>
          <div class="theme-chip theme-midnight">Midnight</div>
        </div>
        <p style="margin-top: 16px">
          Use the <strong>moon/sun icon</strong> to toggle between dark and light mode.
        </p>
        <div class="welcome-callout">
          <strong>Coming soon:</strong> A custom brand configurator — input your own colors,
          see every component update live, and export the CSS variables to use in your own project.
        </div>
      </div>

      <div class="welcome-section">
        <h2>Installation</h2>
        <pre class="welcome-code">npm install @m2s2/ng-lib</pre>
        <pre class="welcome-code">import &#123; FeatureCardComponent, NavbarComponent &#125; from '@m2s2/ng-lib';</pre>
        <pre class="welcome-code">:root &#123;
  --color-primary:      #your-primary;
  --color-secondary:    #your-secondary;
  --gradient-brand:     linear-gradient(90deg, #start, #end);
  --gradient-brand-135: linear-gradient(135deg, #start, #end);
&#125;</pre>
      </div>

      <div class="welcome-section">
        <h2>Components</h2>
        <table class="welcome-table">
          <thead>
            <tr><th>Component</th><th>Selector</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td>Navbar</td><td><code>m2-navbar</code></td><td>Responsive top navigation with brand, links, dropdowns, and auth state</td></tr>
            <tr><td>Footer</td><td><code>m2s2-footer</code></td><td>Social links footer with brand name and copyright</td></tr>
            <tr><td>FeatureCard</td><td><code>m2s2-feature-card</code></td><td>Icon + title + body card for feature grids</td></tr>
            <tr><td>BaseCard</td><td><code>m2s2-base-card</code></td><td>Generic content card with gradient border</td></tr>
            <tr><td>BlogCard</td><td><code>m2s2-blog-card</code></td><td>Post card with cover image, tags, date, and summary</td></tr>
            <tr><td>CtaSection</td><td><code>m2s2-cta-section</code></td><td>Full-width call-to-action band</td></tr>
            <tr><td>PageHeader</td><td><code>m2s2-page-header</code></td><td>Page title + subtitle header block</td></tr>
            <tr><td>SectionHeader</td><td><code>m2s2-section-header</code></td><td>Section title + label for content sections</td></tr>
            <tr><td>ProcessSteps</td><td><code>m2s2-process-steps</code></td><td>Numbered step sequence</td></tr>
            <tr><td>StatRow</td><td><code>m2s2-stat-row</code></td><td>Horizontal row of key metrics</td></tr>
            <tr><td>StatusBadge</td><td><code>m2s2-status-badge</code></td><td>Colored status indicator in badge or pill variant</td></tr>
            <tr><td>Dialog</td><td><code>M2S2DialogService</code></td><td>Branded Material dialog with configurable action buttons</td></tr>
            <tr><td>Panel</td><td><code>M2S2PanelService</code></td><td>Slide-in side panel (left or right) with optional component body and footer actions</td></tr>
            <tr><td>DataTable</td><td><code>m2s2-data-table</code></td><td>Filterable, searchable, column-resizable data table toolbar</td></tr>
            <tr><td>SubscribeForm</td><td><code>m2s2-subscribe-form</code></td><td>Email subscription form in anonymous or authenticated mode</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--color-bg);
    }
    .welcome {
      max-width: 860px;
      margin: 0 auto;
      padding: 48px 32px;
      color: var(--color-on-bg);
      font-family: var(--font-family-base);
    }
    .welcome-hero {
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 1px solid var(--color-border);
    }
    .welcome-title {
      font-size: 2.5rem;
      font-weight: 700;
      background: var(--gradient-brand);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0 0 16px;
    }
    .welcome-subtitle {
      font-size: 1.1rem;
      color: var(--color-on-surface-muted);
      line-height: 1.7;
      margin: 0;
    }
    .welcome-subtitle a { color: var(--color-primary); }
    .welcome-section {
      margin-bottom: 40px;
    }
    .welcome-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-on-bg);
      margin: 0 0 12px;
    }
    .welcome-section p, .welcome-section li {
      color: var(--color-on-surface-muted);
      line-height: 1.7;
    }
    .welcome-section ul { padding-left: 20px; }
    .welcome-section li { margin-bottom: 6px; }
    .welcome-themes {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .theme-chip {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #fff;
    }
    .theme-m2s2    { background: linear-gradient(135deg, #3b0764, #22d3ee); }
    .theme-ocean   { background: linear-gradient(135deg, #0369a1, #f472b6); }
    .theme-emerald { background: linear-gradient(135deg, #065f46, #818cf8); }
    .theme-sunset  { background: linear-gradient(135deg, #c2410c, #f43f5e); }
    .theme-midnight { background: linear-gradient(135deg, #3730a3, #fbbf24); }
    .welcome-callout {
      margin-top: 16px;
      padding: 14px 18px;
      border-left: 3px solid var(--color-primary);
      background: var(--color-surface-raised);
      border-radius: 0 8px 8px 0;
      color: var(--color-on-surface);
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .welcome-code {
      background: var(--color-surface-raised);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 14px 18px;
      font-size: 0.85rem;
      color: var(--color-secondary);
      overflow-x: auto;
      margin: 8px 0;
      white-space: pre;
    }
    .welcome-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .welcome-table th {
      text-align: left;
      padding: 10px 12px;
      border-bottom: 2px solid var(--color-border);
      color: var(--color-on-bg);
      font-weight: 600;
    }
    .welcome-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--color-border);
      color: var(--color-on-surface-muted);
    }
    .welcome-table code {
      background: var(--color-surface-raised);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.8rem;
      color: var(--color-primary);
    }
  `],
})
class WelcomeComponent {}

const meta: Meta<WelcomeComponent> = {
  title:     'Welcome',
  component: WelcomeComponent,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    actions:  { disable: true },
  },
};

export default meta;

export const Introduction: StoryObj<WelcomeComponent> = {
  name: 'Introduction',
};
