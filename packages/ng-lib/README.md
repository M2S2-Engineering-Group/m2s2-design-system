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
import type { NgNavbarConfig, FooterConfig } from '@m2s2/ng-lib';

@Component({
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  template: `
    <m2-navbar [navbarConfig]="navbar" />
    <main>...</main>
    <m2s2-footer [config]="footer" />
  `,
})
export class AppComponent {
  navbar: NgNavbarConfig = { brand: 'My App', brandRouterOutlet: '/', isFixed: true, buttons: [] };
  footer: FooterConfig = { brandName: 'My App', links: [] };
}
```

## Authentication

`@m2s2/ng-lib` does not ship with a concrete auth implementation. Instead it exposes an `M2S2AuthProvider` interface and an `M2S2_AUTH_PROVIDER` injection token. Components like `NavbarComponent` use this token to show or hide auth-gated items — no auth library is required if you don't need that feature.

### 1. Implement the interface

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { M2S2AuthProvider, M2S2AuthUser } from '@m2s2/ng-lib';
// import whatever auth library you use, e.g. aws-amplify, auth0-angular, angularfire

@Injectable({ providedIn: 'root' })
export class MyAuthProvider implements M2S2AuthProvider {
  loggedIn$ = new BehaviorSubject<boolean>(false);

  async getCurrentUser(): Promise<M2S2AuthUser | undefined> {
    // return { userId: '...', username: '...' } or undefined
  }

  signOut(): void {
    // call your auth library's sign-out
  }
}
```

### 2. Provide it in `app.config.ts`

```typescript
import { M2S2_AUTH_PROVIDER } from '@m2s2/ng-lib';
import { MyAuthProvider } from './auth/my-auth.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    { provide: M2S2_AUTH_PROVIDER, useClass: MyAuthProvider },
  ],
};
```

If `M2S2_AUTH_PROVIDER` is not provided, auth-gated navbar items are simply hidden and no errors are thrown.

## Components

| Component | Selector |
|-----------|----------|
| `NavbarComponent` | `m2-navbar` |
| `FooterComponent` | `m2s2-footer` |
| `BaseCardComponent` | `m2s2-card` |
| `BlogCardComponent` | `m2s2-blog-card` |
| `FeatureCardComponent` | `m2s2-feature-card` |
| `PageHeaderComponent` | `m2s2-page-header` |
| `SectionHeaderComponent` | `m2s2-section-header` |
| `StatRowComponent` | `m2s2-stat-row` |
| `ProcessStepsComponent` | `m2s2-process-steps` |
| `CtaSectionComponent` | `m2s2-cta-section` |
| `StatusBadgeComponent` | `m2s2-status-badge` |
| `DataTableComponent` | `m2s2-data-table` |
| `DropdownItemComponent` | `m2s2-dropdown-item` |
| `DialogComponent` | `m2s2-dialog` |
| `PanelComponent` | `m2s2-panel` |
| `SubscribeFormComponent` | `m2s2-subscribe-form` |

## Services

| Service | Description |
|---------|-------------|
| `M2S2DialogService` | Open and manage dialogs imperatively |
| `M2S2PanelService` | Open and manage panels/drawers imperatively |

## Auth API

| Export | Description |
|--------|-------------|
| `M2S2AuthProvider` | Interface your auth provider must implement |
| `M2S2AuthUser` | Shape of the authenticated user object (`userId`, `username`) |
| `M2S2_AUTH_PROVIDER` | `InjectionToken<M2S2AuthProvider>` — provide your implementation here |
