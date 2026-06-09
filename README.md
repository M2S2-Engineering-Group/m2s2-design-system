<p align="center">
  <img src="https://raw.githubusercontent.com/M2S2-Engineering-Group/.github/main/assets/m2s2-logo.png" alt="M²S² Logo" width="220"/>
</p>

<h1 align="center">M²S² Design System</h1>

<p align="center">
  <strong>Engineering Momentum for UI</strong><br/>
  <em>Consistent, production-ready components for Angular, React, and Vue.</em>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@m2s2/ng-lib"><img src="https://img.shields.io/npm/v/@m2s2/ng-lib?label=%40m2s2%2Fng-lib" alt="ng-lib version" /></a>
  <a href="https://www.npmjs.com/package/@m2s2/react-lib"><img src="https://img.shields.io/npm/v/@m2s2/react-lib?label=%40m2s2%2Freact-lib" alt="react-lib version" /></a>
  <a href="https://www.npmjs.com/package/@m2s2/vue-lib"><img src="https://img.shields.io/npm/v/@m2s2/vue-lib?label=%40m2s2%2Fvue-lib" alt="vue-lib version" /></a>
  <a href="https://github.com/sponsors/mgmaster24"><img src="https://img.shields.io/github/sponsors/mgmaster24?style=flat&logo=githubsponsors&label=Sponsor" alt="GitHub Sponsors" /></a>
</p>

---

## Overview

The M²S² Design System is a multi-framework component library built for real production applications.
All three framework libraries — Angular, React, and Vue — share the same design tokens, component API
shapes, and feature set. A component added to one library is added to all three.

---

## Packages

| Package | Description |
|---------|-------------|
| [`@m2s2/tokens`](packages/tokens) | SCSS design tokens — colors, spacing, typography, transitions |
| [`@m2s2/models`](packages/models) | Shared TypeScript interfaces for all component configs |
| [`@m2s2/ng-lib`](packages/ng-lib) | Angular component library |
| [`@m2s2/react-lib`](packages/react-lib) | React component library |
| [`@m2s2/vue-lib`](packages/vue-lib) | Vue 3 component library |

---

## Installation

### Angular

```bash
npm install @m2s2/ng-lib @m2s2/tokens
```

Import the tokens in your global stylesheet:

```scss
// styles.scss
@use '@m2s2/tokens';
```

### React

```bash
npm install @m2s2/react-lib @m2s2/tokens
```

Wrap your app with `M2S2Provider`:

```tsx
import { M2S2Provider } from '@m2s2/react-lib';

export default function App() {
  return <M2S2Provider>{/* your app */}</M2S2Provider>;
}
```

### Vue

```bash
npm install @m2s2/vue-lib @m2s2/tokens
```

Register the plugin:

```ts
import { createApp } from 'vue';
import { createM2S2 } from '@m2s2/vue-lib';
import App from './App.vue';

createApp(App).use(createM2S2()).mount('#app');
```

---

## Components

All components are available in Angular, React, and Vue with matching prop/input APIs.

| Component | Description |
|-----------|-------------|
| `StatusBadge` | Pill badge with status variant and optional label |
| `PageHeader` | Full-width hero title + subtitle |
| `SectionHeader` | Section title, subtitle, and optional action |
| `StatRow` | Row of labelled stat tiles |
| `ProcessSteps` | Numbered step list |
| `Footer` | Site footer with social links |
| `Navbar` | Responsive navigation bar with auth-aware buttons |
| `BaseCard` | Base card with featured variant |
| `BlogCard` | Card for blog post previews |
| `FeatureCard` | Icon + title + body feature card |
| `CtaSection` | Call-to-action banner with button |
| `SubscribeForm` | Email subscription form with loading/error/success states |
| `DataTable` | Filterable, sortable data table with column visibility |
| `Dialog` | Modal dialog with service/hook API |
| `Panel` | Slide-in side panel with service/hook API |
| `Chat` | Threaded chat/message UI |
| `BlogEditor` | Rich post editor for blog content |
| `LoadingButton` | Button with integrated loading spinner state |
| `Dropdown` | Accessible dropdown menu with typed items |

---

## Design Tokens

Tokens are in `@m2s2/tokens` as SCSS partials. All components use them; consumers can import them
directly too.

```scss
@use '@m2s2/tokens' as t;

.my-element {
  color: t.$color-primary;
  padding: t.$space-4;
}
```

**Token categories**: colors (dark/light theme), spacing scale, typography scale, transition speeds,
border radius.

---

## Scaffolding

The [`@m2s2/cli`](https://github.com/M2S2-Engineering-Group/m2s2-cli) tool scaffolds new projects
and generates components pre-wired with this design system:

```bash
# Scaffold a new project
npx @m2s2/cli new my-app

# Generate a component inside an existing project
npx @m2s2/cli generate component MyCard
```

---

## Development

### Prerequisites

- Node.js 22 + npm

### Setup

```bash
git clone https://github.com/M2S2-Engineering-Group/m2s2-design-system.git
cd m2s2-design-system
npm install
```

### Build all packages

```bash
npm run build --workspaces
```

### Build a single package

```bash
npm run build --workspace=packages/ng-lib
npm run build --workspace=packages/react-lib
npm run build --workspace=packages/vue-lib
```

### Storybook

```bash
npm run storybook
```

Storybook runs at `http://localhost:6006` and covers components from all three libraries.

---

## Release

Versioning is handled by `multi-semantic-release` using conventional commits. Each package is
versioned independently; a commit affecting only `react-lib` will only bump that package.

| Commit prefix | Version bump |
|---------------|-------------|
| `fix:` | Patch |
| `feat:` | Minor |
| `feat!:` / `BREAKING CHANGE` | Major |
| `chore:`, `docs:`, `refactor:` | No release |

On release, the `m2s2-platform` repository's `deps-sync` workflow fires automatically and opens a
PR to update the installed `@m2s2` package versions.

---

## Contributing

All three framework libraries must stay in parity. When adding a new component:

1. Add it to `@m2s2/models` first (shared TypeScript interface).
2. Implement it in all three framework libs (`ng-lib`, `react-lib`, `vue-lib`).
3. Add a Storybook story for each implementation.
4. Export from each library's `index.ts`.

See [PLAN.md](PLAN.md) for the full component parity matrix and roadmap.
