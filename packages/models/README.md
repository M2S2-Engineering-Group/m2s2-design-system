# @m2s2/models

Framework-agnostic TypeScript interfaces and types shared across the M²S² design system. All component libraries (`@m2s2/ng-lib`, `@m2s2/react-lib`, `@m2s2/vue-lib`) are built on these models.

## Installation

```bash
npm install @m2s2/models
```

## Usage

```typescript
import type { NavbarConfig, FooterConfig, BlogCardConfig } from '@m2s2/models';
```

## Exports

| Export | Description |
|--------|-------------|
| `NavbarConfig`, `NavbarButton`, `NavbarLoginButton` | Navbar configuration |
| `FooterConfig`, `FooterSocialLink`, `SocialLinkType` | Footer configuration |
| `BlogCardConfig` | Blog card configuration |
| `FeatureCardConfig` | Feature card configuration |
| `CardVariant` | `'default' \| 'raised' \| 'accent'` |
| `CtaConfig` | Call-to-action section configuration |
| `M2S2DialogData`, `DialogAction`, `DialogActionVariant` | Dialog configuration |
| `M2S2PanelData`, `PanelSide` | Panel/drawer configuration |
| `PageHeaderConfig` | Page header configuration |
| `SectionHeaderConfig` | Section header configuration |
| `StatItem` | Stat row item |
| `ProcessStep` | Process steps item |
| `ColumnDef` | Data table column definition |
| `StatusBadgeVariant` | Status badge variant type |
| `STATUS_LABELS` | Default label map for known status values |
| `DropdownItem`, `AnchorDropdownItem`, `ClickableDropdownItem` | Dropdown item variants |
