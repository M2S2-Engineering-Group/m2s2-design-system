export { StatusBadge } from './components/StatusBadge/StatusBadge';
export { PageHeader } from './components/PageHeader/PageHeader';
export { SectionHeader } from './components/SectionHeader/SectionHeader';
export { StatRow } from './components/StatRow/StatRow';
export { ProcessSteps } from './components/ProcessSteps/ProcessSteps';
export { Footer } from './components/Footer/Footer';
export { BaseCard } from './components/cards/BaseCard/BaseCard';
export { BlogCard } from './components/cards/BlogCard/BlogCard';
export { FeatureCard } from './components/cards/FeatureCard/FeatureCard';

// Re-export shared models consumed by this library's components
export type {
  StatusBadgeVariant,
  PageHeaderConfig,
  SectionHeaderConfig,
  StatItem,
  ProcessStep,
  FooterConfig,
  FooterSocialLink,
  SocialLinkType,
  CardVariant,
  FeatureCardConfig,
  BlogCardConfig,
} from '@m2s2/models';

export { STATUS_LABELS } from '@m2s2/models';
