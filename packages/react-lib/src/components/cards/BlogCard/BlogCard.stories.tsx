import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { BlogCard } from './BlogCard';

const meta: Meta<typeof BlogCard> = {
  title: 'Cards/BlogCard',
  component: BlogCard,
  tags: ['autodocs'],
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof BlogCard>;

export const WithCoverImage: Story = {
  args: {
    config: {
      slug: 'building-resilient-systems',
      title: 'Building Resilient Systems at Scale',
      date: '2025-04-15T00:00:00.000Z',
      summary: 'How to design distributed systems that stay up even when individual components fail — patterns from the trenches.',
      tags: ['architecture', 'reliability', 'distributed systems'],
      coverImage: 'https://placehold.co/800x450/1a1a2e/a78bfa?text=Cover+Image',
    },
  },
};

export const WithoutCoverImage: Story = {
  args: {
    config: {
      slug: 'engineering-team-velocity',
      title: 'Engineering Team Velocity: Myths and Reality',
      date: '2025-03-10T00:00:00.000Z',
      summary: 'Story points, DORA metrics, and why measuring the wrong things makes teams slower.',
      tags: ['leadership', 'agile', 'metrics'],
    },
  },
};

export const ManyTags: Story = {
  args: {
    config: {
      slug: 'full-stack-observability',
      title: 'Full-Stack Observability on a Budget',
      date: '2025-02-01T00:00:00.000Z',
      summary: 'Traces, logs, and metrics — set up a production-grade observability stack without breaking the bank.',
      tags: ['observability', 'devops', 'opentelemetry', 'grafana', 'loki'],
    },
  },
};
