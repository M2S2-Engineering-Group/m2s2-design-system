# @m2s2/tokens

Design token system for M²S² Engineering Group — CSS custom properties, SCSS partials, and theme utilities that power the [`@m2s2/ng-lib`](https://www.npmjs.com/package/@m2s2/ng-lib) component library.

Framework-agnostic: works with any CSS, SCSS, or Angular project.

---

## Installation

```bash
npm install @m2s2/tokens
```

---

## Usage

### Import all tokens

In your global stylesheet:

```scss
@use '@m2s2/tokens';
```

This registers all CSS custom properties on `:root` and applies dark-first theming.

### Import individual partials

```scss
@use '@m2s2/tokens/src/colors';
@use '@m2s2/tokens/src/typography';
@use '@m2s2/tokens/src/spacing';
```

---

## Theming

Tokens are dark-first. Light mode is applied via a `data-theme` attribute or the `prefers-color-scheme` media query.

```html
<!-- Dark (default) -->
<html>

<!-- Light -->
<html data-theme="light">
```

---

## Brand Overrides

Copy `brand-override.example.scss` into your project and import it after the tokens to override colors, gradients, or typography:

```scss
@use '@m2s2/tokens';
@use './brand-override';
```

Any CSS custom property can be overridden — you only need to redefine what you want to change.

---

## Token Categories

| File | Contents |
|---|---|
| `src/primitives` | Raw color palette (non-semantic) |
| `src/colors` | Semantic color tokens (`--color-primary`, `--color-bg`, etc.) |
| `src/typography` | Font family, size, weight, and line-height tokens |
| `src/spacing` | Spacing scale (`--space-1` through `--space-16`) |
| `src/motion` | Transition duration and easing tokens |
| `src/layout` | Breakpoints and container width tokens |
| `src/utilities` | Shared utility classes |
| `src/overlay` | Angular Material overlay and panel animation styles |
| `src/themes/light` | Light mode overrides (`data-theme="light"`) |
| `src/themes/auto` | Auto mode via `prefers-color-scheme` |

---

## License

MIT © [M²S² Engineering Group](https://m2s2.io)
