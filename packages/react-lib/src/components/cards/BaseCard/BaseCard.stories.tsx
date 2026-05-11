import type { Meta, StoryObj } from '@storybook/react';
import { BaseCard } from './BaseCard';

const meta: Meta<typeof BaseCard> = {
  title: 'Cards/BaseCard',
  component: BaseCard,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'raised', 'accent'] },
    featured: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof BaseCard>;

const Content = () => (
  <>
    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Card Title</h3>
    <p style={{ margin: 0, color: 'var(--color-on-surface-muted)' }}>
      This is the children slot. Any markup can go here.
    </p>
  </>
);

export const Default: Story  = { args: { variant: 'default', featured: false, children: <Content /> } };
export const Raised: Story   = { args: { variant: 'raised',  featured: false, children: <Content /> } };
export const Accent: Story   = { args: { variant: 'accent',  featured: false, children: <Content /> } };
export const Featured: Story = { args: { variant: 'default', featured: true,  children: <Content /> } };
