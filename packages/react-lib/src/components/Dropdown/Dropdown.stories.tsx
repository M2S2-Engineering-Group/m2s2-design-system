import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import type { AnchorDropdownItem, ClickableDropdownItem } from '@m2s2/models';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
An accessible dropdown menu. Pass a \`trigger\` node and an \`items\` array of \`AnchorDropdownItem\` or \`ClickableDropdownItem\` from \`@m2s2/models\`.

\`\`\`tsx
<Dropdown
  trigger={<button>Open menu</button>}
  items={[
    { id: '1', text: 'Profile', onClick: () => navigate('/profile') },
    { id: '2', text: 'Docs',    href: 'https://docs.example.com' },
  ]}
/>
\`\`\`
        `,
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Dropdown>;

const clickItems: ClickableDropdownItem[] = [
  { id: '1', text: 'Dashboard', onClick: () => alert('Dashboard') },
  { id: '2', text: 'Settings',  onClick: () => alert('Settings') },
  { id: '3', text: 'Sign out',  onClick: () => alert('Sign out') },
];

const anchorItems: AnchorDropdownItem[] = [
  { id: '1', text: 'GitHub',    href: 'https://github.com' },
  { id: '2', text: 'npm',       href: 'https://npmjs.com' },
  { id: '3', text: 'Storybook', href: 'https://storybook.js.org' },
];

const TRIGGER_STYLE: React.CSSProperties = {
  padding: '8px 16px',
  background: '#7c3aed',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
};

export const ClickableItems: Story = {
  name: 'Clickable Items',
  render: () => (
    <Dropdown
      trigger={<button style={TRIGGER_STYLE}>Actions ▾</button>}
      items={clickItems}
    />
  ),
};

export const AnchorItems: Story = {
  name: 'Anchor (Link) Items',
  render: () => (
    <Dropdown
      trigger={<button style={TRIGGER_STYLE}>Links ▾</button>}
      items={anchorItems}
    />
  ),
};

export const AlignRight: Story = {
  name: 'Right-aligned Menu',
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: 300 }}>
      <Dropdown
        trigger={<button style={TRIGGER_STYLE}>Account ▾</button>}
        items={clickItems}
        align="right"
      />
    </div>
  ),
};
