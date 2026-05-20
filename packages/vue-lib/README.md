# @m2s2/vue-lib

Vue 3 component library by M²S² Engineering Group. Built with Composition API and `<script setup>` throughout.

For live component demos and prop documentation, see [Storybook](https://storybook.m2s2.io).

## Installation

```bash
npm install @m2s2/vue-lib @m2s2/tokens
```

## Peer Dependencies

| Package | Version |
|---------|---------|
| `vue` | >=3.0.0 |
| `@m2s2/models` | >=0.1.0 |
| `@m2s2/tokens` | >=1.0.0 |

## Setup

Import the stylesheet in your entry file:

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import '@m2s2/vue-lib/styles';

createApp(App).mount('#app');
```

## Usage

```vue
<script setup lang="ts">
import { Navbar, Footer } from '@m2s2/vue-lib';
import type { NavbarConfig, FooterConfig } from '@m2s2/vue-lib';

const navbar: NavbarConfig = { brand: 'My App', brandPath: '/', isFixed: true, buttons: [] };
const footer: FooterConfig = { brandName: 'My App', links: [] };
</script>

<template>
  <Navbar :config="navbar" />
  <main>...</main>
  <Footer :config="footer" />
</template>
```

## Components

| Component | Description |
|-----------|-------------|
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
| `Dialog` | Modal dialog (use with `DialogProvider`) |
| `Panel` | Side panel/drawer (use with `PanelProvider`) |

## Dialog and Panel

Dialog and Panel are provided via Vue's `provide`/`inject` system. Wrap your app (or the relevant subtree) with the providers and use the composables to open them imperatively:

```vue
<script setup lang="ts">
import { DialogProvider, PanelProvider } from '@m2s2/vue-lib';
</script>

<template>
  <DialogProvider>
    <PanelProvider>
      <RouterView />
    </PanelProvider>
  </DialogProvider>
</template>
```

```vue
<script setup lang="ts">
import { useDialog, usePanel } from '@m2s2/vue-lib';

const { dialog, confirm } = useDialog();
const { panel } = usePanel();
</script>
```
