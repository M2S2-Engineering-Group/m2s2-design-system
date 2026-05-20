# @m2s2/ng-lib

Angular component library by M²S² Engineering Group. Production-ready UI components built with signals and standalone architecture.

For live component demos and prop documentation, see [Storybook](https://storybook.m2s2.io).

## Installation

```bash
npm install @m2s2/ng-lib @m2s2/models @m2s2/tokens
```

## Peer Dependencies

| Package | Version |
|---------|---------|
| `@angular/animations` | >=21.0.0 |
| `@angular/cdk` | >=21.0.0 |
| `@angular/common` | >=21.0.0 |
| `@angular/core` | >=21.0.0 |
| `@angular/forms` | >=21.0.0 |
| `@angular/material` | >=21.0.0 |
| `@angular/router` | >=21.0.0 |
| `@m2s2/models` | >=0.1.0 |
| `@m2s2/tokens` | >=1.0.0 |

## Setup

Import the global stylesheet in your `styles.scss`:

```scss
@use '@m2s2/tokens';
@use '@m2s2/ng-lib/styles';
```

## Usage

All components are standalone — import only what you need:

```typescript
import { NavbarComponent, FooterComponent } from '@m2s2/ng-lib';
import type { NavbarConfig, FooterConfig } from '@m2s2/models';

@Component({
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  template: `
    <m2s2-navbar [config]="navbar" />
    <main>...</main>
    <m2s2-footer [config]="footer" />
  `,
})
export class AppComponent {
  navbar: NavbarConfig = { brand: 'My App', brandPath: '/', isFixed: true, buttons: [] };
  footer: FooterConfig = { brandName: 'My App', links: [] };
}
```

## Components

| Component | Selector |
|-----------|----------|
| `NavbarComponent` | `m2s2-navbar` |
| `FooterComponent` | `m2s2-footer` |
| `BaseCardComponent` | `m2s2-base-card` |
| `BlogCardComponent` | `m2s2-blog-card` |
| `FeatureCardComponent` | `m2s2-feature-card` |
| `PageHeaderComponent` | `m2s2-page-header` |
| `SectionHeaderComponent` | `m2s2-section-header` |
| `StatRowComponent` | `m2s2-stat-row` |
| `ProcessStepsComponent` | `m2s2-process-steps` |
| `CtaSectionComponent` | `m2s2-cta-section` |
| `StatusBadgeComponent` | `m2s2-status-badge` |
| `DataTableComponent` | `m2s2-data-table` |
| `DropdownComponent` | `m2s2-dropdown` |
| `DialogComponent` | `m2s2-dialog` |
| `PanelComponent` | `m2s2-panel` |
| `SubscribeFormComponent` | `m2s2-subscribe-form` |

## Services

| Service | Description |
|---------|-------------|
| `M2S2DialogService` | Open and manage dialogs imperatively |
| `M2S2PanelService` | Open and manage panels/drawers imperatively |
| `AuthService` | Authentication via AWS Amplify |
