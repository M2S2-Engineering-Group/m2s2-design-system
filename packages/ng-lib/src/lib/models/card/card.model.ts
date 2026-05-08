export type CardVariant = 'default' | 'raised' | 'accent';

export interface FeatureCardConfig {
  icon?: string;
  title: string;
  body: string;
  items?: string[];
  note?: string;
  featured?: boolean;
}

export interface BlogCardConfig {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  coverImage?: string;
}
