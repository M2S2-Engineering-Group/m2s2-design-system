import type { Meta, StoryObj } from '@storybook/vue3';
import type { AnchorDropdownItem, ClickableDropdownItem } from '@m2s2/models';
import Dropdown from './Dropdown.vue';

const BTN_STYLE = `
  .story-btn { padding: 8px 16px; background: #7c3aed; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
`;

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
An accessible dropdown menu. Place your trigger inside the default slot and pass an \`items\` array of \`AnchorDropdownItem\` or \`ClickableDropdownItem\` from \`@m2s2/models\`.

\`\`\`vue
<Dropdown :items="items">
  <button class="btn">Open ▾</button>
</Dropdown>
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

export const ClickableItems: Story = {
  name: 'Clickable Items',
  render: () => ({
    components: { Dropdown },
    styles: [BTN_STYLE],
    setup: () => ({ items: clickItems }),
    template: `<Dropdown :items="items"><button class="story-btn">Actions ▾</button></Dropdown>`,
  }),
};

export const AnchorItems: Story = {
  name: 'Anchor (Link) Items',
  render: () => ({
    components: { Dropdown },
    styles: [BTN_STYLE],
    setup: () => ({ items: anchorItems }),
    template: `<Dropdown :items="items"><button class="story-btn">Links ▾</button></Dropdown>`,
  }),
};

export const AlignRight: Story = {
  name: 'Right-aligned Menu',
  render: () => ({
    components: { Dropdown },
    styles: [BTN_STYLE],
    setup: () => ({ items: clickItems }),
    template: `
      <div style="display:flex;justify-content:flex-end;width:300px">
        <Dropdown :items="items" align="right"><button class="story-btn">Account ▾</button></Dropdown>
      </div>
    `,
  }),
};
