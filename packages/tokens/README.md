# @m2s2/tokens

Design token system for the M²S² design system — CSS custom properties, SCSS variables, and theme utilities covering color, typography, spacing, motion, and layout.

## Installation

```bash
npm install @m2s2/tokens
```

## Usage

### Import everything (recommended)

```scss
@use '@m2s2/tokens';
```

### Import individual token modules

```scss
@use '@m2s2/tokens/src/colors';
@use '@m2s2/tokens/src/spacing';
@use '@m2s2/tokens/src/typography';
```

### CSS custom properties

Tokens are exposed as CSS custom properties and available globally once the stylesheet is imported:

```css
color: var(--m2s2-color-primary);
padding: var(--m2s2-spacing-4);
font-size: var(--m2s2-text-lg);
```

## Token Modules

| Module | Description |
|--------|-------------|
| `src/primitives` | Base token definitions |
| `src/colors` | Color palette |
| `src/typography` | Type scale and utilities |
| `src/spacing` | Spacing and sizing scale |
| `src/motion` | Animation and transition tokens |
| `src/layout` | Breakpoints, grid, containers |
| `src/utilities` | Utility classes and mixins |
| `src/overlay` | Overlay and z-index tokens |
| `src/themes/light` | Light theme overrides |
| `src/themes/auto` | Auto light/dark theme detection |

## Theming

The `auto` theme module automatically switches between light and dark based on the user's system preference. Import it once at the root of your application.
