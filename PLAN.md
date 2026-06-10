# M²S² Design System — Execution Plan

## Overview

Multi-framework design system for the M²S² Engineering Group. All three framework libraries
(`@m2s2/ng-lib`, `@m2s2/react-lib`, `@m2s2/vue-lib`) must stay **in parity** — no component
is added to one library without being added to all three.

**Packages**:
- `@m2s2/tokens` — SCSS design tokens (colors, spacing, typography, transitions)
- `@m2s2/models` — shared TypeScript interfaces consumed by all three libraries
- `@m2s2/ng-lib` — Angular component library
- `@m2s2/react-lib` — React component library
- `@m2s2/vue-lib` — Vue component library
- `storybook-shared` — shared Storybook setup

**Repo**: `M2S2-Engineering-Group/m2s2-design-system`
**Release**: `multi-semantic-release` — coordinated versioning across packages

---

## Component Parity Matrix

The Angular library (`ng-lib`) is the reference implementation. React and Vue must match it.

| Component / Feature        | ng-lib | react-lib | vue-lib |
|----------------------------|--------|-----------|---------|
| StatusBadge                | ✅     | ✅        | ✅      |
| PageHeader                 | ✅     | ✅        | ✅      |
| SectionHeader              | ✅     | ✅        | ✅      |
| StatRow                    | ✅     | ✅        | ✅      |
| ProcessSteps               | ✅     | ✅        | ✅      |
| Footer                     | ✅     | ✅        | ✅      |
| BaseCard                   | ✅     | ✅        | ✅      |
| BlogCard                   | ✅     | ✅        | ✅      |
| FeatureCard                | ✅     | ✅        | ✅      |
| CtaSection                 | ✅     | ✅        | ✅      |
| SubscribeForm              | ✅     | ✅        | ✅      |
| DataTable                  | ✅     | ✅        | ✅      |
| Navbar                     | ✅     | ✅        | ✅      |
| Dialog + service/hook      | ✅     | ✅        | ✅      |
| Panel + service/hook       | ✅     | ✅        | ✅      |
| Chat                       | ✅     | ✅        | ✅      |
| BlogEditor                 | ✅     | ✅        | ✅      |
| LoadingButton              | ✅     | ✅        | ✅      |
| Dropdown                   | ✅     | ✅        | ✅      |
| ThemeProvider / useTheme   | ✅ *   | ✅        | ✅      |
| M2S2Provider / plugin      | ✅ *   | ✅        | ✅      |
| Auth token / useAuth       | ✅ **  | ✅        | ✅      |

\* Angular uses DI (services + tokens), not a wrapper component  
\** Angular exposes `M2S2_AUTH_PROVIDER` injection token + `M2S2AuthProvider` interface

---

## Parity Gaps ✅ (all closed)

---

## Packages

### `@m2s2/tokens` ✅
SCSS design token partials consumed by all three libraries and the platform.
No JS/TS exports — SCSS only.

### `@m2s2/models` ✅
Shared TypeScript interfaces for all component configs. All three libraries import from here;
no model duplication across packages.

- [x] `card.model`, `cta.model`, `data-table.model`, `dialog.model`, `dropdown.model`
- [x] `footer.model`, `navbar.model`, `page-header.model`, `panel.model`, `process-steps.model`
- [x] `section-header.model`, `stat-row.model`, `status-badge.model`, `chat.model`, `blog.model`

---

### `@m2s2/ng-lib` ✅ (minus LoadingButton)

Angular component library. Uses Angular DI for service-backed features (Dialog, Panel, Auth).

**Components** (all with Storybook stories):
- [x] StatusBadge, PageHeader, SectionHeader, StatRow, ProcessSteps
- [x] Footer, BaseCard, BlogCard, FeatureCard, CtaSection
- [x] SubscribeForm, DataTable, Navbar, Dropdown + DropdownItem
- [x] Dialog + `M2S2DialogService`, Panel + `M2S2PanelService`
- [x] Chat, BlogEditor
- [ ] LoadingButton

**Directives**: `loading`, `resizable-col`
**Services**: `M2S2DialogService`, `M2S2PanelService`, `M2S2_AUTH_PROVIDER` token

---

### `@m2s2/react-lib` ✅ (minus Dropdown, useAuth)

React component library. Uses React context + hooks for service-backed features.

**Components**:
- [x] StatusBadge, PageHeader, SectionHeader, StatRow, ProcessSteps
- [x] Footer, BaseCard, BlogCard, FeatureCard, CtaSection
- [x] SubscribeForm, DataTable, Navbar
- [x] DialogProvider + `useDialog`, PanelProvider + `usePanel`
- [x] Chat, BlogEditor, LoadingButton
- [x] ThemeProvider + `useTheme`
- [x] M2S2Provider (composes ThemeProvider + DialogProvider + PanelProvider)
- [ ] Dropdown + DropdownItem
- [ ] `useAuth` hook

---

### `@m2s2/vue-lib` ✅ (minus ThemeProvider, plugin, useAuth, Dropdown)

Vue 3 component library. Uses composables (Vue Composition API) for service-backed features.

**Components**:
- [x] StatusBadge, PageHeader, SectionHeader, StatRow, ProcessSteps
- [x] Footer, BaseCard, BlogCard, FeatureCard, CtaSection
- [x] SubscribeForm, DataTable, Navbar
- [x] Dialog + DialogProvider + `useDialog`, Panel + `usePanel`
- [x] Chat, BlogEditor, LoadingButton
- [ ] ThemeProvider / `useTheme` composable
- [ ] `createM2S2()` Vue plugin
- [ ] `useAuth` composable
- [ ] Dropdown + DropdownItem

---

## Phase 1 — Close Parity Gaps ✅

- [x] **ng-lib**: `LoadingButton` component + story
- [x] **react-lib**: `Dropdown` + `DropdownItem` (pure CSS, matches `@m2s2/models` API)
- [x] **react-lib**: `useAuth` hook + `AuthProvider` (implementation-agnostic, consumer provides auth impl)
- [x] **vue-lib**: `ThemeProvider` component + `useTheme` composable
- [x] **vue-lib**: `createM2S2()` plugin (provides theme at app level, registers provider components globally)
- [x] **vue-lib**: `useAuth` composable + `AuthProvider` component
- [x] **vue-lib**: `Dropdown` + `DropdownItem` components + story

---

## Phase 2 — Test Coverage

Each component in each library needs a test file.

**Angular**: `TestBed` + Angular Testing Library
**React**: Vitest + `@testing-library/react`
**Vue**: Vitest + `@testing-library/vue`

Priority order (highest risk → lowest): DataTable, Navbar, Dialog, Panel, SubscribeForm, BlogEditor, then display-only components.

- [ ] ng-lib: test file per component
- [ ] react-lib: test file per component
- [ ] vue-lib: test file per component

---

## Phase 3 — Storybook Completeness

Every component in every library must have a Storybook story covering default and key variant states.

- [ ] ng-lib: stories for LoadingButton (new), verify all others are current
- [ ] react-lib: stories for Dropdown, useAuth examples
- [ ] vue-lib: stories for ThemeProvider, createM2S2 usage, Dropdown, useAuth

---

## Phase 4 — CI & Release

- [x] `multi-semantic-release` — coordinated versioning; patch/minor/major per conventional commit
- [x] `deps-sync` in `m2s2-platform` — auto-updates on design system release
- [ ] CI job: build + test all packages on PR
- [ ] CI job: Storybook build check on PR (catch broken stories before merge)
- [ ] `@m2s2/web-components` and `@m2s2/vue-lib` — confirm release config is wired in `multi-semantic-release`

---

## Key Architecture Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Models package | Shared `@m2s2/models` | Single source of truth for all config interfaces; prevents drift |
| Angular DI | Services + `InjectionToken` | Idiomatic Angular; consumers swap auth/dialog/panel implementations |
| React context | Providers + hooks | Idiomatic React; `M2S2Provider` composes all contexts in one import |
| Vue composition | Composables + `app.use()` plugin | Idiomatic Vue 3; mirrors React hook pattern |
| No auth built-in | `M2S2AuthProvider` interface / peer dep only | Libraries stay auth-agnostic; AWS Amplify is the expected peer dep |
| Token SCSS only | No JS token exports | Avoids dual-format maintenance; CSS vars handle runtime theming |
