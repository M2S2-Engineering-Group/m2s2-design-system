# @m2s2/ng-lib

Production-ready Angular component library by [M²S² Engineering Group](https://m2s2.io).  
Built with Angular signals, standalone components, and Angular Material — designed for dark-first theming via CSS custom properties.

📖 **[Storybook](https://storybook.m2s2.io)** — live component demos and usage examples

---

## Installation

```bash
npm install @m2s2/ng-lib @m2s2/tokens
```

### Peer dependencies

```bash
npm install @angular/cdk @angular/material @angular/animations
```

---

## Setup

### 1. Import the design tokens

In your global stylesheet (`styles.scss`):

```scss
@use '@m2s2/tokens';
```

To override brand colors or typography, copy `node_modules/@m2s2/tokens/brand-override.example.scss` into your project and import it after the tokens:

```scss
@use '@m2s2/tokens';
@use './brand-override';
```

### 2. Configure theming

The library uses a `data-theme` attribute for light/dark mode. Set it on `<html>` or `<body>`:

```html
<html data-theme="dark">
```

### 3. Add Material and animations

In `app.config.ts`:

```typescript
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimationsAsync()]
};
```

---

## Components

| Component | Selector | Description |
|---|---|---|
| **Navbar** | `<m2s2-navbar>` | Top navigation bar with gradient branding |
| **Footer** | `<m2s2-footer>` | Site footer with links and social icons |
| **Page Header** | `<m2s2-page-header>` | Hero-style section header with title and subtitle |
| **Section Header** | `<m2s2-section-header>` | In-page section label and heading |
| **CTA Section** | `<m2s2-cta-section>` | Call-to-action banner with gradient border |
| **Cards** | `<m2s2-card>` | Content card with optional image, title, and body |
| **Stat Row** | `<m2s2-stat-row>` | Horizontal row of key metric stats |
| **Process Steps** | `<m2s2-process-steps>` | Numbered step-by-step process display |
| **Status Badge** | `<m2s2-status-badge>` | Inline status indicator chip |
| **Dropdown** | `<m2s2-dropdown>` | Accessible dropdown menu |
| **Data Table** | `<m2s2-data-table>` | Sortable, paginated data table |
| **Subscribe Form** | `<m2s2-subscribe-form>` | Email subscription form with loading and error states |
| **Dialog** | Service-driven | Modal dialog with configurable actions |
| **Panel** | Service-driven | Slide-in side panel with configurable actions |

---

## Services

### Dialog

```typescript
import { M2S2DialogService } from '@m2s2/ng-lib';

@Component({ ... })
export class MyComponent {
  private dialog = inject(M2S2DialogService);

  openDialog() {
    this.dialog.dialog({
      title: 'Confirm',
      message: 'Are you sure?',
      actions: [
        { label: 'Cancel', style: 'ghost', value: false },
        { label: 'Confirm', style: 'primary', value: true },
      ],
    });
  }
}
```

### Panel

```typescript
import { M2S2PanelService } from '@m2s2/ng-lib';

@Component({ ... })
export class MyComponent {
  private panel = inject(M2S2PanelService);

  openPanel() {
    this.panel.panel({
      title: 'Details',
      side: 'right',
      bodyComponent: MyDetailComponent,
      bodyInputs: { id: 42 },
    });
  }
}
```

---

## Theming

All colors, spacing, and typography are driven by CSS custom properties defined in `@m2s2/tokens`. Override any token in your own stylesheet — no Sass configuration required.

See the full token reference in the [`@m2s2/tokens`](https://www.npmjs.com/package/@m2s2/tokens) package.

---

## License

MIT © [M²S² Engineering Group](https://m2s2.io)
