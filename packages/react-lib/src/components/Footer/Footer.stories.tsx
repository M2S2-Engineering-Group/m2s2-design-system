import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    config: {
      brandName: 'M²S² Engineering Group',
      links: [
        { type: 'linkedin', href: 'https://www.linkedin.com/company/m2s2-engineering-group', label: 'LinkedIn'    },
        { type: 'twitter',  href: 'https://x.com/M2S2Engineering',                           label: 'X (Twitter)' },
        { type: 'github',   href: 'https://github.com/mgmaster24',                            label: 'GitHub'      },
        { type: 'email',    href: 'mailto:hello@m2s2.io',                                     label: 'Email'       },
      ],
    },
  },
};

export const EmailOnly: Story = {
  args: {
    config: {
      brandName: 'Acme Corp',
      links: [{ type: 'email', href: 'mailto:hello@acme.com', label: 'Email' }],
    },
  },
};

export const CustomBrand: Story = {
  name: 'Custom Brand',
  args: {
    config: {
      brandName: 'Your Company Name',
      links: [
        { type: 'linkedin', href: '#', label: 'LinkedIn' },
        { type: 'github',   href: '#', label: 'GitHub'   },
        { type: 'twitter',  href: '#', label: 'Twitter'  },
        { type: 'email',    href: '#', label: 'Email'    },
      ],
    },
  },
};
