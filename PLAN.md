# @m2s2/react-lib — Implementation Plan

## Decisions

| Decision | Choice |
|----------|--------|
| Routing | React Router v7 |
| Auth | Peer dependency — consumers bring `aws-amplify` |
| Styling | Plain SCSS + BEM (same as Angular side) |
| Execution order | Components → Infrastructure |

---

## Phase 1 — Minimal Build Setup

Get the package building before writing any components.

- [x] `vite.config.ts` — library mode, ESM + CJS output, SCSS support
- [x] `tsconfig.json` — strict, JSX, path aliases
- [x] `package.json` — `main`, `module`, `types`, `exports`, `build` script
- [x] `sass` dev dep + Vite `css.preprocessorOptions` with `@m2s2/tokens` include path
- [x] `src/index.ts` — barrel file
- [x] `src/styles/tokens.scss` — single `@use '@m2s2/tokens'` import for consumers

**Verify:** `npm run build --workspace=packages/react-lib` produces `dist/` ✅

---

## Phase 2 — Components (simple → complex)

Each component ships with: `.tsx`, `.scss` (BEM), `.stories.tsx`

Angular → React adapter rules:
- `@Input()` / `input()` → props
- `@Output()` / `output()` → callback props (`onChange`, `onFilter`, etc.)
- Config object interfaces kept as-is, re-exported from `src/types/`
- `Observable<T>` callbacks (SubscribeForm) → `Promise<T>` or async functions
- Angular Material overlays → Radix UI primitives
- `routerLink` → React Router `<Link>` / `useNavigate`

### Display-only components

- [x] `StatusBadge` — status string + optional label + badge/pill variant
- [x] `PageHeader` — title + subtitle
- [x] `SectionHeader` — config object
- [x] `StatRow` — array of `StatItem`
- [x] `ProcessSteps` — array of `ProcessStep` (num, name, desc)

### Layout / structural components

- [x] `Footer` — config object + social links (github, linkedin, twitter, email)
- [x] `BaseCard` — featured boolean + variant prop + `children` slot
- [x] `BlogCard` — extends BaseCard
- [x] `FeatureCard` — extends BaseCard

### Interactive components

- [ ] `CtaSection` — title, body, label, route (internal → `<Link>`, external → `<a>`)
- [ ] `SubscribeForm` — anon/auth modes, async callbacks, loading/error/done states
- [ ] `DataTable` — search, status filter, column visibility toggle, resize directive

### Complex / service-backed components

- [ ] `Navbar` — scroll detection, fixed/sticky, desktop + mobile menu, auth-aware, dropdowns
  - Uses Radix `DropdownMenu` for nav dropdowns
  - `onLogin` / `onLogout` callback props (no built-in auth)
  - `loggedIn` boolean prop (consumer controls auth state)
- [ ] `Dialog` + `useDialog()` hook
  - Radix `Dialog` primitive
  - `DialogProvider` wraps app, `useDialog()` exposes `open()`, `confirm()`, `close()`
  - Matches `M2S2DialogService` API surface: `dialog(data)`, `confirm(title, msg)`, `open(component)`
- [ ] `Panel` + `usePanel()` hook
  - Radix `Dialog` (sheet variant) for slide-in panel
  - Left or right positioning via prop
  - `PanelProvider` + `usePanel()` hook matching `M2S2PanelService`

### Providers & hooks

- [ ] `ThemeProvider` — sets `data-theme` attribute, exports `useTheme()` for runtime switching
- [ ] `useAuth()` — thin hook wrapping AWS Amplify (peer dep); exposes `{ user, loggedIn, signOut }`
- [ ] `M2S2Provider` — single wrapper composing `ThemeProvider`, `DialogProvider`, `PanelProvider`

---

## Phase 3 — Exports & Types

- [ ] Finalize `src/index.ts` — all components, hooks, providers, types
- [ ] `src/types/index.ts` — all shared interfaces (NavbarConfig, FooterConfig, etc.)
- [ ] Verify tree-shaking — no accidental side effects in barrel

---

## Phase 4 — Infrastructure

- [ ] `release.config.js` — semantic-release, tag format `react-lib-v{version}`, pkgRoot `dist/`
- [ ] CI job in `.github/workflows/ci.yml` — build + test + release for `react-lib`
- [ ] Vitest config (`vitest.config.ts`) — jsdom environment, coverage
- [ ] Storybook `preview.ts` — import tokens SCSS, `ThemeProvider` decorator, dark/light toolbar toggle ✅ (partial — tokens imported)

---

## Phase 5 — Storybook Polish

- [ ] Story per variant/state for every component
- [ ] Storybook toolbar: theme toggle (dark/light)
- [ ] Verify root Storybook refs still work (port 6007)

---

## New Dependencies

| Package | Purpose |
|---------|---------|
| `@radix-ui/react-dialog` | Dialog + Panel |
| `@radix-ui/react-dropdown-menu` | Navbar dropdowns |
| `@radix-ui/react-visually-hidden` | Accessibility |
| `sass` | SCSS compilation |
| `vitest` | Unit tests |
| `@testing-library/react` | Component tests |
| `react-router` v7 | Routing in Navbar, CtaSection |

Peer deps to add: `aws-amplify`, `react-router`

---

## Component Status

| Component | Built | Stories | Tests |
|-----------|-------|---------|-------|
| StatusBadge | ✅ | ✅ | |
| PageHeader | ✅ | ✅ | |
| SectionHeader | ✅ | ✅ | |
| StatRow | ✅ | ✅ | |
| ProcessSteps | ✅ | ✅ | |
| Footer | ✅ | ✅ | |
| BaseCard | ✅ | ✅ | |
| BlogCard | ✅ | ✅ | |
| FeatureCard | ✅ | ✅ | |
| CtaSection | | | |
| SubscribeForm | | | |
| DataTable | | | |
| Navbar | | | |
| Dialog + useDialog | | | |
| Panel + usePanel | | | |
| ThemeProvider + useTheme | | | |
| useAuth | | | |
| M2S2Provider | | | |
