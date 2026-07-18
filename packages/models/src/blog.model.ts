import type { BlogCardConfig } from './card.model';

export interface BlogPost extends BlogCardConfig {
  content: string;
}

export interface BlogDraft {
  title: string;
  slug: string;
  date: string;
  summary: string;
  excerpt?: string;
  tags: string[];
  readingTime: number;
  content: string;
  coverImage?: string;
  series?: { id: string; title: string; part: number; total?: number };
}
