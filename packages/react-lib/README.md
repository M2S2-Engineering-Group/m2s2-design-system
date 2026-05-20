# @m2s2/react-lib

React component library by M²S² Engineering Group. Built on Radix UI primitives with full TypeScript support.

For live component demos and prop documentation, see [Storybook](https://storybook.m2s2.io).

## Installation

```bash
npm install @m2s2/react-lib @m2s2/tokens
```

## Peer Dependencies

| Package | Version |
|---------|---------|
| `react` | >=18.0.0 |
| `react-dom` | >=18.0.0 |
| `@m2s2/tokens` | >=1.0.0 |

## Setup

Wrap your app with `M2S2Provider` and import the stylesheet:

```tsx
import { M2S2Provider } from '@m2s2/react-lib';
import '@m2s2/react-lib/styles';

createRoot(document.getElementById('root')!).render(
  <M2S2Provider>
    <App />
  </M2S2Provider>
);
```

## Usage

```tsx
import { Navbar, Footer } from '@m2s2/react-lib';
import type { NavbarConfig, FooterConfig } from '@m2s2/react-lib';

const navbar: NavbarConfig = { brand: 'My App', brandPath: '/', isFixed: true, buttons: [] };
const footer: FooterConfig = { brandName: 'My App', links: [] };

export default function App() {
  return (
    <>
      <Navbar config={navbar} />
      <main>...</main>
      <Footer config={footer} />
    </>
  );
}
```

## Components

| Component | Description |
|-----------|-------------|
| `M2S2Provider` | Top-level app wrapper (includes all providers) |
| `Navbar` | Application navigation bar |
| `Footer` | Application footer |
| `BaseCard` | Foundational card with variant support |
| `BlogCard` | Blog post card with cover image, tags, and reading time |
| `FeatureCard` | Feature highlight card with icon and items |
| `PageHeader` | Full-width page header with title and subtitle |
| `SectionHeader` | Section title with optional label and subtitle |
| `StatRow` | Horizontal row of key statistics |
| `ProcessSteps` | Numbered step sequence |
| `CtaSection` | Call-to-action banner |
| `StatusBadge` | Status indicator in badge or pill variant |
| `DataTable` | Sortable, resizable data table |
| `SubscribeForm` | Email subscription form (anon and authenticated modes) |

## Hooks

| Hook | Description |
|------|-------------|
| `useDialog()` | Open dialogs imperatively from any component |
| `usePanel()` | Open panels/drawers imperatively from any component |
| `useTheme()` | Read and set the current theme |

Dialog and panel hooks require `DialogProvider` and `PanelProvider` (both included in `M2S2Provider`) to be present in the tree.
